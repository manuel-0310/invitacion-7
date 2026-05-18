// Google Apps Script — Carlos 50 Años · RSVP → Google Sheets

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.couple_name || '',
      data.from_name   || '',
      data.last_name   || '',
      data.reply_to    || '',
      data.age         || '',
      data.attendance  || '',
      data.allergies   || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
