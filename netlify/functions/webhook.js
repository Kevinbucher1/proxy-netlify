import { google } from 'googleapis';

const TOKEN_ATTENDU = 'jdsbqurhv23dka'; // Le mot de passe secret
const SPREADSHEET_ID = '16FrKAWGvlPASgB4St8LwLhK96Oaurdy4__XnbTFzFTM';
const RANGE = 'Export Automatique Leadbyte';

// --- Authentification (ne pas modifier) ---
const auth = new google.auth.JWT(
  process.env.GS_CLIENT_EMAIL,
  null,
  process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);
const sheets = google.sheets({ version: 'v4', auth });


export async function handler(event) {
  // --- VÉRIFICATION DU TOKEN ---
  if (event.queryStringParameters?.token !== TOKEN_ATTENDU) {
    console.error("Tentative d'accès avec un token invalide.");
    return { statusCode: 403, body: 'Forbidden' };
  }

  const { body } = event;
  let record;
  try {
    const data = JSON.parse(body);
    record = data.records?.[0] || {};
  } catch (e) {
    console.error('Erreur parsing JSON :', e);
    return { statusCode: 400, body: 'Bad Request: invalid JSON' };
  }

  const lead = record.lead || {};
  const campaign = record.campaign || {};
  
  const rowData = [
      lead.id || '',                  // 1. lead_id
      lead.email || '',               // 2. email
      lead.firstname || '',           // 3. first_name
      lead.lastname || '',            // 4. last_name
      lead.source || '',              // 5. source
      lead.c1 || '',                  // 6. c1
      lead.c2 || '',                  // 7. c2
      lead.c3 || '',                  // 8. c3
      lead.c4 || lead.C4 || '',       // 9. c4
      lead.c5 || lead.C5 || '',       // 10. c5
      lead.c6 || lead.C6 || '',       // 11. c6
      lead.c7 || lead.C7 || '',       // 12. c7
      lead.c8 || lead.C8 || '',       // 13. c8
      lead.received || '',            // 14. received_time
      campaign.name || '',            // 15. Campaign Name
      lead.campagne_id || '',         // 16. Campagne_id
      lead.formation || '',           // 17. formation
      lead.thematique || '',          // 18. thematique
      lead.desired_training || '',    // 19. desired_training
      deliveryData                    // 20. La nouvelle "delivery data"
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${RANGE}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] }
    });
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Erreur API Sheets:', err.message);
    return { statusCode: 500, body: 'Sheets write error' };
  }
}
