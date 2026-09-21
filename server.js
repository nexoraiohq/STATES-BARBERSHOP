const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN_FILE = path.join(__dirname, 'data', 'api-token.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname, { redirect: false }));

function loadToken() {
    if (process.env.ANALYTICS_API_TOKEN) return process.env.ANALYTICS_API_TOKEN;
    if (fs.existsSync(TOKEN_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
            if (data.token) return data.token;
        } catch (e) { }
    }
    const token = 'states_' + crypto.randomBytes(32).toString('hex');
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }, null, 2));
    console.log('\n========================================');
    console.log('  API Token (save this!):');
    console.log('  ' + token);
    console.log('========================================\n');
    return token;
}

const API_TOKEN = loadToken();

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. Provide Authorization: Bearer <token>' });
    }
    const token = auth.slice(7);
    if (token !== API_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }
    next();
}

// Health (no auth)
app.get('/api/v1/health', async (req, res) => {
    const count = await db.getEventCount();
    res.json({ status: 'ok', api: 'analytics', version: 'v1', events_stored: count });
});

// API metadata (no auth)
app.get('/api/v1', (req, res) => {
    res.json({
        name: 'States Barbershop Analytics API',
        version: 'v1',
        site_id: db.SITE_ID,
        endpoints: {
            health: 'GET /api/v1/health',
            ingest: 'POST /api/v1/events',
            summary: 'GET /api/v1/analytics',
            events: 'GET /api/v1/analytics/events',
            pages: 'GET /api/v1/analytics/pages',
            visitors: 'GET /api/v1/analytics/visitors',
            sessions: 'GET /api/v1/analytics/sessions',
            traffic: 'GET /api/v1/analytics/traffic',
            conversions: 'GET /api/v1/analytics/conversions'
        }
    });
});

// Ingest event (public - called by website tracking script)
app.post('/api/v1/events', async (req, res) => {
    try {
        const event = req.body;
        if (!event || !event.event) {
            return res.status(400).json({ error: 'Missing event field' });
        }
        const id = await db.insertEvent(event);
        res.json({ success: true, event_id: id });
    } catch (err) {
        console.error('Error ingesting event:', err);
        res.status(500).json({ error: 'Failed to ingest event' });
    }
});

// Summary
app.get('/api/v1/analytics', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getAnalyticsSummary(start, end);
    res.json(data);
});

// Events
app.get('/api/v1/analytics/events', requireAuth, async (req, res) => {
    const { event, page, visitor_id, session_id, start, end, limit, offset } = req.query;
    const data = await db.getEvents({
        event, page, visitor_id, session_id, start, end,
        limit: parseInt(limit, 10) || 100,
        offset: parseInt(offset, 10) || 0
    });
    res.json({ events: data.events, count: data.events.length, total: data.total, limit: parseInt(limit, 10) || 100, offset: parseInt(offset, 10) || 0 });
});

// Pages
app.get('/api/v1/analytics/pages', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getPagesAnalytics(start, end);
    res.json(data);
});

// Visitors
app.get('/api/v1/analytics/visitors', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getVisitorsAnalytics(start, end);
    res.json(data);
});

// Sessions
app.get('/api/v1/analytics/sessions', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getSessionsAnalytics(start, end);
    res.json(data);
});

// Traffic
app.get('/api/v1/analytics/traffic', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getTrafficAnalytics(start, end);
    res.json(data);
});

// Conversions
app.get('/api/v1/analytics/conversions', requireAuth, async (req, res) => {
    const { start, end } = req.query;
    const data = await db.getConversionsAnalytics(start, end);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`States Barbershop API running on http://localhost:${PORT}`);
});
