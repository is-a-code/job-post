/**
 * Combined Google Apps Script
 * - Email Sender from Google Sheet
 * - IT Job Search & Auto-Fill
 * - WhatsApp Group Poster via Whapify API
 *
 * by LAYER
 */

// ============================================
// MAIN MENU - Combines all features
// ============================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('📧 Email Sender')
    .addItem('Send All Emails (Plain Text)', 'sendAllEmails')
    .addItem('Send All Emails (HTML)', 'sendHtmlEmails')
    .addSeparator()
    .addItem('Fill Email Template', 'fillEmailTemplate')
    .addItem('Send Selected Row', 'sendSelectedRowEmail')
    .addItem('Clear Status Column', 'clearStatus')
    .addToUi();

  ui.createMenu('🔍 IT Job Search')
    .addItem('🔎 Search Jobs Now', 'searchAndFillJobs')
    .addItem('📋 Search & Preview (No Fill)', 'previewJobSearch')
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Schedule Search')
      .addItem('📅 Daily at 8 AM', 'setupDailyJobSearch')
      .addItem('🔄 Every 6 Hours', 'setupJobSearchEvery6Hours')
      .addItem('🧪 TEST: Every 5 Minutes', 'setupTestJobSearch'))
    .addItem('🛑 Remove Job Search Triggers', 'removeJobSearchTriggers')
    .addSeparator()
    .addItem('📊 Show Job Statistics', 'showJobStatistics')
    .addItem('🗑️ Clear Duplicate Jobs', 'removeDuplicateJobs')
    .addItem('🔍 Custom Search Query', 'customJobSearch')
    .addSeparator()
    .addItem('📄 Preview Templates', 'previewTemplates')
    .addItem('🧪 Test API Connection', 'testJobSearchAPI')
    .addItem('⚙️ Show API Config', 'showAPIConfig')
    .addToUi();

  ui.createMenu('📱 WhatsApp Poster')
    .addItem('▶️ Send Due Messages Now', 'sendDueMessages')
    .addItem('▶️ Send Next Pending', 'sendNextPending')
    .addItem('📤 Send Selected Row (WA)', 'sendSelectedRowWhatsApp')
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Setup WA Trigger')
      .addItem('📅 Schedule-Based (1 min check)', 'setupWhatsAppScheduler')
      .addItem('🔄 Every 4 Hours', 'setupWhatsAppTrigger4Hours')
      .addItem('🧪 TEST: Every 1 Minute', 'setupWhatsAppTestTrigger'))
    .addItem('🛑 Remove WA Triggers', 'removeWhatsAppTriggers')
    .addSeparator()
    .addItem('🔄 Reset Failed to Scheduled', 'resetFailedStatus')
    .addItem('📊 Show WA Statistics', 'showWhatsAppStatistics')
    .addSeparator()
    .addItem('📧 Test Email Notification', 'testNotification')
    .addItem('🧪 Test WA API Connection', 'testWhatsAppAPI')
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
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin: 0; padding: 0; background-color: #f5f5f5;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"><tr><td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; border-radius: 8px 8px 0 0;"><h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif; font-size: 24px;">Dari Rak Alfamart ke Software Engineer di Jepang</h1></td></tr><tr><td style="padding: 40px; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.8; color: #333333;"><p style="margin: 0 0 20px 0;">Halo <strong>{{name}}</strong>,</p><p style="margin: 0 0 20px 0;">Pernahkah kamu merasa <em>stuck</em>, merasa salah jurusan, atau bingung arah hidup mau ke mana?</p><p style="margin: 0 0 20px 0;">Kalau iya, saya paham betul rasanya.</p><p style="margin: 0 0 20px 0;">Perkenalkan, cerita mas <strong><a href="https://www.linkedin.com/in/isanf11?originalSubdomain=jp" style="color: #667eea; text-decoration: none;">Isa Nur Fajar</a></strong>. Jika melihat profil LinkedIn nya sekarang, mungkin kamu melihat seorang Software Engineer yang bekerja di Jepang (Rakuten & Terra Charge).</p><p style="margin: 0 0 15px 0;">Tapi, <em>timeline</em> hidup nya sebenarnya tidak seindah itu:</p><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-left: 4px solid #667eea; margin: 0 0 25px 0; border-radius: 0 8px 8px 0;"><tr><td style="padding: 20px;"><p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #667eea;">Fase 1:</strong> Mahasiswa D.O (karena arogan & keras kepala)</p><p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #667eea;">Fase 2:</strong> Crew Alfamart (Nyusun rak, ngepel lantai, berdiri seharian)</p><p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #667eea;">Fase 3:</strong> Belajar Coding dari Nol (Mulai tobat & konsisten)</p><p style="margin: 0; font-size: 14px;"><strong style="color: #667eea;">Fase 4:</strong> Tembus Karir Global di Jepang</p></td></tr></table><p style="margin: 0 0 20px 0;">Banyak yang bertanya, <em>"Gimana caranya loncat dari nyusun rak ke nyusun code?"</em></p><p style="margin: 0 0 20px 0;">Jawabannya adalah <strong>"Sadness & Awareness"</strong>. Saat mas Isa berdiri seharian menjaga toko dengan gaji pas-pasan, ego nya hancur. Di situ sadar: <em>"Ternyata cari duit itu susah."</em> Kesadaran itulah yang memaksanya berubah, belajar konsisten, dan akhirnya menemukan jalan di dunia Tech.</p><p style="margin: 0 0 20px 0;">Dia percaya, di balik kegagalan atau kebingunganmu saat ini, mungkin kamu sedang "disiapkan" untuk loncatan yang lebih tinggi. Asal kamu tahu arahnya.</p><p style="margin: 0 0 15px 0;">Karena itu, mas Isa ingin mengundang kamu bergabung ke <strong>WhatsApp Group</strong> yang baru dibuat. Di sana, mas Isa ingin berbagi lebih dalam tentang:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 25px 0;"><tr><td style="padding: 8px 0;"><span style="color: #25D366; font-size: 16px; margin-right: 10px;">&#10003;</span>Tips <em>switch career</em> ke dunia Tech</td></tr><tr><td style="padding: 8px 0;"><span style="color: #25D366; font-size: 16px; margin-right: 10px;">&#10003;</span>Realita kerja di Jepang & Global Company</td></tr><tr><td style="padding: 8px 0;"><span style="color: #25D366; font-size: 16px; margin-right: 10px;">&#10003;</span>Membangun mentalitas & konsistensi dari nol</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;"><tr><td align="center"><a href="https://chat.whatsapp.com/Hhf4GyUXFISAT8ULf0um6A" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Gabung WhatsApp Group (GRATIS)</a></td></tr></table><p style="margin: 0 0 20px 0;">Mari kita belajar dan bertumbuh bareng. Sampai jumpa di grup!</p><table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;"><tr><td><p style="margin: 0 0 5px 0;">Salam,</p><p style="margin: 0 0 5px 0;"><strong>Isa Nur Fajar</strong></p><p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">Software Engineer at Terra Charge, Japan</p><a href="https://www.linkedin.com/in/isanf11?originalSubdomain=jp" style="color: #0077b5; text-decoration: none; font-size: 13px;">LinkedIn Profile</a></td></tr></table></td></tr><tr><td style="background-color: #f8f9fa; padding: 20px 40px; border-radius: 0 0 8px 8px; text-align: center;"><p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #999999;">Email ini dikirim karena kamu tertarik dengan karir di dunia Tech</p></td></tr></table></td></tr></table></body></html>';
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
// PART 2: iOS JOB SEARCH
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
    '🏠 *REMOTE JOB ALERT*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '💼 *{title}*\n' +
    '🏢 {company}\n' +
    '🌍 Work From Anywhere\n\n' +
    '📝 *About the Role:*\n' +
    '{snippet}\n\n' +
    '🔗 *Apply Now:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  senior: '━━━━━━━━━━━━━━━━━━━━\n' +
    '👔 *SENIOR POSITION*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '🌟 *{title}*\n' +
    '🏢 {company}\n' +
    '🌍 Global Opportunity\n\n' +
    '📝 *Role Overview:*\n' +
    '{snippet}\n\n' +
    '💰 Competitive Package\n\n' +
    '🔗 *Apply Here:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  intern: '━━━━━━━━━━━━━━━━━━━━\n' +
    '🎓 *INTERNSHIP / FRESH GRAD*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '🚀 *{title}*\n' +
    '🏢 {company}\n' +
    '🌍 Global Opportunity\n\n' +
    '📝 *Opportunity:*\n' +
    '{snippet}\n\n' +
    '✨ Great for starting your career!\n\n' +
    '🔗 *Apply:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  urgent: '━━━━━━━━━━━━━━━━━━━━\n' +
    '🔥 *URGENT HIRING*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '⚡ *{title}*\n' +
    '🏢 {company}\n' +
    '🌍 Global Opportunity\n\n' +
    '📝 *Job Details:*\n' +
    '{snippet}\n\n' +
    '⏰ Apply ASAP!\n\n' +
    '🔗 *Quick Apply:*\n' +
    '{link}\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '{hashtags}\n' +
    '━━━━━━━━━━━━━━━━━━━━',

  default: '━━━━━━━━━━━━━━━━━━━━\n' +
    '💼 *JOB OPPORTUNITY*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '📌 *{title}*\n' +
    '🏢 {company}\n' +
    '🌍 Global Opportunity\n\n' +
    '📝 *Description:*\n' +
    '{snippet}\n\n' +
    '🔗 *Apply Now:*\n' +
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
        title: item.title || 'iOS Developer Position',
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

  return 'Perusahaan Terkemuka';
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
        '🔍 No Jobs Found\n\n' +
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

  var message = '✅ Job Search Complete!\n\n' +
    '🔍 Found: ' + jobs.length + ' jobs (last 7 days)\n' +
    '➕ Added: ' + insertedCount + ' new job(s)\n' +
    '🔄 Skipped: ' + duplicateCount + ' duplicate(s)\n\n' +
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
    SpreadsheetApp.getUi().alert('🔍 No results found for current query');
    return;
  }

  var preview = '🔍 Search Preview (' + jobs.length + ' results)\n\n';

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
    '✅ Daily Job Search Scheduled!\n\n' +
    '⏰ Schedule: Every day at 8:00 AM\n\n' +
    'The script will automatically:\n' +
    '1. Search for iOS jobs\n' +
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
    '✅ 6-Hour Job Search Scheduled!\n\n' +
    '⏰ Schedule: Every 6 hours (4 times/day)\n\n' +
    'The script will automatically:\n' +
    '1. Search for iOS jobs\n' +
    '2. Add new jobs to the sheet\n' +
    '3. Skip duplicates\n\n' +
    '⚠️ Note: Google API free tier = 100 queries/day\n' +
    '4 searches × 1 query = 4 queries used'
  );
}

