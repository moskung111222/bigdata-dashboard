import { google } from 'googleapis';
import fs from 'fs';

export async function readSheetWithServiceAccount(spreadsheetId, range, credentialsPath) {
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Missing Google credentials at ${credentialsPath}`);
  }
  const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
  const auth = new google.auth.JWT(creds.client_email, null, creds.private_key, scopes);
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: range || 'A1:Z10000'
  });
  const values = res.data.values || [];
  return values;
}
