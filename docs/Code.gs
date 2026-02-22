/**
 * 棲所 (Cozy Bistro) - Google Apps Script Backend (Secure Version)
 */

// ==========================================
// 1. Initial Setup (Run this manually ONCE)
// ==========================================
function initialSetup() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  scriptProperties.setProperties({
    'MENU_DB_ID': 'YOUR_MENU_SPREADSHEET_ID_HERE', 
    'ORDER_DB_ID': 'YOUR_ORDER_SPREADSHEET_ID_HERE'
  });
  
  Logger.log("Properties set successfully. Check File -> Project properties -> Script properties.");
}

// ==========================================
// 2. Helper Functions
// ==========================================

// Simple HTML Sanitize function to prevent basic XSS
function sanitizeString(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Format Date
function getFormattedDate() {
  var now = new Date();
  return Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

// Helper to return JSON Response safely
function returnJSON(data) {
  // Return standard JSON shape. GAS handles CORS automatically for Web Apps.
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 3. GET / API - Fetch Menu
// ==========================================
function doGet(e) {
  var lock = LockService.getScriptLock();
  
  // Wait for up to 5 seconds for other processes to finish.
  try {
    lock.waitLock(5000); 
  } catch (e) {
    return returnJSON({ status: "error", message: "System busy, please try again." });
  }

  try {
    const props = PropertiesService.getScriptProperties();
    const menuDbId = props.getProperty('MENU_DB_ID');
    
    if (!menuDbId || menuDbId === 'YOUR_MENU_SPREADSHEET_ID_HERE') {
      throw new Error("請先在 Apps Script 中填妥金鑰並手動執行 initialSetup 函數，以綁定 MENU_DB_ID");
    }
    
    const doc = SpreadsheetApp.openById(menuDbId);
    const sheet = doc.getSheetByName("menu");
    
    if (!sheet) {
      throw new Error("Sheet 'menu' not found in the target spreadsheet.");
    }
    
    const data = sheet.getDataRange().getValues();
    const menuItems = [];
    
    // id(0), name_zh(1), name_en(2), name_jp(3), desc_zh(4), desc_en(5), desc_jp(6),
    // price(7), image(8), cat_zh(9), cat_en(10), cat_jp(11), available(12)
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const available = String(row[12]).toLowerCase().trim();
      
      if (available === 'true' || available === '1' || available === 'yes') {
        menuItems.push({
          id: String(row[0]).trim(),
          name: {
            zh: String(row[1]),
            en: String(row[2]),
            jp: String(row[3])
          },
          description: {
            zh: String(row[4]),
            en: String(row[5]),
            jp: String(row[6])
          },
          price: Number(row[7]),
          image: String(row[8]),
          category: {
            zh: String(row[9]),
            en: String(row[10]),
            jp: String(row[11])
          }
        });
      }
    }
    
    return returnJSON({ status: "success", data: menuItems });
    
  } catch (error) {
    return returnJSON({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// 4. POST / API - Submit Order
// ==========================================
function doPost(e) {
  try {
    // 1. Parse JSON payload
    // If sent via URLSearchParams, it will be in e.parameter.payload
    // If sent as raw text, it will be in e.postData.contents
    var rawData;
    if (e.parameter && e.parameter.payload) {
      rawData = e.parameter.payload;
    } else if (e.postData && e.postData.contents) {
      // Sometimes URLSearchParams contents end up here
      if (e.postData.contents.startsWith("payload=")) {
        // Decode URI component since it's URL encoded
        rawData = decodeURIComponent(e.postData.contents.substring(8).replace(/\+/g, ' '));
      } else {
        rawData = e.postData.contents;
      }
    } else {
      throw new Error("未收到任何資料，或是資料格式錯誤");
    }
    
    var payload = JSON.parse(rawData);
    var deviceId = payload.deviceId;
    
    if (!deviceId) {
       return returnJSON({ status: "error", error_code: 400, message: "Missing Device ID." });
    }

    // 2. Device Rate Limiting (Using CacheService)
    var cache = CacheService.getScriptCache();
    var cacheKey = "RATE_LIMIT_" + deviceId;
    var requestCount = cache.get(cacheKey);

    if (requestCount) {
      requestCount = parseInt(requestCount, 10);
      if (requestCount >= 20) { // Limit to 20 requests per 60 seconds for production
        return returnJSON({ 
          status: "error", 
          error_code: 429, 
          message: "Too many requests. Please wait 60 seconds before submitting another order." 
        });
      }
    }

    // 3. Lock Service for Concurrency
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000); 
    } catch (lockError) {
      return returnJSON({ status: "error", error_code: 503, message: "System busy, please try again." });
    }

    try {
      // 4. Load DB Properties
      const props = PropertiesService.getScriptProperties();
      const menuDbId = props.getProperty('MENU_DB_ID');
      const orderDbId = props.getProperty('ORDER_DB_ID');

      if (!menuDbId || !orderDbId || menuDbId === 'YOUR_MENU_SPREADSHEET_ID_HERE') {
        throw new Error("請先在 Apps Script 中執行 initialSetup 函數，綁定試算表 ID");
      }

      // 5. Read Menu DB
      const menuDoc = SpreadsheetApp.openById(menuDbId);
      const menuSheet = menuDoc.getSheetByName("menu");
      const menuData = menuSheet.getDataRange().getValues();
      
      const priceMap = {}; 
      const nameMap = {};
      
      for (let i = 1; i < menuData.length; i++) {
        let id = String(menuData[i][0]).trim();
        let price = Number(menuData[i][7]); 
        if (id && !isNaN(price)) {
          priceMap[id] = price;
          nameMap[id] = String(menuData[i][1]); 
        }
      }

      // 6. Validate Input & Calculate Total Price
      let totalCalculatedPrice = 0;
      let validItems = [];
      const incomingItems = payload.items; 

      if (!incomingItems || !Array.isArray(incomingItems) || incomingItems.length === 0) {
        throw new Error("Items array is empty or invalid.");
      }

      for (let j = 0; j < incomingItems.length; j++) {
        let reqItem = incomingItems[j];
        let reqId = String(reqItem.id).trim();
        let reqQty = parseInt(reqItem.quantity, 10);

        if (isNaN(reqQty) || reqQty <= 0) continue;

        if (priceMap.hasOwnProperty(reqId)) {
          let realPrice = priceMap[reqId];
          totalCalculatedPrice += (realPrice * reqQty);
          
          validItems.push({
            id: reqId,
            name: nameMap[reqId] || reqId,
            quantity: reqQty,
            unitPrice: realPrice
          });
        } else {
          throw new Error("Invalid item ID detected: " + reqId);
        }
      }

      if (validItems.length === 0) {
        throw new Error("No valid items found in order.");
      }

      // 7. Sanitize Text Inputs
      const safeName = sanitizeString(payload.name);
      const safePhone = sanitizeString(payload.phone);
      const safeTime = sanitizeString(payload.time);
      const safeNote = sanitizeString(payload.note);
      const safeLanguage = sanitizeString(payload.language);
      const itemsJson = JSON.stringify(validItems);

      // 8. Write to Orders DB
      const orderDoc = SpreadsheetApp.openById(orderDbId);
      const orderSheet = orderDoc.getSheetByName("Reservations");
      
      if (!orderSheet) {
        throw new Error("找不到名為 'Reservations' 的工作表，請在訂單試算表內建立它。");
      }

      const newRow = [
        getFormattedDate(),
        safeName,
        safePhone,
        safeTime,
        safeNote,
        itemsJson,             
        totalCalculatedPrice,  
        safeLanguage
      ];

      const lastRow = orderSheet.getLastRow();
      orderSheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

      // 9. Set Cache (MUST wrap numbers in strings to prevent GAS crash)
      // Increment request count safely
      var newCount = requestCount ? requestCount + 1 : 1;
      cache.put(cacheKey, String(newCount), 60);

      // 10. Return strictly valid JSON payload
      return returnJSON({ 
        status: "success", 
        calculatedTotal: totalCalculatedPrice,
        message: "Order placed successfully."
      });

    } finally {
      lock.releaseLock();
    }

  } catch (error) {
    return returnJSON({ status: "error", message: error.toString() });
  }
}