function setupTestJobSearch() {
  removeJobSearchTriggers(true);

  ScriptApp.newTrigger('searchAndFillJobs')
    .timeBased()
    .everyMinutes(5)
    .create();

  SpreadsheetApp.getUi().alert(
    '🧪 TEST Trigger Activated!\n\n' +
    '⚠️ WARNING: This runs every 5 MINUTES!\n\n' +
    'This will quickly consume your API quota.\n' +
    'Use for testing only, then remove.\n\n' +
    '❗ Remember to remove trigger after testing!'
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
      '🛑 Job Search Triggers Removed\n\n' +
      'Removed ' + removedCount + ' trigger(s)'
    );
  }
}

function previewTemplates() {
  var sampleJob = {
    title: 'Senior Software Engineer - PT Teknologi Indonesia',
    link: 'https://example.com/job/12345',
    snippet: 'We are looking for experienced developers to join our team. Requirements: 5+ years experience, Java/Python, good communication skills.',
    displayLink: 'example.com'
  };

  var categories = ['default', 'remote', 'senior', 'intern', 'urgent'];
  var preview = '📋 TEMPLATE PREVIEW\n\n';

  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    preview += '【 ' + cat.toUpperCase() + ' 】\n';

    var template = JOB_TEMPLATES[cat];
    var hashtags = generateHashtags(sampleJob, cat);

    var formatted = template
      .replace(/{title}/g, sampleJob.title)
      .replace(/{company}/g, 'PT Teknologi Indonesia')
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
    SpreadsheetApp.getUi().alert('📊 No content in the sheet yet');
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
  var triggerStatus = activeJobTrigger ? '✅ Active' : '❌ Not scheduled';

  var message = '📊 IT Job Search Statistics\n\n' +
    '📁 Total Rows: ' + stats.total + '\n' +
    '⏳ Scheduled: ' + stats.scheduled + '\n' +
    '✅ Sent: ' + stats.sent + '\n' +
    '❌ Failed: ' + stats.failed + '\n\n' +
    '⏰ Auto Search: ' + triggerStatus + '\n' +
    '🔍 Query: ' + JOB_CONFIG.SEARCH_QUERY;

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
    '🗑️ Duplicate Removal Complete\n\n' +
    'Removed ' + rowsToDelete.length + ' duplicate(s)'
  );
}

