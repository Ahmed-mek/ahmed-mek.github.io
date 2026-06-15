# 📊 Google Sheets Visitor Logger — Setup Guide

This guide will help you set up a free Google Sheets webhook that logs every visitor to your portfolio automatically.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Portfolio Visitor Log"**
4. In **Row 1**, add these headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Page URL | Referrer | UTM Params | Device | Browser | OS | Screen | Language | Timezone | Location | IP | ISP |

## Step 2: Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toISOString(),
      data.page_url || "",
      data.referrer_url || "",
      data.utm_params || "",
      data.device_type || "",
      data.browser || "",
      data.operating_system || "",
      data.screen_resolution || "",
      data.browser_language || "",
      data.timezone || "",
      data.approx_location || "",
      data.ip_address || "",
      data.isp || ""
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Set:
   - **Description**: Portfolio Visitor Logger
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Authorize** the app when prompted
6. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 4: Add the URL to Your Website

Open `assets/js/script.js` and find this line near the top:

```javascript
const GOOGLE_SHEET_WEBHOOK = "";
```

Paste your Web app URL between the quotes:

```javascript
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbx.../exec";
```

That's it! Every visitor will now be logged to your Google Sheet automatically. 🎉

## Notes
- The Google Sheets free tier supports **~20,000 requests/day** — more than enough
- Data is stored in YOUR Google account — fully private
- You can add charts and filters to analyze your traffic
- The script runs silently — visitors won't notice anything
