/**
 * Combined Google Apps Script
 * - Email Sender from Google Sheet
 * - iOS Job Search & Auto-Fill for WhatsApp
 *
 * by LAYER
 */

// ============================================
// MAIN MENU - Combines all features
// ============================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Email Sender')
    .addItem('Send All Emails (Plain Text)', 'sendAllEmails')
    .addItem('Send All Emails (HTML)', 'sendHtmlEmails')
    .addSeparator()
    .addItem('Fill Email Template', 'fillEmailTemplate')
    .addItem('Send Selected Row', 'sendSelectedRowEmail')
    .addItem('Clear Status Column', 'clearStatus')
    .addToUi();

  ui.createMenu('IT Job Search')
    .addItem('Search Jobs Now', 'searchAndFillJobs')
    .addItem('Search & Preview (No Fill)', 'previewJobSearch')
    .addSeparator()
    .addSubMenu(ui.createMenu('Schedule Search')
      .addItem('Daily at 8 AM', 'setupDailyJobSearch')
      .addItem('Every 6 Hours', 'setupJobSearchEvery6Hours')
      .addItem('TEST: Every 5 Minutes', 'setupTestJobSearch'))
    .addItem('Remove Job Search Triggers', 'removeJobSearchTriggers')
    .addSeparator()
    .addItem('Show Job Statistics', 'showJobStatistics')
    .addItem('Clear Duplicate Jobs', 'removeDuplicateJobs')
    .addItem('Custom Search Query', 'customJobSearch')
    .addSeparator()
    .addItem('Preview Templates', 'previewTemplates')
    .addItem('Test API Connection', 'testJobSearchAPI')
    .addItem('Show API Config', 'showAPIConfig')
    .addToUi();
}

// ============================================
// PART 1: EMAIL SENDER
// ============================================

function sendAllEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();

  var successCount = 0;
  var failCount = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var name = row[0];
    var email = row[1];
    var subject = row[2];
    var body = row[3];

    if (!email || row[4] === 'Sent') {
      continue;
    }

    try {
      var personalizedBody = body.replace(/\{\{name\}\}/gi, name);
      var personalizedSubject = subject.replace(/\{\{name\}\}/gi, name);

      MailApp.sendEmail({
        to: email,
        subject: personalizedSubject,
        body: personalizedBody
      });

      sheet.getRange(i + 1, 5).setValue('Sent');
      sheet.getRange(i + 1, 6).setValue(new Date());
      successCount++;

    } catch (error) {
      sheet.getRange(i + 1, 5).setValue('Failed: ' + error.message);
      failCount++;
    }
  }

  SpreadsheetApp.getUi().alert(
    'Email sending complete!\nSent: ' + successCount + '\nFailed: ' + failCount
  );
}

function sendSelectedRowEmail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeRow = sheet.getActiveCell().getRow();

  if (activeRow === 1) {
    SpreadsheetApp.getUi().alert('Please select a data row, not the header.');
    return;
  }

  var rowData = sheet.getRange(activeRow, 1, 1, 4).getValues()[0];
  var name = rowData[0];
  var email = rowData[1];
  var subject = rowData[2];
  var body = rowData[3];

  if (!email) {
    SpreadsheetApp.getUi().alert('No email address found in this row.');
    return;
  }

  try {
    var personalizedHtml = body.replace(/\{\{name\}\}/gi, name);
    var personalizedSubject = subject.replace(/\{\{name\}\}/gi, name);

    MailApp.sendEmail({
      to: email,
      subject: personalizedSubject,
      htmlBody: personalizedHtml
    });

    sheet.getRange(activeRow, 5).setValue('Sent');
    sheet.getRange(activeRow, 6).setValue(new Date());

    SpreadsheetApp.getUi().alert('Email sent successfully to ' + email);

  } catch (error) {
    sheet.getRange(activeRow, 5).setValue('Failed: ' + error.message);
    SpreadsheetApp.getUi().alert('Failed to send email: ' + error.message);
  }
}

function clearStatus() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.getRange(2, 5, lastRow - 1, 2).clearContent();
    SpreadsheetApp.getUi().alert('Status cleared. You can now resend emails.');
  }
}

function sendHtmlEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();

  var successCount = 0;
  var failCount = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var name = row[0];
    var email = row[1];
    var subject = row[2];
    var htmlBody = row[3];

    if (!email || row[4] === 'Sent') {
      continue;
    }

    try {
      var personalizedHtml = htmlBody.replace(/\{\{name\}\}/gi, name);
      var personalizedSubject = subject.replace(/\{\{name\}\}/gi, name);

      MailApp.sendEmail({
        to: email,
        subject: personalizedSubject,
        htmlBody: personalizedHtml
      });

      sheet.getRange(i + 1, 5).setValue('Sent');
      sheet.getRange(i + 1, 6).setValue(new Date());
      successCount++;

    } catch (error) {
      sheet.getRange(i + 1, 5).setValue('Failed: ' + error.message);
      failCount++;
    }
  }

  SpreadsheetApp.getUi().alert(
    'HTML Email sending complete!\nSent: ' + successCount + '\nFailed: ' + failCount
  );
}

function getEmailTemplate() {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin: 0; padding: 0; background-color: #f5f5f5;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"><tr><td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; border-radius: 8px 8px 0 0;"><h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif; font-size: 24px;">Your Email Title Here</h1></td></tr><tr><td style="padding: 40px; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.8; color: #333333;"><p style="margin: 0 0 20px 0;">Hello <strong>{{name}}</strong>,</p><p style="margin: 0 0 20px 0;">Your email content goes here.</p></td></tr></table></td></tr></table></body></html>';
}

function fillEmailTemplate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var template = getEmailTemplate();

  for (var i = 2; i <= lastRow; i++) {
    var name = sheet.getRange(i, 1).getValue();
    if (name && !sheet.getRange(i, 4).getValue()) {
      sheet.getRange(i, 4).setValue(template);
    }
  }

  SpreadsheetApp.getUi().alert('Email template filled for all rows!');
}

// ============================================
// PART 2: IT JOB SEARCH
// ============================================

// TODO: Replace these placeholder values with your actual credentials
var JOB_CONFIG = {
  GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
  SEARCH_ENGINE_ID: 'YOUR_SEARCH_ENGINE_ID_HERE',
  SEARCH_QUERY: 'IT Developer job Southeast Asia Japan Germany Europe',
  RESULTS_PER_SEARCH: 10,
  MAX_JOBS_TO_ADD: 1,
  DATE_RESTRICT: 'd7',
  TARGET_GROUP_ID: 'YOUR_WHATSAPP_GROUP_ID_HERE',
  SHEET_NAME: 'Content',
  COL: {
    ID: 0,
    CONTENT: 1,
    GROUP_ID: 2,
    SCHEDULE_DATE: 3,
    SCHEDULE_TIME: 4,
    STATUS: 5,
    SENT_AT: 6,
    RESPONSE: 7
  }
};

var JOB_TEMPLATES = {
  remote: '━━━━━━━━━━━━━━━━━━━━\n' +
    '*REMOTE JOB ALERT*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*{title}*\n' +
    '{company}\n' +
    'Work From Anywhere\n\n' +
    '*About the Role:*\n' +
    '{snippet}\n\n' +
    '*Apply Now:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  senior: '━━━━━━━━━━━━━━━━━━━━\n' +
    '*SENIOR POSITION*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*{title}*\n' +
    '{company}\n' +
    'Global Opportunity\n\n' +
    '*Role Overview:*\n' +
    '{snippet}\n\n' +
    'Competitive Package\n\n' +
    '*Apply Here:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  intern: '━━━━━━━━━━━━━━━━━━━━\n' +
    '*INTERNSHIP / FRESH GRAD*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*{title}*\n' +
    '{company}\n' +
    'Global Opportunity\n\n' +
    '*Opportunity:*\n' +
    '{snippet}\n\n' +
    'Great for starting your career!\n\n' +
    '*Apply:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  urgent: '━━━━━━━━━━━━━━━━━━━━\n' +
    '*URGENT HIRING*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*{title}*\n' +
    '{company}\n' +
    'Global Opportunity\n\n' +
    '*Job Details:*\n' +
    '{snippet}\n\n' +
    'Apply ASAP!\n\n' +
    '*Quick Apply:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  default: '━━━━━━━━━━━━━━━━━━━━\n' +
    '*JOB OPPORTUNITY*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*{title}*\n' +
    '{company}\n' +
    'Global Opportunity\n\n' +
    '*Description:*\n' +
    '{snippet}\n\n' +
    '*Apply Now:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━'
};