function customJobSearch() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.prompt(
    '🔍 Custom Job Search',
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

    ui.alert('✅ Added ' + insertedCount + ' jobs for query: ' + query);
  }
}

// ============================================
// DEBUG FUNCTION - Run this to see API errors
// ============================================

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

    var message = '🔍 API Test Results\n\n';
    message += '📡 HTTP Status: ' + responseCode + '\n\n';

    if (responseCode === 200) {
      var data = JSON.parse(responseText);
      if (data.items && data.items.length > 0) {
        message += '✅ SUCCESS! Found ' + data.items.length + ' results\n\n';
        message += 'First result:\n' + data.items[0].title;
      } else {
        message += '⚠️ API works but no results found\n';
        message += 'Try different search query';
      }
    } else if (responseCode === 400) {
      message += '❌ BAD REQUEST\n';
      message += 'Check Search Engine ID (cx)\n\n';
      message += responseText.substring(0, 500);
    } else if (responseCode === 403) {
      message += '❌ FORBIDDEN (403)\n\n';
      message += 'Possible causes:\n';
      message += '1. Custom Search API not enabled\n';
      message += '2. API key restrictions\n';
      message += '3. Billing not enabled\n\n';
      message += responseText.substring(0, 500);
    } else {
      message += '❌ ERROR\n\n';
      message += responseText.substring(0, 500);
    }

    SpreadsheetApp.getUi().alert(message);

  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Exception:\n\n' + error.toString());
  }
}

