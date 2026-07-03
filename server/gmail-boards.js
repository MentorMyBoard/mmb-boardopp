const https = require('https');
const { URL, URLSearchParams } = require('url');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1';

// ── HTTP helpers ───────────────────────────────────────────────────────────

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

function httpsPost(urlStr, params) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(params).toString();
    const u = new URL(urlStr);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Gmail OAuth ────────────────────────────────────────────────────────────

async function getAccessToken() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error('Gmail credentials not set. Add GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN to server/.env');
  }
  const result = await httpsPost(TOKEN_URL, {
    client_id: GMAIL_CLIENT_ID,
    client_secret: GMAIL_CLIENT_SECRET,
    refresh_token: GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  if (result.status !== 200 || !result.body.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(result.body)}`);
  }
  return result.body.access_token;
}

async function getLabelId(token, labelName) {
  const r = await httpsGet(`${GMAIL_BASE}/users/me/labels`, { Authorization: `Bearer ${token}` });
  const label = (r.body.labels || []).find((l) => l.name === labelName);
  if (!label) throw new Error(`Label "${labelName}" not found in Gmail`);
  return label.id;
}

async function listMessages(token, labelId, maxResults = 100) {
  const url = `${GMAIL_BASE}/users/me/messages?labelIds=${encodeURIComponent(labelId)}&maxResults=${maxResults}`;
  const r = await httpsGet(url, { Authorization: `Bearer ${token}` });
  return r.body.messages || [];
}

async function getMessage(token, msgId) {
  const url = `${GMAIL_BASE}/users/me/messages/${msgId}?format=full`;
  const r = await httpsGet(url, { Authorization: `Bearer ${token}` });
  return r.body;
}

// ── Parsing ────────────────────────────────────────────────────────────────

function decodeB64Url(str) {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function getEmailBody(message) {
  function findHtml(parts) {
    for (const part of parts || []) {
      if (part.mimeType === 'text/html' && part.body?.data) return decodeB64Url(part.body.data);
      const nested = findHtml(part.parts);
      if (nested) return nested;
    }
    return null;
  }
  if (message.payload?.mimeType === 'text/html' && message.payload?.body?.data) {
    return decodeB64Url(message.payload.body.data);
  }
  return findHtml(message.payload?.parts);
}

function getHeader(message, name) {
  return (message.payload?.headers || []).find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
}

function decodeGoogleUrl(googleUrl) {
  try {
    const u = new URL(googleUrl);
    const target = u.searchParams.get('url');
    return target || googleUrl;
  } catch {
    return googleUrl;
  }
}

function htmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function inferCategory(subject) {
  const s = subject.toLowerCase();
  if (s.includes('appoint') || s.includes('elect') || s.includes('joining')) return 'Board Appointment';
  if (s.includes('resign') || s.includes('step down') || s.includes('vacate')) return 'Board Change';
  if (s.includes('sebi') || s.includes('compliance') || s.includes('regul')) return 'Governance';
  if (s.includes('esg') || s.includes('sustainab')) return 'ESG';
  if (s.includes('independent director')) return 'Board Appointment';
  return 'Board News';
}

// Modern Google Alerts emails embed articles as JSON inside:
//   <script data-scope="inboxmarkup" type="application/json">{ ... }</script>
// The articles live at json.cards[].widgets[] where type === "LINK"
// Each widget has: { type, title, description, url }
// The title is "Headline - Source Name", url is a Google redirect to the real article.

function splitTitleSource(title) {
  const i = title.lastIndexOf(' - ');
  if (i > 15) {
    return { headline: title.slice(0, i).trim(), source: title.slice(i + 3).trim() };
  }
  return { headline: title.trim(), source: '' };
}

function parseInboxMarkupJson(html, subject, emailDate) {
  const scriptMatch = html.match(/<script[^>]+data-scope="inboxmarkup"[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return null;

  let data;
  try { data = JSON.parse(scriptMatch[1]); }
  catch (e) { console.error('[Gmail Parser] JSON parse error:', e.message); return null; }

  const articles = [];
  for (const card of data.cards || []) {
    for (const widget of card.widgets || []) {
      if (widget.type !== 'LINK' || !widget.url || !widget.title) continue;

      const articleUrl = decodeGoogleUrl(widget.url);
      // Skip if Google URL decode failed (no url= param)
      if (!articleUrl || articleUrl === widget.url) continue;

      const { headline, source } = splitTitleSource(widget.title);
      if (!headline || headline.length < 5) continue;

      articles.push({
        headline,
        article_url: articleUrl,
        source_name: source || 'News',
        description: (widget.description || '').slice(0, 300),
        published_date: emailDate,
        category: inferCategory(subject),
      });
    }
  }

  console.log(`[Gmail Parser] JSON format — found ${articles.length} articles`);
  return articles;
}

// Legacy fallback: older Google Alerts emails used <h2> tags with article links
function parseLegacyHtml(html, subject, emailDate) {
  const articles = [];
  const blocks = html.split(/<h2[^>]*>/i).slice(1);

  for (const block of blocks) {
    const linkMatch = block.match(/^[^<]*<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
    if (!linkMatch) continue;

    const headline = htmlEntities(linkMatch[2]);
    if (!headline || headline.length < 5) continue;

    const articleUrl = decodeGoogleUrl(linkMatch[1]);
    if (!articleUrl || articleUrl === linkMatch[1]) continue;

    const sourceMatch = block.match(/<div[^>]*>(?:[^<]*)<a[^>]*>([^<]+)<\/a>\s*(?:&nbsp;)?\s*·/i);
    const sourceName = sourceMatch ? htmlEntities(sourceMatch[1]) : 'News';

    const descMatches = [...block.matchAll(/<div[^>]*dir="ltr"[^>]*>([^<]{15,})/gi)];
    const description = descMatches[1] ? htmlEntities(descMatches[1][1]).slice(0, 300) : '';

    articles.push({ headline, article_url: articleUrl, source_name: sourceName, description, published_date: emailDate, category: inferCategory(subject) });
  }

  console.log(`[Gmail Parser] Legacy HTML format — found ${articles.length} articles`);
  return articles;
}

function parseGoogleAlertsHtml(html, subject, emailDate) {
  const jsonResult = parseInboxMarkupJson(html, subject, emailDate);
  if (jsonResult !== null) return jsonResult;
  return parseLegacyHtml(html, subject, emailDate);
}

// ── Main sync function ─────────────────────────────────────────────────────

async function syncGmailAlerts(db) {
  const labelName = process.env.GMAIL_LABEL_NAME || 'BoardUpdates';

  const token = await getAccessToken();
  const labelId = await getLabelId(token, labelName);
  const messages = await listMessages(token, labelId, 50);

  let processedEmails = 0;
  let newArticles = 0;
  const errors = [];

  for (const { id: msgId } of messages) {
    const already = db.prepare('SELECT id FROM gmail_sync_log WHERE gmail_message_id = ?').get(msgId);
    if (already) continue;

    try {
      const message = await getMessage(token, msgId);
      const subject = getHeader(message, 'subject');
      const dateStr = getHeader(message, 'date');
      const emailDate = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();
      const html = getEmailBody(message);

      let articlesParsed = 0;

      if (html) {
        const articles = parseGoogleAlertsHtml(html, subject, emailDate);

        for (const article of articles) {
          const exists = db.prepare('SELECT id FROM board_updates WHERE article_url = ?').get(article.article_url);
          if (exists) continue;

          const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
          const now = new Date().toISOString();

          db.prepare(`
            INSERT INTO board_updates
              (id, headline, source_name, article_url, published_date, description,
               image_url, category, status, gmail_message_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, '', ?, 'pending', ?, ?, ?)
          `).run(
            id, article.headline, article.source_name, article.article_url,
            article.published_date, article.description, article.category,
            msgId, now, now
          );

          newArticles++;
          articlesParsed++;
        }
      }

      const logId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      db.prepare(`
        INSERT OR IGNORE INTO gmail_sync_log (id, gmail_message_id, subject, articles_parsed, synced_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(logId, msgId, subject, articlesParsed, new Date().toISOString());

      processedEmails++;
    } catch (err) {
      errors.push({ msgId, error: err.message });
      console.error(`[Gmail] Failed to process message ${msgId}:`, err.message);
    }
  }

  console.log(`[Gmail] Sync complete — emails: ${processedEmails}, new articles: ${newArticles}`);
  return { processedEmails, newArticles, errors };
}

module.exports = { syncGmailAlerts, getAccessToken, getLabelId, listMessages, getMessage, getEmailBody, getHeader };
