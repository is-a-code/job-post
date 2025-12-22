# Combined Google Apps Script

Google Apps Script for batch email distribution and IT job search automation from Google Sheets.

**by LAYER**

## Features

### Email Sender
- Send bulk plain text or HTML emails from Google Sheets
- Personalization with `{{name}}` template variables
- Status tracking (Sent/Failed) with timestamps
- Send individual rows or batch send all

### IT Job Search
- Automated job search using Google Custom Search API
- Auto-fill job listings to Google Sheets
- Smart job categorization (Remote, Senior, Intern, Urgent)
- Dynamic hashtag generation
- Duplicate detection
- Scheduled triggers (Daily, Every 6 Hours)

## Setup

### 1. Create Google Sheet

Create a new Google Sheet with these columns:

**For Email Sender:**
| Column | Content |
|--------|---------|
| A | Name |
| B | Email |
| C | Subject |
| D | Body (HTML or Plain Text) |
| E | Status (auto-filled) |
| F | Timestamp (auto-filled) |

### 2. Add the Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy and paste the contents of `combined-google-apps-script.js`
5. Save the project (Ctrl+S or Cmd+S)

### 3. Configure Credentials

Edit the `JOB_CONFIG` object in the script:

```javascript
var JOB_CONFIG = {
  GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',      // Get from Google Cloud Console
  SEARCH_ENGINE_ID: 'YOUR_SEARCH_ENGINE_ID_HERE',  // Get from Programmable Search Engine
  TARGET_GROUP_ID: 'YOUR_WHATSAPP_GROUP_ID_HERE',  // WhatsApp Group ID (optional)
  // ... other config
};
```

#### Getting Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Custom Search API**
4. Go to **Credentials > Create Credentials > API Key**
5. Copy the API key

#### Getting Search Engine ID
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Create a new search engine
3. Configure sites to search (e.g., linkedin.com, indeed.com, glassdoor.com)
4. Copy the Search Engine ID (cx)

### 4. Authorize the Script

1. Refresh your Google Sheet
2. You'll see new menus: **Email Sender** and **IT Job Search**
3. Click any menu item
4. Authorize the script when prompted

## Usage

### Email Sender Menu
- **Send All Emails (Plain Text)** - Send plain text emails to all rows
- **Send All Emails (HTML)** - Send HTML formatted emails
- **Fill Email Template** - Auto-fill Column D with HTML template
- **Send Selected Row** - Send email for currently selected row
- **Clear Status Column** - Reset status for resending

### IT Job Search Menu
- **Search Jobs Now** - Search and add jobs to sheet
- **Search & Preview** - Preview results without adding
- **Schedule Search** - Set up automated triggers
- **Show Job Statistics** - View job stats and trigger status
- **Clear Duplicate Jobs** - Remove duplicate entries
- **Custom Search Query** - Search with custom keywords
- **Test API Connection** - Verify API setup
- **Show API Config** - Display current configuration

## Job Templates

Jobs are automatically categorized and formatted:

| Category | Trigger Keywords |
|----------|------------------|
| Remote | remote, wfh, work from home, hybrid |
| Senior | senior, lead, principal, architect, director |
| Intern | intern, internship, fresh graduate, entry level |
| Urgent | urgent, immediately, asap, hiring now |
| Default | All other jobs |

## Configuration Options

```javascript
var JOB_CONFIG = {
  SEARCH_QUERY: 'IT Developer job Southeast Asia Japan Germany Europe',
  RESULTS_PER_SEARCH: 10,      // Results per API call
  MAX_JOBS_TO_ADD: 1,          // Jobs to add per search
  DATE_RESTRICT: 'd7',         // Last 7 days
  SHEET_NAME: 'Content',       // Target sheet name
};
```

## API Limits

- Google Custom Search API: 100 free queries/day
- Additional queries: $5 per 1000 queries
- Daily trigger (1/day): ~30 queries/month
- 6-hour trigger (4/day): ~120 queries/month

## License

MIT License - Feel free to use and modify.

## Author

Created by LAYER