function showAPIConfig() {
  var message = '⚙️ Current Configuration\n\n';
  message += '🔑 API Key: ' + JOB_CONFIG.GOOGLE_API_KEY.substring(0, 10) + '...\n';
  message += '🔍 Search Engine ID: ' + JOB_CONFIG.SEARCH_ENGINE_ID + '\n';
  message += '📝 Search Query: ' + JOB_CONFIG.SEARCH_QUERY + '\n';
  message += '📅 Date Filter: Last 7 days (' + JOB_CONFIG.DATE_RESTRICT + ')\n';
  message += '📊 Results fetched: ' + JOB_CONFIG.RESULTS_PER_SEARCH + '\n';
  message += '➕ Max jobs to add: ' + JOB_CONFIG.MAX_JOBS_TO_ADD + '\n';
  message += '📱 Target Group: ' + JOB_CONFIG.TARGET_GROUP_ID + '\n\n';
  message += '📄 *LinkedIn Templates:*\n';
  message += '• Remote (🏠)\n';
  message += '• Senior (👔)\n';
  message += '• Intern (🎓)\n';
  message += '• Urgent (🔥)\n';
  message += '• Default (💼)';

  SpreadsheetApp.getUi().alert(message);
}

// ============================================
// PART 3: WHATSAPP GROUP POSTER
// ============================================

// TODO: Replace these placeholder values with your Whapify API credentials
var WHATSAPP_CONFIG = {
  API_URL: 'https://whapify.id/api/send/whatsapp',
  SECRET: 'YOUR_WHAPIFY_SECRET_HERE',
  ACCOUNT: 'YOUR_WHAPIFY_ACCOUNT_HERE',
  DEFAULT_GROUP_ID: 'YOUR_WHATSAPP_GROUP_ID_HERE',
  NOTIFY_EMAIL: 'YOUR_EMAIL_HERE',
  NOTIFY_THRESHOLD: 3
};