function searchGoogleForJobs(query, startIndex) {
  var searchQuery = query || JOB_CONFIG.SEARCH_QUERY;
  var start = startIndex || 1;

  var apiUrl = 'https://www.googleapis.com/customsearch/v1' +
    '?key=' + encodeURIComponent(JOB_CONFIG.GOOGLE_API_KEY) +
    '&cx=' + encodeURIComponent(JOB_CONFIG.SEARCH_ENGINE_ID) +
    '&q=' + encodeURIComponent(searchQuery) +
    '&num=' + JOB_CONFIG.RESULTS_PER_SEARCH +
    '&start=' + start +
    '&dateRestrict=' + JOB_CONFIG.DATE_RESTRICT;

  try {
    var response = UrlFetchApp.fetch(apiUrl, {
      method: 'get',
      muteHttpExceptions: true
    });

    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();

    if (responseCode !== 200) {
      logJobMessage('API Error: HTTP ' + responseCode + ' - ' + responseText);
      return [];
    }

    var data = JSON.parse(responseText);

    if (!data.items || data.items.length === 0) {
      logJobMessage('No results found for query: ' + searchQuery);
      return [];
    }

    var jobs = data.items.map(function(item) {
      return {
        title: item.title || 'Developer Position',
        link: item.link || '',
        snippet: item.snippet || '',
        displayLink: item.displayLink || ''
      };
    });

    logJobMessage('Found ' + jobs.length + ' job results');
    return jobs;

  } catch (error) {
    logJobMessage('Search error: ' + error.toString());
    return [];
  }
}

function logJobMessage(message) {
  console.log('[JobSearch ' + new Date().toISOString() + '] ' + message);
}

function detectJobCategory(job) {
  var title = (job.title || '').toLowerCase();
  var snippet = (job.snippet || '').toLowerCase();
  var combined = title + ' ' + snippet;

  if (combined.match(/\b(remote|wfh|work from home|kerja dari rumah|fully remote|hybrid)\b/)) {
    return 'remote';
  }

  if (combined.match(/\b(senior|lead|principal|staff|manager|head of|architect|director)\b/)) {
    return 'senior';
  }

  if (combined.match(/\b(intern|internship|magang|fresh graduate|freshgrad|entry level|junior|trainee)\b/)) {
    return 'intern';
  }

  if (combined.match(/\b(urgent|segera|immediately|asap|hiring now|butuh cepat)\b/)) {
    return 'urgent';
  }

  return 'default';
}

