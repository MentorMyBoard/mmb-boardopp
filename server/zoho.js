const https = require('https');

// ─────────────────────────────────────────────────────────────────────────────
// Zoho CRM Integration
//
// SETUP (once you have the production domain):
// 1. Go to https://api-console.zoho.in → Server-based Apps → Create
// 2. Redirect URI: https://boardopp.mentormyboard.com/zoho-callback (or any URL)
// 3. Note Client ID + Client Secret → add to server/.env
// 4. Generate Refresh Token:
//    https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.leads.CREATE&client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT&access_type=offline
//    Exchange code: POST https://accounts.zoho.in/oauth/v2/token with grant_type=authorization_code
// 5. Add Refresh Token to server/.env as ZOHO_REFRESH_TOKEN
// ─────────────────────────────────────────────────────────────────────────────

const DATACENTER = process.env.ZOHO_DATACENTER || 'in';
const ACCOUNTS_BASE = `https://accounts.zoho.${DATACENTER}`;
const API_BASE = `https://www.zohoapis.${DATACENTER}`;

let accessToken = null;
let tokenExpiry = 0;

async function httpPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    const req = https.request(
      { hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(bodyStr) } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;
  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    throw new Error('Zoho credentials not configured');
  }

  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  const accountsHostname = `accounts.zoho.${DATACENTER}`;
  const { status, body } = await httpPost(
    accountsHostname,
    `/oauth/v2/token?${params}`,
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    ''
  );

  if (status !== 200) throw new Error(`Zoho token error ${status}: ${body}`);
  const result = JSON.parse(body);
  accessToken = result.access_token;
  tokenExpiry = Date.now() + (result.expires_in - 60) * 1000;
  return accessToken;
}

async function createZohoLead(data) {
  const { ZOHO_CLIENT_ID } = process.env;
  if (!ZOHO_CLIENT_ID) {
    // Credentials not yet configured — log and skip silently
    console.log('[Zoho] Credentials not configured. Lead queued for future sync:', data.email || data.companyName);
    return;
  }

  try {
    const token = await getAccessToken();

    let leadRecord;
    if (data.type === 'director') {
      const [firstName, ...rest] = (data.name || '').split(' ');
      leadRecord = {
        First_Name: firstName || '',
        Last_Name: rest.join(' ') || firstName || data.name,
        Email: data.email,
        Phone: data.phone,
        Company: 'BoardOpp Director',
        Designation: data.designation,
        Industry: data.industry,
        Lead_Source: 'BoardOpp – Director Registration',
        Description: `Board Experience: ${data.boardExperience || '—'}\nPreferred Role: ${data.preferredRole || '—'}\nExpertise: ${Array.isArray(data.expertise) ? data.expertise.join(', ') : data.expertise || '—'}\nLinkedIn: ${data.linkedin || '—'}`,
        City: data.location,
        // Custom field mapping (configure these field API names in Zoho CRM)
        // CF_Years_of_Experience: data.experience,
      };
    } else {
      const [firstName, ...rest] = (data.contactPerson || '').split(' ');
      leadRecord = {
        First_Name: firstName || '',
        Last_Name: rest.join(' ') || firstName || data.contactPerson,
        Email: data.email,
        Phone: data.phone,
        Company: data.companyName,
        Designation: data.designation,
        Industry: data.industry,
        Lead_Source: 'BoardOpp – Company Registration',
        Website: data.website,
        Description: `Company Size: ${data.companySize || '—'}\nRequirements: ${Array.isArray(data.requirementTypes) ? data.requirementTypes.join(', ') : data.requirementTypes || '—'}\nDetails: ${data.additionalDetails || '—'}`,
      };
    }

    const apiHostname = `www.zohoapis.${DATACENTER}`;
    const { status, body } = await httpPost(
      apiHostname,
      '/crm/v2/Leads',
      {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      JSON.stringify({ data: [leadRecord] })
    );

    if (status >= 200 && status < 300) {
      const result = JSON.parse(body);
      console.log('[Zoho] Lead created:', result?.data?.[0]?.details?.id);
    } else {
      console.error('[Zoho] API error', status, body);
    }
  } catch (err) {
    console.error('[Zoho] Failed to create lead:', err.message);
  }
}

module.exports = { createZohoLead };