function sendDueMessages() {
  var sheet = getJobSheet();
  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var sentCount = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = row[JOB_CONFIG.COL.STATUS];

    if (status === 'Scheduled' || status === '' || status === null) {
      var content = row[JOB_CONFIG.COL.CONTENT];
      var scheduleDate = row[JOB_CONFIG.COL.SCHEDULE_DATE];
      var scheduleTime = row[JOB_CONFIG.COL.SCHEDULE_TIME];

      if (!content || content.toString().trim() === '') continue;
      if (!scheduleDate && !scheduleTime) continue;

      if (isMessageDue(scheduleDate, scheduleTime, now)) {
        var groupId = row[JOB_CONFIG.COL.GROUP_ID] || WHATSAPP_CONFIG.DEFAULT_GROUP_ID;
        var result = sendWhatsAppMessage(content.toString(), groupId);
        updateRowStatus(sheet, i + 1, result);
        sentCount++;
        Utilities.sleep(2000);
      }
    }
  }

  if (sentCount === 0) {
    logMessage('No messages due at this time');
  } else {
    logMessage('Sent ' + sentCount + ' scheduled message(s)');
  }

  checkAndNotifyLowContent(sheet);
  return sentCount;
}

function isMessageDue(scheduleDate, scheduleTime, now) {
  try {
    var scheduledDateTime;

    if (scheduleDate instanceof Date) {
      scheduledDateTime = new Date(scheduleDate);
    } else if (typeof scheduleDate === 'string' && scheduleDate.trim() !== '') {
      scheduledDateTime = new Date(scheduleDate);
    } else {
      scheduledDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    if (scheduleTime instanceof Date) {
      scheduledDateTime.setHours(scheduleTime.getHours());
      scheduledDateTime.setMinutes(scheduleTime.getMinutes());
      scheduledDateTime.setSeconds(0);
    } else if (typeof scheduleTime === 'string' && scheduleTime.trim() !== '') {
      var timeParts = scheduleTime.split(':');
      if (timeParts.length >= 2) {
        scheduledDateTime.setHours(parseInt(timeParts[0], 10));
        scheduledDateTime.setMinutes(parseInt(timeParts[1], 10));
        scheduledDateTime.setSeconds(0);
      }
    } else {
      return false;
    }

    var diffMinutes = (now - scheduledDateTime) / (1000 * 60);
    return diffMinutes >= 0 && diffMinutes <= 5;

  } catch (error) {
    logMessage('Error parsing schedule: ' + error);
    return false;
  }
}

function sendWhatsAppMessage(message, groupId) {
  try {
    var payload = {
      'secret': WHATSAPP_CONFIG.SECRET,
      'account': WHATSAPP_CONFIG.ACCOUNT,
      'recipient': groupId,
      'type': 'text',
      'message': message
    };

    var options = {
      'method': 'post',
      'payload': payload,
      'muteHttpExceptions': true
    };

    var response = UrlFetchApp.fetch(WHATSAPP_CONFIG.API_URL, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();

    var responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    if (responseCode === 200) {
      return {
        success: true,
        message: 'Sent successfully',
        response: responseData
      };
    } else {
      return {
        success: false,
        message: 'HTTP ' + responseCode,
        response: responseData
      };
    }

  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      response: null
    };
  }
}

function sendSelectedRowWhatsApp() {
  var sheet = getJobSheet();
  var activeRange = sheet.getActiveRange();

  if (!activeRange) {
    SpreadsheetApp.getUi().alert('Please select a row first');
    return;
  }

  var rowNum = activeRange.getRow();

  if (rowNum === 1) {
    SpreadsheetApp.getUi().alert('Cannot send header row. Please select a content row.');
    return;
  }

  var rowData = sheet.getRange(rowNum, 1, 1, 8).getValues()[0];
  var content = rowData[JOB_CONFIG.COL.CONTENT];
  var groupId = rowData[JOB_CONFIG.COL.GROUP_ID] || WHATSAPP_CONFIG.DEFAULT_GROUP_ID;

  if (!content || content.toString().trim() === '') {
    SpreadsheetApp.getUi().alert('Selected row has no content');
    return;
  }

  var result = sendWhatsAppMessage(content.toString(), groupId);
  updateRowStatus(sheet, rowNum, result);

  if (result.success) {
    SpreadsheetApp.getUi().alert('✅ Message sent successfully!');
  } else {
    SpreadsheetApp.getUi().alert('❌ Failed to send: ' + result.message);
  }
}

function sendNextPending() {
  var sheet = getJobSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = row[JOB_CONFIG.COL.STATUS];
    var content = row[JOB_CONFIG.COL.CONTENT];

    if ((status === 'Scheduled' || status === '' || status === null) &&
        content && content.toString().trim() !== '') {

      var groupId = row[JOB_CONFIG.COL.GROUP_ID] || WHATSAPP_CONFIG.DEFAULT_GROUP_ID;
      var result = sendWhatsAppMessage(content.toString(), groupId);
      updateRowStatus(sheet, i + 1, result);

      if (result.success) {
        logMessage('Sent message ID ' + (row[JOB_CONFIG.COL.ID] || i));
      } else {
        logMessage('Failed to send message ID ' + (row[JOB_CONFIG.COL.ID] || i) + ': ' + result.message);
      }

      checkAndNotifyLowContent(sheet);
      return 1;
    }
  }

  logMessage('No pending messages to send');
  checkAndNotifyLowContent(sheet);
  return 0;
}