function generateHashtags(job, category) {
  var hashtags = ['#Loker', '#Lowongan'];
  var title = (job.title || '').toLowerCase();
  var snippet = (job.snippet || '').toLowerCase();
  var combined = title + ' ' + snippet;

  if (category === 'remote') {
    hashtags.push('#RemoteJob', '#WFH', '#KerjaDariRumah');
  } else if (category === 'senior') {
    hashtags.push('#SeniorDeveloper', '#TechLead', '#Hiring');
  } else if (category === 'intern') {
    hashtags.push('#Magang', '#Internship', '#FreshGraduate');
  } else if (category === 'urgent') {
    hashtags.push('#UrgentHiring', '#LokerSegera', '#HiringNow');
  }

  if (combined.match(/\b(java|spring)\b/)) hashtags.push('#Java');
  if (combined.match(/\b(python|django|flask)\b/)) hashtags.push('#Python');
  if (combined.match(/\b(javascript|js|node|react|vue|angular)\b/)) hashtags.push('#JavaScript');
  if (combined.match(/\b(golang|go)\b/)) hashtags.push('#Golang');
  if (combined.match(/\b(php|laravel)\b/)) hashtags.push('#PHP');
  if (combined.match(/\b(ios|swift)\b/)) hashtags.push('#iOS');
  if (combined.match(/\b(android|kotlin)\b/)) hashtags.push('#Android');
  if (combined.match(/\b(devops|aws|cloud|azure|gcp)\b/)) hashtags.push('#DevOps');
  if (combined.match(/\b(data|machine learning|ml|ai)\b/)) hashtags.push('#DataScience');
  if (combined.match(/\b(fullstack|full stack|full-stack)\b/)) hashtags.push('#FullStack');
  if (combined.match(/\b(frontend|front end|front-end)\b/)) hashtags.push('#Frontend');
  if (combined.match(/\b(backend|back end|back-end)\b/)) hashtags.push('#Backend');

  if (combined.match(/\b(jakarta)\b/)) hashtags.push('#Jakarta');
  if (combined.match(/\b(bandung)\b/)) hashtags.push('#Bandung');
  if (combined.match(/\b(surabaya)\b/)) hashtags.push('#Surabaya');
  if (combined.match(/\b(indonesia)\b/)) hashtags.push('#Indonesia');
  if (combined.match(/\b(singapore)\b/)) hashtags.push('#Singapore');
  if (combined.match(/\b(malaysia|kuala lumpur)\b/)) hashtags.push('#Malaysia');
  if (combined.match(/\b(thailand|bangkok)\b/)) hashtags.push('#Thailand');
  if (combined.match(/\b(vietnam|ho chi minh|hanoi)\b/)) hashtags.push('#Vietnam');
  if (combined.match(/\b(philippines|manila)\b/)) hashtags.push('#Philippines');
  if (combined.match(/\b(japan|tokyo|osaka)\b/)) hashtags.push('#Japan');
  if (combined.match(/\b(germany|berlin|munich)\b/)) hashtags.push('#Germany');
  if (combined.match(/\b(europe|eu)\b/)) hashtags.push('#Europe');
  if (combined.match(/\b(uk|london|united kingdom)\b/)) hashtags.push('#UK');
  if (combined.match(/\b(netherlands|amsterdam)\b/)) hashtags.push('#Netherlands');

  return hashtags.slice(0, 8).join(' ');
}

function extractCompanyName(job) {
  var title = job.title || '';
  var displayLink = job.displayLink || '';

  var patterns = [
    /\s[-–|]\s(.+?)(?:\s[-–|]|$)/,
    /\sat\s(.+?)(?:\s[-–|]|$)/i,
    /\s@\s?(.+?)(?:\s[-–|]|$)/
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = title.match(patterns[i]);
    if (match && match[1]) {
      var extracted = match[1].trim();
      if (!extracted.match(/^(linkedin|indeed|jobstreet|glassdoor|jobs|careers)/i)) {
        return extracted;
      }
    }
  }

  if (displayLink) {
    var domain = displayLink
      .replace(/^www\./i, '')
      .replace(/\.(com|co\.id|id|io|net|org).*$/i, '')
      .replace(/\./g, ' ');

    if (domain && domain.length > 2) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  return 'Top Company';
}

function formatJobMessage(job) {
  var company = extractCompanyName(job);

  var cleanSnippet = (job.snippet || '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 280);

  var category = detectJobCategory(job);
  var template = JOB_TEMPLATES[category] || JOB_TEMPLATES['default'];
  var hashtags = generateHashtags(job, category);

  var message = template
    .replace(/{title}/g, job.title)
    .replace(/{company}/g, company)
    .replace(/{snippet}/g, cleanSnippet)
    .replace(/{link}/g, job.link)
    .replace(/{hashtags}/g, hashtags);

  return message;
}

function getJobSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(JOB_CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(JOB_CONFIG.SHEET_NAME);

    var headers = ['ID', 'Content', 'Group ID', 'Schedule Date', 'Schedule Time', 'Status', 'Sent At', 'Response'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('white');

    logJobMessage('Created new Content sheet with headers');
  }

  return sheet;
}

function getNextJobId(sheet) {
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return 1;
  }

  var lastId = sheet.getRange(lastRow, JOB_CONFIG.COL.ID + 1).getValue();
  return (parseInt(lastId) || lastRow - 1) + 1;
}

function isJobAlreadyExists(sheet, url) {
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return false;
  }

  var contents = sheet.getRange(2, JOB_CONFIG.COL.CONTENT + 1, lastRow - 1, 1).getValues();

  for (var i = 0; i < contents.length; i++) {
    if (contents[i][0] && contents[i][0].toString().indexOf(url) !== -1) {
      return true;
    }
  }
  return false;
}

