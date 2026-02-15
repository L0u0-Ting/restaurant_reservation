# GitHub 部署指南

由於您的環境中未安裝 `gh` (GitHub CLI) 工具，您需要手動在 GitHub 網站上建立 Repository 並推送程式碼。請依照以下步驟操作：

## 1. 在 GitHub 建立 Repository
1. 登入 [GitHub](https://github.com/)。
2. 點擊右上角的 **+** 號，選擇 **New repository**。
3. 輸入 Repository name (例如 `restaurant-reservation`)。
4. 選擇 **Public** (公開) 或 **Private** (私有)。
5. **不要** 勾選 "Initialize this repository with a README" (我們已經有本地專案了)。
6. 點擊 **Create repository**。

## 2. 取得 Personal Access Token (關鍵步驟)
GitHub 不支援使用帳號密碼登入終端機，您必須產生 **Token** 來當作密碼使用：

1. 點擊 GitHub 右上角頭像 -> **Settings**。
2. 左側選單最下方 -> **Developer settings**。
3. 左側選單 -> **Personal access tokens** -> **Tokens (classic)**。
4. 點擊 **Generate new token** -> **Generate new token (classic)**。
5. **Note** 隨便填 (例如: `mac-upload`)。
6. **Expiration** 建議選 `No expiration` (或自訂)。
7. **Select scopes** (權限) **務必勾選 `repo`** (全選 repo 底下所有選項)。
8. 拉到最下方點擊 **Generate token**。
9. **複製那串以 `ghp_` 開頭的亂碼** (這就是您的密碼！)。

## 3. 推送程式碼
回到您的終端機 (Terminal)，執行以下指令：

```bash
# 1. 切換到專案目錄
cd /Users/chenziting/Test_antigravity/restaurant-reservation

# 2. 推送到 GitHub
git push -u origin main
```

**當它詢問 `Password for 'https://...@github.com':` 時：**
*   請貼上您剛剛複製的 **Token**。
*   **注意：貼上時螢幕上不會出現任何字或星號，這是正常的，貼上後直接按 Enter 即可。**

## 4. 部署到 GitHub Pages
如果您希望網頁能被公開訪問：

1. 執行部署指令：
   ```bash
   npm run deploy
   ```

2. 到 GitHub Repo 的 **Settings** > **Pages**，確認 Source 是 `gh-pages` branch。

完成後，您的網站大約 2-5 分鐘後就會上線。
