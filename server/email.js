const https = require('https');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@mentormyboard.com';
const SENDER_NAME = process.env.SENDER_NAME || 'BoardOpp by MentorMyBoard';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@mentormyboard.com';

// Core Brevo transactional email sender
async function sendBrevoEmail(to, toName, subject, htmlContent) {
  if (!BREVO_API_KEY) {
    console.warn('[Email] BREVO_API_KEY not set — skipping email to', to);
    return;
  }

  const body = JSON.stringify({
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: [{ email: to, name: toName }],
    subject,
    htmlContent,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          accept: 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('[Email] Sent to', to);
            resolve(JSON.parse(data));
          } else {
            console.error('[Email] Brevo error', res.statusCode, data);
            reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// --- Director Emails ---

function directorConfirmationHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Registration Confirmed — BoardOpp</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141416;border-radius:20px;overflow:hidden;border:1px solid rgba(249,159,27,0.25);max-width:600px;">

        <!-- Header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,#F99F1B,#FFD36A);padding:28px 40px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#0A0A0A;letter-spacing:0.05em;">BoardOpp</div>
            <div style="font-size:10px;color:#7A5500;letter-spacing:0.15em;text-transform:uppercase;margin-top:2px;">by MentorMyBoard</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#F99F1B;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Profile Registered ✓</p>
            <h1 style="color:#F5F0E8;font-size:26px;font-weight:400;margin:0 0 16px;line-height:1.25;">Welcome to the Boardroom, ${data.name}.</h1>
            <p style="color:#7A7A8A;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Your director profile has been successfully received on <strong style="color:#C0B8A8;">BoardOpp</strong>. Our governance team will review your profile and reach out within <strong style="color:#C0B8A8;">5–7 business days</strong> with relevant board opportunities.
            </p>

            <!-- Summary card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E1E21;border-radius:14px;border:1px solid rgba(255,255,255,0.07);margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="color:#F99F1B;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Your Profile Summary</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ['Name', data.name],
                    ['Email', data.email],
                    ['Phone', data.phone],
                    ['Current Role', data.designation],
                    ['Industry', data.industry],
                    ['Experience', data.experience],
                    ['Board Experience', data.boardExperience],
                    ['Preferred Role', data.preferredRole],
                    ['Location', data.location],
                  ].map(([label, value]) => value ? `
                  <tr>
                    <td width="40%" style="padding:6px 0;color:#5A5A6A;font-size:12px;vertical-align:top;">${label}</td>
                    <td style="padding:6px 0;color:#C0B8A8;font-size:12px;font-weight:500;">${value}</td>
                  </tr>` : '').join('')}
                  ${data.expertise && data.expertise.length ? `
                  <tr>
                    <td width="40%" style="padding:6px 0;color:#5A5A6A;font-size:12px;vertical-align:top;">Expertise</td>
                    <td style="padding:6px 0;color:#C0B8A8;font-size:12px;">${Array.isArray(data.expertise) ? data.expertise.join(', ') : data.expertise}</td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>

            <!-- Next step CTA -->
            <div style="text-align:center;margin-bottom:32px;">
              <p style="color:#6A6A7A;font-size:13px;margin:0 0 16px;">While you wait, discover how board-ready you are:</p>
              <a href="https://mentormyboard.com" style="display:inline-block;background:linear-gradient(135deg,#F99F1B,#FFD36A);color:#0A0A0A;font-size:13px;font-weight:700;padding:13px 28px;border-radius:9px;text-decoration:none;letter-spacing:0.03em;">Take Your Director Readiness Assessment →</a>
            </div>

            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 24px;">
            <p style="color:#4A4A5A;font-size:12px;line-height:1.65;margin:0;">
              For any queries, reach us at <a href="mailto:info@mentormyboard.com" style="color:#F99F1B;text-decoration:none;">info@mentormyboard.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0F0F11;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="color:#3A3A4A;font-size:11px;margin:0;">© 2026 BoardOpp by MentorMyBoard · <a href="https://mentormyboard.com/privacy-policy" style="color:#4A4A5A;text-decoration:none;">Privacy Policy</a> · <a href="https://mentormyboard.com/terms-and-condition" style="color:#4A4A5A;text-decoration:none;">Terms</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function directorAdminNotificationHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Director Lead — BoardOpp</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141416;border-radius:16px;overflow:hidden;border:1px solid rgba(136,144,255,0.25);max-width:600px;">
        <tr><td style="background:linear-gradient(135deg,#8890FF,#B8BCFF);padding:24px 36px;">
          <div style="font-size:13px;font-weight:700;color:#0A0A0A;">🎯 New Director Registration — BoardOpp</div>
          <div style="font-size:11px;color:#3A3A7A;margin-top:4px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ['Name', data.name],
              ['Email', data.email],
              ['Phone', data.phone],
              ['Current Designation', data.designation],
              ['Industry', data.industry],
              ['Total Experience', data.experience],
              ['Board Experience', data.boardExperience],
              ['LinkedIn', data.linkedin],
              ['Preferred Role', data.preferredRole],
              ['Location', data.location],
              ['Expertise', Array.isArray(data.expertise) ? data.expertise.join(', ') : data.expertise],
              ['Resume', data.resumeName || '—'],
            ].map(([label, value]) => `
            <tr>
              <td width="38%" style="padding:8px 0;color:#6A6A7A;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top;">${label}</td>
              <td style="padding:8px 0;color:#E0D8C8;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:500;">${value || '—'}</td>
            </tr>`).join('')}
          </table>
        </td></tr>
        <tr><td style="background:#0F0F11;padding:16px 36px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#3A3A4A;font-size:11px;margin:0;">View all leads in the <a href="https://boardopp.mentormyboard.com/admin/directors" style="color:#8890FF;text-decoration:none;">Admin Dashboard</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Company Emails ---

function companyConfirmationHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Board Requirement Received — BoardOpp</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141416;border-radius:20px;overflow:hidden;border:1px solid rgba(249,159,27,0.25);max-width:600px;">

        <tr>
          <td style="background:linear-gradient(135deg,#F99F1B,#FFD36A);padding:28px 40px;text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#0A0A0A;letter-spacing:0.05em;">BoardOpp</div>
            <div style="font-size:10px;color:#7A5500;letter-spacing:0.15em;text-transform:uppercase;margin-top:2px;">by MentorMyBoard</div>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <p style="color:#F99F1B;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Requirement Received ✓</p>
            <h1 style="color:#F5F0E8;font-size:26px;font-weight:400;margin:0 0 16px;line-height:1.25;">Thank you, ${data.contactPerson}.</h1>
            <p style="color:#7A7A8A;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Your board requirement for <strong style="color:#C0B8A8;">${data.companyName}</strong> has been received. Our governance talent team will reach out with shortlisted profiles within <strong style="color:#C0B8A8;">5–7 business days</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E1E21;border-radius:14px;border:1px solid rgba(255,255,255,0.07);margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="color:#F99F1B;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Requirement Summary</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ['Company', data.companyName],
                    ['Industry', data.industry],
                    ['Company Size', data.companySize],
                    ['Website', data.website],
                    ['Contact Person', data.contactPerson],
                    ['Designation', data.designation],
                    ['Email', data.email],
                    ['Phone', data.phone],
                  ].map(([label, value]) => value ? `
                  <tr>
                    <td width="40%" style="padding:6px 0;color:#5A5A6A;font-size:12px;vertical-align:top;">${label}</td>
                    <td style="padding:6px 0;color:#C0B8A8;font-size:12px;font-weight:500;">${value}</td>
                  </tr>` : '').join('')}
                  ${data.requirementTypes && data.requirementTypes.length ? `
                  <tr>
                    <td width="40%" style="padding:6px 0;color:#5A5A6A;font-size:12px;vertical-align:top;">Requirements</td>
                    <td style="padding:6px 0;color:#C0B8A8;font-size:12px;">${Array.isArray(data.requirementTypes) ? data.requirementTypes.join(', ') : data.requirementTypes}</td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>

            <div style="text-align:center;margin-bottom:32px;">
              <p style="color:#6A6A7A;font-size:13px;margin:0 0 16px;">Assess your board's governance health while you wait:</p>
              <a href="https://mentormyboard.com" style="display:inline-block;background:linear-gradient(135deg,#F99F1B,#FFD36A);color:#0A0A0A;font-size:13px;font-weight:700;padding:13px 28px;border-radius:9px;text-decoration:none;">Take Board Effectiveness Assessment →</a>
            </div>

            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 24px;">
            <p style="color:#4A4A5A;font-size:12px;line-height:1.65;margin:0;">
              Questions? Write to <a href="mailto:info@mentormyboard.com" style="color:#F99F1B;text-decoration:none;">info@mentormyboard.com</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#0F0F11;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="color:#3A3A4A;font-size:11px;margin:0;">© 2026 BoardOpp by MentorMyBoard · <a href="https://mentormyboard.com/privacy-policy" style="color:#4A4A5A;text-decoration:none;">Privacy Policy</a> · <a href="https://mentormyboard.com/terms-and-condition" style="color:#4A4A5A;text-decoration:none;">Terms</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function companyAdminNotificationHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Company Lead — BoardOpp</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141416;border-radius:16px;overflow:hidden;border:1px solid rgba(95,207,138,0.25);max-width:600px;">
        <tr><td style="background:linear-gradient(135deg,#5FCF8A,#A8F0C4);padding:24px 36px;">
          <div style="font-size:13px;font-weight:700;color:#0A0A0A;">🏢 New Company Registration — BoardOpp</div>
          <div style="font-size:11px;color:#1A5A35;margin-top:4px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ['Company Name', data.companyName],
              ['Industry', data.industry],
              ['Company Size', data.companySize],
              ['Website', data.website],
              ['Contact Person', data.contactPerson],
              ['Designation', data.designation],
              ['Email', data.email],
              ['Phone', data.phone],
              ['Requirements', Array.isArray(data.requirementTypes) ? data.requirementTypes.join(', ') : data.requirementTypes],
              ['Additional Details', data.additionalDetails],
            ].map(([label, value]) => `
            <tr>
              <td width="38%" style="padding:8px 0;color:#6A6A7A;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top;">${label}</td>
              <td style="padding:8px 0;color:#E0D8C8;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:500;">${value || '—'}</td>
            </tr>`).join('')}
          </table>
        </td></tr>
        <tr><td style="background:#0F0F11;padding:16px 36px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#3A3A4A;font-size:11px;margin:0;">View all leads in the <a href="https://boardopp.mentormyboard.com/admin/companies" style="color:#5FCF8A;text-decoration:none;">Admin Dashboard</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Exported functions ---

async function sendDirectorConfirmation(data) {
  await sendBrevoEmail(
    data.email,
    data.name,
    `Your BoardOpp Registration is Confirmed, ${data.name} ✓`,
    directorConfirmationHtml(data)
  );
  await sendBrevoEmail(
    ADMIN_EMAIL,
    'BoardOpp Team',
    `[BoardOpp] New Director Lead: ${data.name} — ${data.designation || ''}`,
    directorAdminNotificationHtml(data)
  );
}

async function sendCompanyConfirmation(data) {
  await sendBrevoEmail(
    data.email,
    data.contactPerson,
    `BoardOpp: Board Requirement Received for ${data.companyName} ✓`,
    companyConfirmationHtml(data)
  );
  await sendBrevoEmail(
    ADMIN_EMAIL,
    'BoardOpp Team',
    `[BoardOpp] New Company Lead: ${data.companyName} — ${data.contactPerson}`,
    companyAdminNotificationHtml(data)
  );
}

module.exports = { sendDirectorConfirmation, sendCompanyConfirmation };