function insertJobToSheet(sheet, job) {
  if (isJobAlreadyExists(sheet, job.link)) {
    logJobMessage('Skipping duplicate: ' + job.title);
    return false;
  }

  var content = formatJobMessage(job);
  var lastRow = sheet.getLastRow();
  var newRowNum = lastRow + 1;

  sheet.getRange(newRowNum, JOB_CONFIG.COL.CONTENT + 1).setValue(content);
  sheet.getRange(newRowNum, JOB_CONFIG.COL.GROUP_ID + 1).setValue(JOB_CONFIG.TARGET_GROUP_ID);

  logJobMessage('Added job: ' + job.title);
  return true;
}

function searchAndFillJobs() {
  var sheet = getJobSheet();
  var jobs = searchGoogleForJobs();

  if (jobs.length === 0) {
    try {
      SpreadsheetApp.getUi().alert(
        'No Jobs Found\n\n' +
        'The search returned no results.\n\n' +
        'Try modifying the search query in JOB_CONFIG.SEARCH_QUERY'
      );
    } catch (e) {
      logJobMessage('No jobs found for query');
    }
    return;
  }

  var insertedCount = 0;
  var duplicateCount = 0;
  var maxToAdd = JOB_CONFIG.MAX_JOBS_TO_ADD || 1;

  for (var i = 0; i < jobs.length; i++) {
    if (insertedCount >= maxToAdd) {
      break;
    }

    if (insertJobToSheet(sheet, jobs[i])) {
      insertedCount++;
    } else {
      duplicateCount++;
    }
  }

  var message = 'Job Search Complete!\n\n' +
    'Found: ' + jobs.length + ' jobs (last 7 days)\n' +
    'Added: ' + insertedCount + ' new job(s)\n' +
    'Skipped: ' + duplicateCount + ' duplicate(s)\n\n' +
    'Sheet: ' + JOB_CONFIG.SHEET_NAME;

  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    logJobMessage(message.replace(/\n/g, ' | '));
  }
}

function previewJobSearch() {
  var jobs = searchGoogleForJobs();

  if (jobs.length === 0) {
    SpreadsheetApp.getUi().alert('No results found for current query');
    return;
  }

  var preview = 'Search Preview (' + jobs.length + ' results)\n\n';

  var displayCount = Math.min(jobs.length, 5);
  for (var i = 0; i < displayCount; i++) {
    preview += (i + 1) + '. ' + jobs[i].title.substring(0, 50) + '...\n';
    preview += '   ' + jobs[i].displayLink + '\n\n';
  }

  if (jobs.length > 5) {
    preview += '... and ' + (jobs.length - 5) + ' more results';
  }

  preview += '\n\nUse "Search Jobs Now" to add these to the sheet.';

  SpreadsheetApp.getUi().alert(preview);
}

function setupDailyJobSearch() {
  removeJobSearchTriggers(true);

  ScriptApp.newTrigger('searchAndFillJobs')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  SpreadsheetApp.getUi().alert(
    'Daily Job Search Scheduled!\n\n' +
    'Schedule: Every day at 8:00 AM\n\n' +
    'The script will automatically:\n' +
    '1. Search for IT jobs\n' +
    '2. Add new jobs to the sheet\n' +
    '3. Skip duplicates\n\n' +
    'Query: ' + JOB_CONFIG.SEARCH_QUERY
  );
}

function setupJobSearchEvery6Hours() {
  removeJobSearchTriggers(true);

  ScriptApp.newTrigger('searchAndFillJobs')
    .timeBased()
    .everyHours(6)
    .create();

  SpreadsheetApp.getUi().alert(
    '6-Hour Job Search Scheduled!\n\n' +
    'Schedule: Every 6 hours (4 times/day)\n\n' +
    'The script will automatically:\n' +
    '1. Search for IT jobs\n' +
    '2. Add new jobs to the sheet\n' +
    '3. Skip duplicates\n\n' +
    'Note: Google API free tier = 100 queries/day\n' +
    '4 searches x 1 query = 4 queries used'
  );
}

