# Google Apps Script 後端設定指南

本專案使用 Google Apps Script (GAS) 作為後端，接收來自前端的訂單資料並寫入 Google Sheets。

## 1. 建立 Google Sheets
1. 建立一個新的 Google Sheet。
2. 將工作表名稱改為 `menu`（菜單）與 `orders`（點單）。
   - **menu**: 欄位建議 `name`, `description`, `price`, `image`
   - **orders**: 欄位建議 `timestamp`, `name`, `phone`, `time`, `note`, `items`, `totalPrice`

## 2. 建立 Google Apps Script
1. 在 Google Sheet 中，點擊 `擴充功能` > `Apps Script`。
2. 刪除原本的 `myFunction`，貼上以下程式碼：

```javascript
// 處理 POST 請求 (提交訂單)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('orders'); // 確保 Sheet 名稱對應

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    // 解析 JSON body
    // 前端送來的資料結構: { name, phone, time, note, items, totalPrice }
    var data = JSON.parse(e.postData.contents);
    
    // 簡單寫入範例 (依照欄位順序)
    // 假設欄位順序: Timestamp, Name, Phone, Time, Note, Items, TotalPrice
    var newRow = [
      new Date(),
      data.name,
      data.phone,
      data.time,
      data.note,
      data.items,
      data.totalPrice
    ];

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 處理 GET 請求 (獲取菜單 - 這裡僅作簡單回傳測試)
function doGet(e) {
   return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'alive' }))
      .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. 部署 Web App
1. 點擊右上角的 `部署` > `新增部署`。
2. 點擊左側齒輪 icon > `網頁應用程式`。
3. 設定：
   - **說明**: 餐廳預約 API
   - **執行身分**: `我` (您的 email)
   - **誰可以存取**: `任何人` (這點很重要，否則前端無法跨域呼叫)
4. 點擊 `部署`。
5. 複製生成的 **網頁應用程式網址 (Web App URL)**。

## 4. 設定前端環境變數
1. 在專案根目錄建立 `.env` 檔案。
2. 加入以下內容：

```env
VITE_GOOGLE_APP_SCRIPT_URL=您的Web_App_URL
```

3. 重新啟動前端開發伺服器 `npm run dev`。
