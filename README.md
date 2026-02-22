# 棲所 (Cozy Bistro) - 線上點餐與訂位系統

這是一個整合了 React 前端與 Google Apps Script (GAS) 後端的輕量化餐廳線上點餐系統。前端頁面可直接託管於 GitHub Pages 等靜態伺服器，後端則完全依賴 Google Sheets 作為無伺服器（Serverless）的資料庫庫與 API 伺服器。

## 🏗️ 整體架構 (Architecture)

1. **前端 (Frontend)**
   - **核心技術**：React 18, Vite, React Router
   - **部署方式**：靜態網頁託管 (如 GitHub Pages)
   - **功能特點**：RWD 響應式設計、購物車狀態管理、多國語言切換 (中/英/日)、環境變數保護 API 網址。

2. **後端 (Backend)**
   - **核心技術**：Google Apps Script (GAS)
   - **資料庫**：Google Sheets (試算表)
   - **API 形式**：Web App (提供 `doGet` 與 `doPost` 介面)
   - **安全機制**：利用 `CacheService` 實作 IP/Device 頻率限制、利用 `PropertiesService` 隱藏資料庫真實 ID、伺服器端重新計算總價防竄改、XSS 文字過濾。

---

## ✨ 核心功能與對應檔案 (Features & File Structure)

### 📌 1. 環境設定與入口
- **`.env`**：存放前端的環境變數，包含統一的後端 API 網址 (`VITE_API_URL`)。
- **`src/App.jsx`**：前端應用程式的入口點與主要路由 (Routing) 設置，整合了所有的 Context Provider (狀態管理器)。

### 📌 2. 狀態管理 (Context)
主要用於跨元件共享資料，避免 Props 層層傳遞。
- **`src/context/MenuContext.jsx`**：負責呼叫 API 取得菜單資料，並具備前端快取 (Cache) 功能，避免頻繁發送請求。
- **`src/context/CartContext.jsx`**：管理購物車的所有狀態（新增、刪除、清空、計算總價與總數量），並包含購物車圖示的動畫觸發邏輯。
- **`src/context/LanguageContext.jsx`**：管理當前的語系狀態，並提供翻譯函數 `t()` 供全站使用。

### 📌 3. API 服務與資料層 (Services)
- **`src/services/menuService.js`**：封裝了向 GAS 後端發送 `GET` 請求取得菜單 JSON 的邏輯。
- **`src/services/mockData.js`**：當 API 故障或未設定時的本地備用假資料 (Fallback Data)。
- **`src/services/translations.js`**：存放中、英、日三國語言的靜態翻譯字典檔。

### 📌 4. 頁面與 UI 元件 (Components)
- **`src/components/Home.jsx`**：網站首頁，負責展示品牌識別首圖與進入點。
- **`src/components/Menu.jsx`**：動態渲染菜單列表，支援分類顯示與外加購物車彈窗 (Modal)。
- **`src/components/Cart.jsx`**：購物車清單頁面，讓使用者可以檢視已選餐點、調整數量並查看總金額。
- **`src/components/CheckoutForm.jsx`**：結帳表單。負責收集顧客姓名、電話、取餐時間與備註，並在本地生成唯一 `Device ID` 後，將資料封裝為安全的 `URLSearchParams` 格式發送給後端 `doPost` API。
- **`src/components/Location.jsx`**：展示餐廳的實體店面資訊、Google Map 嵌入地圖與交通指引。
- **`src/components/ScrollableQuantity.jsx`**：客製化的精緻滾動式數字選擇器（取代原生的 input number）。
- **`src/components/Header.jsx`**：頂部導覽列，包含 Logo、導覽連結、語言切換器與帶有數量徽章的購物車圖示。
- **`src/components/OrderSuccess.jsx`**：訂單成功送出後的感謝與確認頁面。

### 📌 5. 後端伺服器程式碼 (Backend / GAS)
- **`docs/Code.gs`**：整個系統的靈魂。這是一支需要手動複製並貼上到 Google Apps Script 執行的指令碼檔案。其包含：
  - `initialSetup()`：綁定您的 Google 試算表 ID。
  - `doGet(e)`：查閱「菜單試算表」，過濾出 `available` 為 true 的餐點並轉為 JSON 回傳。
  - `doPost(e)`：接收前端 `CheckoutForm` 送來的訂單。此函數內建防連點 (Rate Limit)、價格重新計算 (防駭客竄改前端價格)、字串去毒 (防止 XSS) 等資安防護機制，最終將乾淨的訂單明細寫入「訂單試算表」的 `Reservations` 分支中。
