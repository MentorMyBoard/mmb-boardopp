const https = require('https');
const http = require('http');
const { URL } = require('url');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Simple in-memory cache (30 min TTL) — stores already-paraphrased content
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function fetchHtml(urlStr, hops = 0) {
  if (hops > 4) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    let parsed;
    try { parsed = new URL(urlStr); } catch (e) { return reject(new Error('Invalid URL')); }
    const mod = parsed.protocol === 'https:' ? https : http;

    const req = mod.get(urlStr, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, urlStr).href;
        res.resume();
        resolve(fetchHtml(next, hops + 1));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(12000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function meta(html, ...names) {
  for (const name of names) {
    const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']{4,})["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']{4,})["'][^>]+(?:property|name)=["']${name}["']`, 'i'));
    if (m) return m[1].trim();
  }
  return '';
}

function decode(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c));
}

function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map((l) => decode(l.trim())).filter(Boolean).join('\n\n')
    .trim();
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const s of scripts) {
    try {
      const obj = JSON.parse(s[1]);
      const candidates = Array.isArray(obj) ? obj : [obj, ...(obj['@graph'] || [])];
      for (const c of candidates) {
        if (c.articleBody && c.articleBody.length > 120) return c.articleBody.trim();
        if (c.description && c.description.length > 200) return c.description.trim();
      }
    } catch {}
  }
  return null;
}

function extractContent(html) {
  const ld = extractJsonLd(html);
  if (ld) return ld.slice(0, 10000);

  let h = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<(nav|header|footer|aside|form|noscript|figure)[^>]*>[\s\S]*?<\/\1>/gi, '');

  const selectors = [
    /itemprop=["']articleBody["'][^>]*>([\s\S]{200,}?)<\/(?:div|section|article)>/i,
    /<article[^>]*>([\s\S]{200,}?)<\/article>/i,
    /class=["'][^"']*(?:article[-_]body|article[-_]content|articleContent|story[-_]body|story[-_]content|post[-_]body|post[-_]content|entry[-_]content|content[-_]body|newsarticle[-_]body|articleText|article-detail|news-detail|news[-_]content|full[-_]story)[^"']*["'][^>]*>([\s\S]{200,}?)<\/(?:div|section|article)>/i,
    /id=["'][^"']*(?:article[-_]body|articleBody|storyBody|contentBody|main[-_]content|story[-_]content)[^"']*["'][^>]*>([\s\S]{200,}?)<\/(?:div|section|article)>/i,
    /<main[^>]*>([\s\S]{200,}?)<\/main>/i,
  ];

  for (const rx of selectors) {
    const m = h.match(rx);
    if (m) {
      const text = htmlToText(m[1] || m[0]);
      if (text.length > 150) return text.slice(0, 10000);
    }
  }

  const paragraphs = [...h.matchAll(/<(?:p|td|li)[^>]*>([\s\S]+?)<\/(?:p|td|li)>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()))
    .filter((t) => t.length > 80 && !t.match(/^(home|menu|search|login|sign in|subscribe)/i));

  if (paragraphs.length > 0) return paragraphs.join('\n\n').slice(0, 10000);
  return '';
}

// ── AI Paraphrase via Claude Haiku ────────────────────────────────────────

function paraphraseContent(text) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !text || text.length < 100) return Promise.resolve(text);

  const prompt = `You are an editorial writer for a corporate governance news platform. Rewrite the following article content entirely in your own words. Preserve all factual details — names, numbers, dates, company names, and events — but use completely different sentence structures and phrasing. The output should read as original, professional journalism for board directors and governance professionals. Do not add any opinions, analysis, or information not in the source. Output only the rewritten article, no preamble or commentary.

Article to rewrite:
${text.slice(0, 6000)}`;

  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1800,
    messages: [{ role: 'user', content: prompt }],
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = json.content?.[0]?.text;
          resolve(result && result.length > 80 ? result : text);
        } catch {
          resolve(text);
        }
      });
    });

    req.on('error', () => resolve(text));
    req.setTimeout(28000, () => { req.destroy(); resolve(text); });
    req.write(body);
    req.end();
  });
}

// ── Main export ───────────────────────────────────────────────────────────

async function fetchArticleContent(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid URL protocol');

  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const html = await fetchHtml(url);

  const ogImage    = meta(html, 'og:image', 'twitter:image');
  const ogDesc     = meta(html, 'og:description', 'twitter:description', 'description');
  const ogTitle    = meta(html, 'og:title', 'twitter:title');
  const rawContent = extractContent(html);

  // Paraphrase the article content to avoid verbatim reproduction
  const content = await paraphraseContent(rawContent);

  const data = { ogTitle, ogDescription: ogDesc, ogImage, content };
  cache.set(url, { data, ts: Date.now() });
  return data;
}

module.exports = { fetchArticleContent };