function setupWhatsAppScheduler() {
  removeWhatsAppTriggers(true);

  ScriptApp.newTrigger('sendDueMessages')
    .timeBased()
    .everyMinutes(1)
    .create();

  SpreadsheetApp.getUi().alert(
    '✅ Schedule-Based Trigger Activated!\n\n' +
    'The script will check every minute for messages that are due.\n\n' +
    'How to use:\n' +
    '1. Add content in Column B\n' +
    '2. Set date in Column D (e.g., 2025-12-03)\n' +
    '3. Set time in Column E (e.g., 09:00)\n' +
    '4. Set status to "Scheduled"\n\n' +
    'Messages will be sent automatically at the scheduled time!'
  );
}

function setupWhatsAppTrigger4Hours() {
  removeWhatsAppTriggers(true);

  ScriptApp.newTrigger('sendNextPending')
    .timeBased()
    .everyHours(4)
    .create();

  SpreadsheetApp.getUi().alert(
    '✅ 4-Hour Trigger Activated!\n\n' +
    'The script will automatically send 1 message every 4 hours.\n\n' +
    'Schedule: 6 times per day (every 4 hours)\n' +
    'Messages per run: 1\n\n' +
    'Note: This ignores Schedule Date/Time columns.\n' +
    'It just sends the next "Scheduled" message in order.'
  );
}

function setupWhatsAppTestTrigger() {
  removeWhatsAppTriggers(true);

  ScriptApp.newTrigger('sendNextPending')
    .timeBased()
    .everyMinutes(1)
    .create();

  SpreadsheetApp.getUi().alert(
    '🧪 TEST Trigger Activated!\n\n' +
    '⚠️ WARNING: This runs every 1 MINUTE!\n\n' +
    'The script will send 1 message every minute.\n' +
    'This is for TESTING only.\n\n' +
    '❗ Remember to remove trigger after testing!'
  );
}

function removeWhatsAppTriggers(silent) {
  var triggers = ScriptApp.getProjectTriggers();
  var removedCount = 0;

  triggers.forEach(function(trigger) {
    var handler = trigger.getHandlerFunction();
    if (handler === 'sendDueMessages' || handler === 'sendNextPending') {
      ScriptApp.deleteTrigger(trigger);
      removedCount++;
    }
  });

  if (silent !== true) {
    SpreadsheetApp.getUi().alert(
      '🛑 WhatsApp Triggers Removed\n\n' +
      'Removed ' + removedCount + ' trigger(s)'
    );
  }
}

