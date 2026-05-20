/**
 * Mobile Shop Manager - SMS OTP Server
 * =====================================
 * Zero dependencies - only requires Node.js
 *
 * SETUP:
 *  1. Sign up FREE at: https://www.twilio.com/try-twilio
 *  2. Get your Account SID, Auth Token from: https://console.twilio.com
 *  3. Get a free Twilio phone number (trial gives you one)
 *  4. Fill in CONFIG below
 *  5. Run:  node server.js
 *  6. Open: http://localhost:3000
 */

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

// ================================================================
//  FILL IN YOUR TWILIO CREDENTIALS HERE
// ================================================================
const CONFIG = {
    TWILIO_ACCOUNT_SID:  'YOUR_ACCOUNT_SID',   // e.g. ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN:   'YOUR_AUTH_TOKEN',     // e.g. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_FROM_NUMBER:  'YOUR_TWILIO_NUMBER',  // e.g. +12015550123 (Twilio gives you this)
    PORT: 3000
};
// ================================================================

// In-memory OTP store { phone: { code, expires } }
const otpStore = new Map();

// Static file MIME types
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
};

// Format Pakistani number: 03XXXXXXXXX → +923XXXXXXXXX
function formatPKNumber(phone) {
    let n = String(phone).trim().replace(/\s+/g, '').replace(/-/g, '');
    if (n.startsWith('0'))  return '+92' + n.slice(1);
    if (!n.startsWith('+')) return '+92' + n;
    return n;
}

// Generate 4-digit OTP
function generateOTP() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

// Send SMS via Twilio REST API
function sendTwilioSMS(to, message) {
    return new Promise((resolve, reject) => {
        const body = new URLSearchParams({
            To:   to,
            From: CONFIG.TWILIO_FROM_NUMBER,
            Body: message
        }).toString();

        const options = {
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${CONFIG.TWILIO_ACCOUNT_SID}/Messages.json`,
            method: 'POST',
            headers: {
                'Content-Type':   'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body),
                'Authorization':  'Basic ' + Buffer.from(
                    CONFIG.TWILIO_ACCOUNT_SID + ':' + CONFIG.TWILIO_AUTH_TOKEN
                ).toString('base64')
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        reject(new Error(json.message || `HTTP ${res.statusCode}`));
                    }
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Read POST body as JSON
function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', c => data += c);
        req.on('end', () => {
            try { resolve(JSON.parse(data || '{}')); }
            catch (e) { reject(new Error('Invalid JSON')); }
        });
        req.on('error', reject);
    });
}

// Send JSON response
function sendJSON(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

// ── Main HTTP Server ──────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    // CORS headers (allow browser fetch from any origin)
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const parsed = url.parse(req.url, true);
    const route  = parsed.pathname;

    // ── POST /send-otp ──────────────────────────────────────────
    if (req.method === 'POST' && route === '/send-otp') {
        try {
            const { phone } = await readBody(req);
            if (!phone) return sendJSON(res, 400, { error: 'Phone number is required' });

            const formatted = formatPKNumber(phone);
            const otp = generateOTP();

            // Store OTP with 2-minute expiry
            otpStore.set(formatted, { code: otp, expires: Date.now() + 120_000 });

            // Check if credentials are configured
            if (CONFIG.TWILIO_ACCOUNT_SID === 'YOUR_ACCOUNT_SID') {
                // Demo mode: log OTP to server console
                console.log(`\n📱 [DEMO] OTP for ${formatted}: ${otp}\n`);
                return sendJSON(res, 200, { success: true, demo: true, otp }); // otp sent back in demo
            }

            await sendTwilioSMS(
                formatted,
                `Your Mobile Shop Manager verification code is: ${otp}\nValid for 2 minutes. Do not share this code.`
            );
            console.log(`✅ OTP sent to ${formatted}`);
            sendJSON(res, 200, { success: true });

        } catch (err) {
            console.error('❌ SMS Error:', err.message);
            sendJSON(res, 500, { error: err.message });
        }
        return;
    }

    // ── POST /verify-otp ────────────────────────────────────────
    if (req.method === 'POST' && route === '/verify-otp') {
        try {
            const { phone, code } = await readBody(req);
            if (!phone || !code) return sendJSON(res, 400, { error: 'Phone and code are required' });

            const formatted = formatPKNumber(phone);
            const stored    = otpStore.get(formatted);

            if (!stored) {
                return sendJSON(res, 400, { error: 'No OTP was sent to this number. Please request a new code.' });
            }
            if (Date.now() > stored.expires) {
                otpStore.delete(formatted);
                return sendJSON(res, 400, { error: 'OTP has expired. Please request a new code.' });
            }
            if (stored.code !== String(code).trim()) {
                return sendJSON(res, 400, { error: 'Incorrect verification code.' });
            }

            otpStore.delete(formatted);
            console.log(`✅ Phone verified: ${formatted}`);
            sendJSON(res, 200, { success: true });

        } catch (err) {
            sendJSON(res, 500, { error: err.message });
        }
        return;
    }

    // ── Static File Server ──────────────────────────────────────
    let filePath = route === '/' ? '/index.html' : route;
    filePath = path.join(__dirname, filePath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') { res.writeHead(404); res.end('File not found'); }
            else { res.writeHead(500); res.end('Server error'); }
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(content);
    });
});

server.listen(CONFIG.PORT, () => {
    const isDemo = CONFIG.TWILIO_ACCOUNT_SID === 'YOUR_ACCOUNT_SID';
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║      🏪  Mobile Shop Manager — Server       ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║   🌐 Open in browser:                       ║`);
    console.log(`║      http://localhost:${CONFIG.PORT}                  ║`);
    console.log('╠══════════════════════════════════════════════╣');
    if (isDemo) {
        console.log('║   ⚠️  SMS MODE: DEMO (OTP shown in console) ║');
        console.log('║   Fill TWILIO credentials for real SMS      ║');
    } else {
        console.log('║   📱 SMS MODE: REAL (Twilio)                ║');
    }
    console.log('╚══════════════════════════════════════════════╝\n');
});