function setupTestJobSearch() {
  removeJobSearchTriggers(true);

  ScriptApp.newTrigger('searchAndFillJobs')
    .timeBased()
    .everyMinutes(5)
    .create();

  SpreadsheetApp.getUi().alert(
    'TEST Trigger Activated!\n\n' +
    'WARNING: This runs every 5 MINUTES!\n\n' +
    'This will quickly consume your API quota.\n' +
    'Use for testing only, then remove.\n\n' +
    'Remember to remove trigger after testing!'
  );
}

function removeJobSearchTriggers(silent) {
  var triggers = ScriptApp.getProjectTriggers();
  var removedCount = 0;

  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'searchAndFillJobs') {
      ScriptApp.deleteTrigger(trigger);
      removedCount++;
    }
  });

  if (silent !== true) {
    SpreadsheetApp.getUi().alert(
      'Job Search Triggers Removed\n\n' +
      'Removed ' + removedCount + ' trigger(s)'
    );
  }
}

function previewTemplates() {
  var sampleJob = {
    title: 'Senior Software Engineer - Tech Company',
    link: 'https://example.com/job/12345',
    snippet: 'We are looking for experienced developers to join our team. Requirements: 5+ years experience, Java/Python, good communication skills.',
    displayLink: 'example.com'
  };

  var categories = ['default', 'remote', 'senior', 'intern', 'urgent'];
  var preview = 'TEMPLATE PREVIEW\n\n';

  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    preview += '[ ' + cat.toUpperCase() + ' ]\n';

    var template = JOB_TEMPLATES[cat];
    var hashtags = generateHashtags(sampleJob, cat);

    var formatted = template
      .replace(/{title}/g, sampleJob.title)
      .replace(/{company}/g, 'Tech Company')
      .replace(/{snippet}/g, sampleJob.snippet.substring(0, 80) + '...')
      .replace(/{link}/g, '[link]')
      .replace(/{hashtags}/g, hashtags);

    preview += formatted.substring(0, 150) + '...\n\n';
  }

  SpreadsheetApp.getUi().alert(preview);
}

function showJobStatistics() {
  var sheet = getJobSheet();
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    SpreadsheetApp.getUi().alert('No content in the sheet yet');
    return;
  }

  var data = sheet.getRange(2, JOB_CONFIG.COL.STATUS + 1, lastRow - 1, 1).getValues();

  var stats = {
    total: lastRow - 1,
    scheduled: 0,
    sent: 0,
    failed: 0
  };

  data.forEach(function(row) {
    var status = (row[0] || '').toString().toLowerCase();
    if (status === 'sent') stats.sent++;
    else if (status === 'failed') stats.failed++;
    else stats.scheduled++;
  });

  var triggers = ScriptApp.getProjectTriggers();
  var activeJobTrigger = null;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'searchAndFillJobs') {
      activeJobTrigger = triggers[i];
      break;
    }
  }
  var triggerStatus = activeJobTrigger ? 'Active' : 'Not scheduled';

  var message = 'IT Job Search Statistics\n\n' +
    'Total Rows: ' + stats.total + '\n' +
    'Scheduled: ' + stats.scheduled + '\n' +
    'Sent: ' + stats.sent + '\n' +
    'Failed: ' + stats.failed + '\n\n' +
    'Auto Search: ' + triggerStatus + '\n' +
    'Query: ' + JOB_CONFIG.SEARCH_QUERY;

  SpreadsheetApp.getUi().alert(message);
}

function removeDuplicateJobs() {
  var sheet = getJobSheet();
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    SpreadsheetApp.getUi().alert('No content to check');
    return;
  }

  var data = sheet.getRange(2, JOB_CONFIG.COL.CONTENT + 1, lastRow - 1, 1).getValues();

  var seenContent = {};
  var rowsToDelete = [];

  data.forEach(function(row, index) {
    var content = row[0] ? row[0].toString() : '';
    if (seenContent[content]) {
      rowsToDelete.push(index + 2);
    } else if (content) {
      seenContent[content] = true;
    }
  });

  for (var i = rowsToDelete.length - 1; i >= 0; i--) {
    sheet.deleteRow(rowsToDelete[i]);
  }

  SpreadsheetApp.getUi().alert(
    'Duplicate Removal Complete\n\n' +
    'Removed ' + rowsToDelete.length + ' duplicate(s)'
  );
}