function updateRowStatus(sheet, rowNum, result) {
  var timestamp = new Date().toLocaleString('id-ID');
  var status = result.success ? 'Sent' : 'Failed';
  var responseText = JSON.stringify(result.response || result.message).substring(0, 500);

  sheet.getRange(rowNum, JOB_CONFIG.COL.STATUS + 1).setValue(status);
  sheet.getRange(rowNum, JOB_CONFIG.COL.SENT_AT + 1).setValue(timestamp);
  sheet.getRange(rowNum, JOB_CONFIG.COL.RESPONSE + 1).setValue(responseText);

  var statusCell = sheet.getRange(rowNum, JOB_CONFIG.COL.STATUS + 1);
  if (result.success) {
    statusCell.setBackground('#d4edda').setFontColor('#155724');
  } else {
    statusCell.setBackground('#f8d7da').setFontColor('#721c24');
  }
}

function resetFailedStatus() {
  var sheet = getJobSheet();
  var data = sheet.getDataRange().getValues();
  var resetCount = 0;

  for (var i = 1; i < data.length; i++) {
    if (data[i][JOB_CONFIG.COL.STATUS] === 'Failed') {
      var rowNum = i + 1;
      sheet.getRange(rowNum, JOB_CONFIG.COL.STATUS + 1).setValue('Scheduled');
      sheet.getRange(rowNum, JOB_CONFIG.COL.STATUS + 1)
        .setBackground('#fff3cd')
        .setFontColor('#856404');
      sheet.getRange(rowNum, JOB_CONFIG.COL.SENT_AT + 1).setValue('');
      sheet.getRange(rowNum, JOB_CONFIG.COL.RESPONSE + 1).setValue('');
      resetCount++;
    }
  }

  SpreadsheetApp.getUi().alert('🔄 Reset ' + resetCount + ' failed message(s) to Scheduled');
}

function showWhatsAppStatistics() {
  var sheet = getJobSheet();
  var data = sheet.getDataRange().getValues();

  var stats = {
    total: 0,
    scheduled: 0,
    sent: 0,
    failed: 0
  };

  for (var i = 1; i < data.length; i++) {
    var status = data[i][JOB_CONFIG.COL.STATUS];
    stats.total++;

    if (status === 'Sent') stats.sent++;
    else if (status === 'Failed') stats.failed++;
    else stats.scheduled++;
  }

  var nextScheduled = 'None';
  for (var i = 1; i < data.length; i++) {
    var status = data[i][JOB_CONFIG.COL.STATUS];
    if (status === 'Scheduled' || status === '' || status === null) {
      var scheduleDate = data[i][JOB_CONFIG.COL.SCHEDULE_DATE];
      var scheduleTime = data[i][JOB_CONFIG.COL.SCHEDULE_TIME];
      if (scheduleDate || scheduleTime) {
        nextScheduled = scheduleDate + ' ' + scheduleTime;
        break;
      }
    }
  }

  var message = '📊 WhatsApp Poster Statistics\n\n' +
    'Total Messages: ' + stats.total + '\n' +
    '✅ Sent: ' + stats.sent + '\n' +
    '⏳ Scheduled: ' + stats.scheduled + '\n' +
    '❌ Failed: ' + stats.failed + '\n\n' +
    'Next scheduled: ' + nextScheduled;

  SpreadsheetApp.getUi().alert(message);
}

function logMessage(message) {
  console.log('[' + new Date().toISOString() + '] ' + message);
}

function checkAndNotifyLowContent(sheet) {
  if (!WHATSAPP_CONFIG.NOTIFY_EMAIL || WHATSAPP_CONFIG.NOTIFY_EMAIL.trim() === '') {
    return;
  }

  var data = sheet.getDataRange().getValues();
  var scheduledCount = 0;

  for (var i = 1; i < data.length; i++) {
    var status = data[i][JOB_CONFIG.COL.STATUS];
    if (status === 'Scheduled' || status === '' || status === null) {
      var content = data[i][JOB_CONFIG.COL.CONTENT];
      if (content && content.toString().trim() !== '') {
        scheduledCount++;
      }
    }
  }

  if (scheduledCount <= WHATSAPP_CONFIG.NOTIFY_THRESHOLD) {
    sendLowContentNotification(scheduledCount);
  }
}

