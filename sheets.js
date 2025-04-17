const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const creds = require('../credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new GoogleAuth({
  credentials: creds,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getNickname(userId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!A2:C',
  });
  const rows = res.data.values || [];
  for (const row of rows) {
    if (row[0] === userId) {
      return row[2] || null;
    }
  }
  return null;
}

async function saveNickname(userId, nickname) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!A2:C',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex(row => row[0] === userId);
  if (rowIndex >= 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Users!C${rowIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[nickname]] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A2',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[userId, '', nickname]],
      },
    });
  }
}

async function saveNote(userId, text) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Notes!A2',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[userId, text, new Date().toISOString()]],
    },
  });
}

module.exports = { getNickname, saveNickname, saveNote };