function customJobSearch() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    'Custom Job Search',
    'Enter search query (e.g., "Android Developer Jakarta"):',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() === ui.Button.OK) {
    var query = result.getResponseText().trim();

    if (!query) {
      ui.alert('Please enter a search query');
      return;
    }

    var sheet = getJobSheet();
    var jobs = searchGoogleForJobs(query);

    if (jobs.length === 0) {
      ui.alert('No results for: ' + query);
      return;
    }

    var insertedCount = 0;
    jobs.forEach(function(job) {
      if (insertJobToSheet(sheet, job)) {
        insertedCount++;
      }
    });

    ui.alert('Added ' + insertedCount + ' jobs for query: ' + query);
  }
}

function testJobSearchAPI() {
  var apiUrl = 'https://www.googleapis.com/customsearch/v1' +
    '?key=' + encodeURIComponent(JOB_CONFIG.GOOGLE_API_KEY) +
    '&cx=' + encodeURIComponent(JOB_CONFIG.SEARCH_ENGINE_ID) +
    '&q=' + encodeURIComponent(JOB_CONFIG.SEARCH_QUERY) +
    '&num=5' +
    '&dateRestrict=' + JOB_CONFIG.DATE_RESTRICT;

  try {
    var response = UrlFetchApp.fetch(apiUrl, {
      method: 'get',
      muteHttpExceptions: true
    });

    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();

    var message = 'API Test Results\n\n';
    message += 'HTTP Status: ' + responseCode + '\n\n';

    if (responseCode === 200) {
      var data = JSON.parse(responseText);
      if (data.items && data.items.length > 0) {
        message += 'SUCCESS! Found ' + data.items.length + ' results\n\n';
        message += 'First result:\n' + data.items[0].title;
      } else {
        message += 'API works but no results found\n';
        message += 'Try different search query';
      }
    } else if (responseCode === 400) {
      message += 'BAD REQUEST\n';
      message += 'Check Search Engine ID (cx)\n\n';
      message += responseText.substring(0, 500);
    } else if (responseCode === 403) {
      message += 'FORBIDDEN (403)\n\n';
      message += 'Possible causes:\n';
      message += '1. Custom Search API not enabled\n';
      message += '2. API key restrictions\n';
      message += '3. Billing not enabled\n\n';
      message += responseText.substring(0, 500);
    } else {
      message += 'ERROR\n\n';
      message += responseText.substring(0, 500);
    }

    SpreadsheetApp.getUi().alert(message);

  } catch (error) {
    SpreadsheetApp.getUi().alert('Exception:\n\n' + error.toString());
  }
}

function showAPIConfig() {
  var message = 'Current Configuration\n\n';
  message += 'API Key: ' + (JOB_CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' ? '[NOT SET]' : '[CONFIGURED]') + '\n';
  message += 'Search Engine ID: ' + (JOB_CONFIG.SEARCH_ENGINE_ID === 'YOUR_SEARCH_ENGINE_ID_HERE' ? '[NOT SET]' : JOB_CONFIG.SEARCH_ENGINE_ID) + '\n';
  message += 'Search Query: ' + JOB_CONFIG.SEARCH_QUERY + '\n';
  message += 'Date Filter: Last 7 days (' + JOB_CONFIG.DATE_RESTRICT + ')\n';
  message += 'Results fetched: ' + JOB_CONFIG.RESULTS_PER_SEARCH + '\n';
  message += 'Max jobs to add: ' + JOB_CONFIG.MAX_JOBS_TO_ADD + '\n';
  message += 'Target Group: ' + (JOB_CONFIG.TARGET_GROUP_ID === 'YOUR_WHATSAPP_GROUP_ID_HERE' ? '[NOT SET]' : '[CONFIGURED]') + '\n\n';
  message += 'Job Templates:\n';
  message += '- Remote\n';
  message += '- Senior\n';
  message += '- Intern\n';
  message += '- Urgent\n';
  message += '- Default';

  SpreadsheetApp.getUi().alert(message);
}
