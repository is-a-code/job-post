# Combined Google Apps Script

Google Apps Script for batch email distribution, IT job search automation, and WhatsApp group posting from Google Sheets.

**by LAYER**

## Features

### 1. Email Sender
- Send bulk plain text or HTML emails from Google Sheets
- Personalization with `{{name}}` template variables
- Status tracking (Sent/Failed) with timestamps
- Send individual rows or batch send all

### 2. IT Job Search
- Automated job search using Google Custom Search API
- Auto-fill job listings to Google Sheets
- Smart job categorization (Remote, Senior, Intern, Urgent)
- Dynamic hashtag generation
- Duplicate detection
- Scheduled triggers (Daily, Every 6 Hours)

### 3. WhatsApp Group Poster
- Send scheduled messages to WhatsApp groups via Whapify API
- Schedule-based sending (checks every minute)
- Interval-based sending (every 4 hours)
- Low content email notifications
- Status tracking with color coding

## Setup

### 1. Create Google Sheet

**For Email Sender (separate sheet):**
| Column | Content |
|--------|---------|
| A | Name |
| B | Email |
| C | Subject |
| D | Body (HTML or Plain Text) |
| E | Status (auto-filled) |
| F | Timestamp (auto-filled) |

**For Job Search & WhatsApp Poster (Content sheet):**
| Column | Content |
|--------|---------|
| A | ID |
| B | Content (Message) |
| C | Group ID |
| D | Schedule Date |
| E | Schedule Time |
| F | Status |
| G | Sent At |
| H | Response |

### 2. Add the Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy and paste the contents of `combined-google-apps-script.js`
5. Save the project (Ctrl+S or Cmd+S)

### 3. Configure Credentials

#### Job Search API (JOB_CONFIG)

```javascript
var JOB_CONFIG = {
  GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
  SEARCH_ENGINE_ID: 'YOUR_SEARCH_ENGINE_ID_HERE',
  TARGET_GROUP_ID: 'YOUR_WHATSAPP_GROUP_ID_HERE',
};
```

**Getting Google API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Custom Search API**
4. Go to **Credentials > Create Credentials > API Key**

**Getting Search Engine ID:**
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Create a new search engine
3. Configure sites to search (linkedin.com, indeed.com, etc.)
4. Copy the Search Engine ID (cx)

#### WhatsApp API (WHATSAPP_CONFIG)

```javascript
var WHATSAPP_CONFIG = {
  SECRET: 'YOUR_WHAPIFY_SECRET_HERE',
  ACCOUNT: 'YOUR_WHAPIFY_ACCOUNT_HERE',
  DEFAULT_GROUP_ID: 'YOUR_WHATSAPP_GROUP_ID_HERE',
  NOTIFY_EMAIL: 'YOUR_EMAIL_HERE',
};
```

**Getting Whapify Credentials:**
1. Sign up at [Whapify.id](https://whapify.id/)
2. Connect your WhatsApp account
3. Get your Secret and Account keys from dashboard
4. Get Group ID from WhatsApp Web (format: `12345678901234@g.us`)

### 4. Authorize the Script

1. Refresh your Google Sheet
2. You'll see three menus: **Email Sender**, **IT Job Search**, **WhatsApp Poster**
3. Click any menu item and authorize when prompted

## Usage

### Email Sender Menu
- **Send All Emails (Plain Text/HTML)** - Batch send emails
- **Fill Email Template** - Auto-fill Column D with template
- **Send Selected Row** - Send email for selected row
- **Clear Status Column** - Reset for resending

### IT Job Search Menu
- **Search Jobs Now** - Search and add jobs to sheet
- **Search & Preview** - Preview results without adding
- **Schedule Search** - Set up automated triggers
- **Show Job Statistics** - View stats and trigger status
- **Clear Duplicate Jobs** - Remove duplicates
- **Test API Connection** - Verify API setup

### WhatsApp Poster Menu
- **Send Due Messages Now** - Send scheduled messages
- **Send Next Pending** - Send next message (ignores schedule)
- **Send Selected Row (WA)** - Send selected row immediately
- **Setup WA Trigger** - Configure automated sending
- **Remove WA Triggers** - Stop automated sending
- **Reset Failed to Scheduled** - Retry failed messages
- **Show WA Statistics** - View posting statistics
- **Test WA API Connection** - Verify Whapify API

## Job Templates

| Category | Trigger Keywords |
|----------|------------------|
| Remote | remote, wfh, work from home, hybrid |
| Senior | senior, lead, principal, architect |
| Intern | intern, internship, fresh graduate |
| Urgent | urgent, immediately, asap, hiring now |
| Default | All other jobs |

## API Limits

**Google Custom Search API:** 100 free queries/day

**Whapify API:** Check your plan at whapify.id

## License

MIT License - Feel free to use and modify.

## Author

Created by LAYER