function sendLowContentNotification(scheduledCount) {
  var cache = CacheService.getScriptCache();
  var lastNotified = cache.get('lowContentNotified');

  if (lastNotified) {
    logMessage('Low content notification already sent today, skipping');
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  var sheetUrl = ss.getUrl();
  var sheetName = ss.getName();

  var subject, body;

  if (scheduledCount === 0) {
    subject = '🚨 WhatsApp Poster: No Scheduled Messages!';
    body = 'Hi,\n\nYour WhatsApp Poster has no scheduled messages!\n\n' +
      '📊 Status: NO SCHEDULED MESSAGES\n\n' +
      'The scheduler is running but won\'t send anything until you add more content.\n\n' +
      '📝 Add more content here:\n' + sheetUrl + '\n\n' +
      'Sheet: ' + sheetName + '\n\n---\nby LAYER';
  } else {
    subject = '⚠️ WhatsApp Poster: Only ' + scheduledCount + ' message(s) scheduled!';
    body = 'Hi,\n\nYour WhatsApp Poster is running low on scheduled content!\n\n' +
      '📊 Status: ' + scheduledCount + ' scheduled message(s) remaining\n\n' +
      '📝 Add more content here:\n' + sheetUrl + '\n\n' +
      'Sheet: ' + sheetName + '\n\n---\nby LAYER';
  }

  try {
    MailApp.sendEmail({
      to: WHATSAPP_CONFIG.NOTIFY_EMAIL,
      subject: subject,
      body: body
    });

    cache.put('lowContentNotified', 'true', 86400);
    logMessage('Low content notification sent to ' + WHATSAPP_CONFIG.NOTIFY_EMAIL);
  } catch (error) {
    logMessage('Failed to send notification: ' + error);
  }
}

function testNotification() {
  if (!WHATSAPP_CONFIG.NOTIFY_EMAIL || WHATSAPP_CONFIG.NOTIFY_EMAIL.trim() === '') {
    SpreadsheetApp.getUi().alert(
      '❌ No email configured!\n\n' +
      'Please set NOTIFY_EMAIL in WHATSAPP_CONFIG section first.'
    );
    return;
  }

  CacheService.getScriptCache().remove('lowContentNotified');

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetUrl = ss.getUrl();
    var sheetName = ss.getName();

    var subject = '🧪 TEST: WhatsApp Poster Notification';
    var body = 'Hi,\n\nThis is a TEST notification from your WhatsApp Poster!\n\n' +
      '✅ Email notifications are working correctly.\n\n' +
      '📊 Current Settings:\n' +
      '- Notify Email: ' + WHATSAPP_CONFIG.NOTIFY_EMAIL + '\n' +
      '- Threshold: ' + WHATSAPP_CONFIG.NOTIFY_THRESHOLD + ' messages\n\n' +
      '📝 Your Sheet:\n' + sheetUrl + '\n\n' +
      'Sheet: ' + sheetName + '\n\n---\nby LAYER';

    MailApp.sendEmail({
      to: WHATSAPP_CONFIG.NOTIFY_EMAIL,
      subject: subject,
      body: body
    });

    SpreadsheetApp.getUi().alert(
      '✅ Test notification sent!\n\n' +
      'Check your inbox: ' + WHATSAPP_CONFIG.NOTIFY_EMAIL + '\n\n' +
      '(Check spam folder if not in inbox)'
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Failed to send email!\n\n' +
      'Error: ' + error.toString()
    );
  }
}

function testWhatsAppAPI() {
  var testMessage = '🧪 Test message from WhatsApp Poster - ' + new Date().toLocaleString('id-ID');
  var result = sendWhatsAppMessage(testMessage, WHATSAPP_CONFIG.DEFAULT_GROUP_ID);

  if (result.success) {
    SpreadsheetApp.getUi().alert(
      '✅ API Connection Successful!\n\n' +
      'Test message was sent to your WhatsApp group.\n\n' +
      'Response: ' + JSON.stringify(result.response)
    );
  } else {
    SpreadsheetApp.getUi().alert(
      '❌ API Connection Failed!\n\n' +
      'Error: ' + result.message + '\n\n' +
      'Please check:\n' +
      '1. API credentials (SECRET & ACCOUNT)\n' +
      '2. Group ID format\n' +
      '3. Whapify account status\n\n' +
      'Response: ' + JSON.stringify(result.response)
    );
  }
}
