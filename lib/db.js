const fs = require('fs');
const path = require('path');

const SITE_ID = process.env.ANALYTICS_SITE_ID || 'states-barbershop';
const DATA_DIR = path.join(__dirname, '..', 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'analytics.json');

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function trafficSource(referrer) {
    if (!referrer) return 'direct';
    const r = referrer.toLowerCase();
    if (r.includes('google')) return 'google';
    if (r.includes('facebook') || r.includes('fb.')) return 'facebook';
    if (r.includes('instagram')) return 'instagram';
    if (r.includes('tiktok')) return 'tiktok';
    if (r.includes('twitter') || r.includes('x.com')) return 'twitter';
    return 'referral';
}

function readLocal() {
    try {
        if (fs.existsSync(EVENTS_FILE)) {
            const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        console.error('Error reading analytics file:', e.message);
    }
    return [];
}

function writeLocal(events) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

let pgPool = null;

async function getSql() {
    if (pgPool) return pgPool;
    if (!process.env.POSTGRES_URL) return null;
    try {
        const { Pool } = require('@vercel/postgres');
        pgPool = new Pool({ connectionString: process.env.POSTGRES_URL });
        await pgPool.query(`CREATE TABLE IF NOT EXISTS analytics_events (
            id TEXT PRIMARY KEY,
            site_id TEXT NOT NULL,
            visitor_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            event_name TEXT NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL,
            page TEXT,
            url TEXT,
            title TEXT,
            referrer TEXT,
            traffic_source TEXT,
            device_type TEXT,
            browser TEXT,
            operating_system TEXT,
            viewport_width INT,
            viewport_height INT,
            properties TEXT DEFAULT '{}'
        )`);
        await pgPool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_site_ts ON analytics_events(site_id, timestamp)`);
        await pgPool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_name)`);
        await pgPool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON analytics_events(visitor_id)`);
        await pgPool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id)`);
        return pgPool;
    } catch (e) {
        console.error('Postgres connection failed, using local fallback:', e.message);
        return null;
    }
}

async function insertEvent(event) {
    const id = genId();
    const pg = await getSql();

    const record = {
        id,
        site_id: event.site_id || SITE_ID,
        visitor_id: event.visitor_id,
        session_id: event.session_id,
        event_name: event.event,
        timestamp: event.timestamp || new Date().toISOString(),
        page: event.page || '/',
        url: event.url || '',
        title: event.title || '',
        referrer: event.referrer || '',
        traffic_source: event.traffic_source || trafficSource(event.referrer || ''),
        device_type: event.device_type || 'unknown',
        browser: event.browser || 'unknown',
        operating_system: event.operating_system || 'unknown',
        viewport_width: (event.viewport && event.viewport.width) || 0,
        viewport_height: (event.viewport && event.viewport.height) || 0,
        properties: JSON.stringify(event.properties || {})
    };

    if (pg) {
        await pg`INSERT INTO analytics_events (id, site_id, visitor_id, session_id, event_name, timestamp, page, url, title, referrer, traffic_source, device_type, browser, operating_system, viewport_width, viewport_height, properties) VALUES (${record.id}, ${record.site_id}, ${record.visitor_id}, ${record.session_id}, ${record.event_name}, ${record.timestamp}, ${record.page}, ${record.url}, ${record.title}, ${record.referrer}, ${record.traffic_source}, ${record.device_type}, ${record.browser}, ${record.operating_system}, ${record.viewport_width}, ${record.viewport_height}, ${record.properties})`;
    } else {
        const events = readLocal();
        events.push(record);
        writeLocal(events);
    }

    return id;
}

async function getEvents(opts = {}) {
    const { event, page, visitor_id, session_id, start, end, limit = 100, offset = 0 } = opts;
    const pg = await getSql();

    if (pg) {
        let query = 'SELECT * FROM analytics_events WHERE site_id = $1';
        const params = [SITE_ID];
        let idx = 2;
        if (event) { query += ` AND event_name = $${idx++}`; params.push(event); }
        if (page) { query += ` AND page = $${idx++}`; params.push(page); }
        if (visitor_id) { query += ` AND visitor_id = $${idx++}`; params.push(visitor_id); }
        if (session_id) { query += ` AND session_id = $${idx++}`; params.push(session_id); }
        if (start) { query += ` AND timestamp >= $${idx++}`; params.push(start); }
        if (end) { query += ` AND timestamp <= $${idx++}`; params.push(end); }

        const countResult = await pg.query(query.replace('SELECT *', 'SELECT COUNT(*) as c'), params);
        const total = parseInt(countResult.rows[0].c, 10);

        query += ` ORDER BY timestamp DESC LIMIT $${idx++} OFFSET $${idx++}`;
        params.push(Math.min(limit, 1000), offset);

        const result = await pg.query(query, params);
        return {
            events: result.rows.map(r => ({
                id: r.id,
                site_id: r.site_id,
                visitor_id: r.visitor_id,
                session_id: r.session_id,
                event_name: r.event_name,
                timestamp: r.timestamp,
                page: r.page,
                url: r.url,
                title: r.title,
                referrer: r.referrer,
                traffic_source: r.traffic_source,
                device_type: r.device_type,
                browser: r.browser,
                operating_system: r.operating_system,
                viewport: { width: r.viewport_width, height: r.viewport_height },
                properties: JSON.parse(r.properties || '{}')
            })),
            total
        };
    }

    let events = readLocal().filter(e => e.site_id === SITE_ID);
    if (start) events = events.filter(e => e.timestamp >= start);
    if (end) events = events.filter(e => e.timestamp <= end);
    if (event) events = events.filter(e => e.event_name === event);
    if (page) events = events.filter(e => e.page === page);
    if (visitor_id) events = events.filter(e => e.visitor_id === visitor_id);
    if (session_id) events = events.filter(e => e.session_id === session_id);
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const total = events.length;
    const paginated = events.slice(offset, offset + Math.min(limit, 1000));
    return { events: paginated, total };
}

async function getAnalyticsSummary(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const totalR = await pg`SELECT COUNT(*) as c FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e}`;
        const visitorsR = await pg`SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e}`;
        const sessionsR = await pg`SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e}`;
        const pageViewsR = await pg`SELECT COUNT(*) as c FROM analytics_events WHERE site_id = ${SITE_ID} AND event_name = 'page_view' AND timestamp >= ${s} AND timestamp <= ${e}`;
        const topPagesR = await pg`SELECT page, COUNT(*) as views FROM analytics_events WHERE site_id = ${SITE_ID} AND event_name = 'page_view' AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY page ORDER BY views DESC LIMIT 10`;
        const trafficR = await pg`SELECT traffic_source, COUNT(*) as count FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY traffic_source`;
        const devicesR = await pg`SELECT device_type, COUNT(*) as count FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY device_type`;
        const eventsR = await pg`SELECT event_name, COUNT(*) as count FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY event_name`;
        const periodR = await pg`SELECT MIN(timestamp) as start, MAX(timestamp) as end FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e}`;

        const eventsByType = {};
        eventsR.forEach(r => { eventsByType[r.event_name] = parseInt(r.count, 10); });

        const traffic = {};
        trafficR.forEach(r => { traffic[r.traffic_source] = parseInt(r.count, 10); });

        const devices = {};
        devicesR.forEach(r => { devices[r.device_type] = parseInt(r.count, 10); });

        return {
            site_id: SITE_ID,
            period: { start: periodR[0].start, end: periodR[0].end },
            visitors: parseInt(visitorsR[0].c, 10),
            sessions: parseInt(sessionsR[0].c, 10),
            page_views: parseInt(pageViewsR[0].c, 10),
            events: parseInt(totalR[0].c, 10),
            top_pages: topPagesR.map(r => ({ page: r.page, views: parseInt(r.views, 10) })),
            traffic_sources: traffic,
            devices,
            events_by_type: eventsByType,
            conversions: {
                whatsapp_click: eventsByType.whatsapp_click || 0,
                phone_click: eventsByType.phone_click || 0,
                booking_click: eventsByType.booking_click || 0,
                instagram_click: eventsByType.instagram_click || 0,
                tiktok_click: eventsByType.tiktok_click || 0,
                service_click: eventsByType.service_click || 0
            }
        };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID);
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const visitorSet = new Set(events.map(e => e.visitor_id));
    const sessionSet = new Set(events.map(e => e.session_id));
    const pageViews = events.filter(e => e.event_name === 'page_view');

    const pageCount = {};
    pageViews.forEach(e => { pageCount[e.page] = (pageCount[e.page] || 0) + 1; });
    const topPages = Object.entries(pageCount).sort((a, b) => b[1] - a[1]).map(([page, views]) => ({ page, views }));

    const traffic = {};
    events.forEach(e => { traffic[e.traffic_source] = (traffic[e.traffic_source] || 0) + 1; });

    const devices = {};
    events.forEach(e => { devices[e.device_type] = (devices[e.device_type] || 0) + 1; });

    const eventsByType = {};
    events.forEach(e => { eventsByType[e.event_name] = (eventsByType[e.event_name] || 0) + 1; });

    const timestamps = events.map(e => new Date(e.timestamp).getTime()).filter(t => !isNaN(t));

    return {
        site_id: SITE_ID,
        period: {
            start: timestamps.length ? new Date(Math.min(...timestamps)).toISOString() : null,
            end: timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null
        },
        visitors: visitorSet.size,
        sessions: sessionSet.size,
        page_views: pageViews.length,
        events: events.length,
        top_pages: topPages,
        traffic_sources: traffic,
        devices,
        events_by_type: eventsByType,
        conversions: {
            whatsapp_click: eventsByType.whatsapp_click || 0,
            phone_click: eventsByType.phone_click || 0,
            booking_click: eventsByType.booking_click || 0,
            instagram_click: eventsByType.instagram_click || 0,
            tiktok_click: eventsByType.tiktok_click || 0,
            service_click: eventsByType.service_click || 0
        }
    };
}

async function getPagesAnalytics(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const rows = await pg`SELECT page, COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors, COUNT(DISTINCT session_id) as sessions FROM analytics_events WHERE site_id = ${SITE_ID} AND event_name = 'page_view' AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY page ORDER BY views DESC`;
        return { pages: rows.map(r => ({ page: r.page, views: parseInt(r.views, 10), unique_visitors: parseInt(r.unique_visitors, 10), sessions: parseInt(r.sessions, 10) })) };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID && ev.event_name === 'page_view');
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const pageData = {};
    events.forEach(e => {
        if (!pageData[e.page]) pageData[e.page] = { page: e.page, views: 0, uv: {}, ss: {} };
        pageData[e.page].views++;
        pageData[e.page].uv[e.visitor_id] = 1;
        pageData[e.page].ss[e.session_id] = 1;
    });

    return { pages: Object.values(pageData).map(p => ({ page: p.page, views: p.views, unique_visitors: Object.keys(p.uv).length, sessions: Object.keys(p.ss).length })).sort((a, b) => b.views - a.views) };
}

async function getVisitorsAnalytics(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const rows = await pg`SELECT visitor_id, MIN(timestamp) as first_seen, MAX(timestamp) as last_seen, COUNT(DISTINCT session_id) as sessions, COUNT(*) as events, COUNT(DISTINCT page) as pages_viewed FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY visitor_id ORDER BY last_seen DESC`;
        return { visitors: rows.map(r => ({ visitor_id: r.visitor_id, first_seen: r.first_seen, last_seen: r.last_seen, sessions: parseInt(r.sessions, 10), events: parseInt(r.events, 10), pages_viewed: parseInt(r.pages_viewed, 10) })), count: rows.length };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID);
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const vd = {};
    events.forEach(e => {
        if (!vd[e.visitor_id]) vd[e.visitor_id] = { visitor_id: e.visitor_id, first_seen: e.timestamp, last_seen: e.timestamp, sessions: {}, events: 0, pages: {} };
        const v = vd[e.visitor_id];
        if (e.timestamp < v.first_seen) v.first_seen = e.timestamp;
        if (e.timestamp > v.last_seen) v.last_seen = e.timestamp;
        v.sessions[e.session_id] = 1;
        v.events++;
        v.pages[e.page] = (v.pages[e.page] || 0) + 1;
    });

    const visitors = Object.values(vd).map(v => ({ visitor_id: v.visitor_id, first_seen: v.first_seen, last_seen: v.last_seen, sessions: Object.keys(v.sessions).length, events: v.events, pages_viewed: Object.keys(v.pages).length })).sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen));
    return { visitors, count: visitors.length };
}

async function getSessionsAnalytics(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const rows = await pg`SELECT session_id, visitor_id, MIN(timestamp) as started_at, MAX(timestamp) as last_activity, COUNT(DISTINCT page) as page_views, COUNT(*) as events, ROUND(EXTRACT(EPOCH FROM (MAX(timestamp::TIMESTAMP) - MIN(timestamp::TIMESTAMP)))::NUMERIC, 1) as duration_seconds FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY session_id, visitor_id ORDER BY started_at DESC`;
        return { sessions: rows.map(r => ({ session_id: r.session_id, visitor_id: r.visitor_id, started_at: r.started_at, last_activity: r.last_activity, page_views: parseInt(r.page_views, 10), events: parseInt(r.events, 10), duration_seconds: parseFloat(r.duration_seconds) || 0 })), count: rows.length };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID);
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const sd = {};
    events.forEach(e => {
        if (!sd[e.session_id]) sd[e.session_id] = { session_id: e.session_id, visitor_id: e.visitor_id, started_at: e.timestamp, last_activity: e.timestamp, events: 0, pages: {} };
        const s = sd[e.session_id];
        if (e.timestamp < s.started_at) s.started_at = e.timestamp;
        if (e.timestamp > s.last_activity) s.last_activity = e.timestamp;
        s.events++;
        s.pages[e.page] = (s.pages[e.page] || 0) + 1;
    });

    const sessions = Object.values(sd).map(s => {
        const dur = (new Date(s.last_activity) - new Date(s.started_at)) / 1000;
        return { session_id: s.session_id, visitor_id: s.visitor_id, started_at: s.started_at, last_activity: s.last_activity, page_views: Object.keys(s.pages).length, events: s.events, duration_seconds: Math.round(dur * 10) / 10 };
    }).sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
    return { sessions, count: sessions.length };
}

async function getTrafficAnalytics(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const rows = await pg`SELECT traffic_source, COUNT(*) as count FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e} GROUP BY traffic_source ORDER BY count DESC`;
        const sources = {};
        rows.forEach(r => { sources[r.traffic_source] = parseInt(r.count, 10); });
        return { traffic_sources: sources };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID);
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const sources = {};
    events.forEach(e => { sources[e.traffic_source] = (sources[e.traffic_source] || 0) + 1; });
    return { traffic_sources: sources };
}

async function getConversionsAnalytics(start, end) {
    const pg = await getSql();
    const s = start || '0000';
    const e = end || '9999';

    if (pg) {
        const totalR = await pg`SELECT COUNT(DISTINCT visitor_id) as c FROM analytics_events WHERE site_id = ${SITE_ID} AND timestamp >= ${s} AND timestamp <= ${e}`;
        const totalVisitors = parseInt(totalR[0].c, 10);
        const convEvents = ['whatsapp_click', 'phone_click', 'booking_click', 'instagram_click', 'tiktok_click', 'service_click'];
        const conversions = {};

        for (const ev of convEvents) {
            const row = await pg`SELECT COUNT(*) as count, COUNT(DISTINCT visitor_id) as uv FROM analytics_events WHERE site_id = ${SITE_ID} AND event_name = ${ev} AND timestamp >= ${s} AND timestamp <= ${e}`;
            conversions[ev] = { count: parseInt(row[0].count, 10), unique_visitors: parseInt(row[0].uv, 10), conversion_rate: totalVisitors > 0 ? Math.round((parseInt(row[0].uv, 10) / totalVisitors) * 10000) / 100 : 0 };
        }

        return { total_visitors: totalVisitors, conversions };
    }

    let events = readLocal().filter(ev => ev.site_id === SITE_ID);
    if (start) events = events.filter(ev => ev.timestamp >= start);
    if (end) events = events.filter(ev => ev.timestamp <= end);

    const totalVisitors = new Set(events.map(e => e.visitor_id)).size;
    const convEvents = ['whatsapp_click', 'phone_click', 'booking_click', 'instagram_click', 'tiktok_click', 'service_click'];
    const conversions = {};

    convEvents.forEach(ev => {
        const evts = events.filter(e => e.event_name === ev);
        const uv = new Set(evts.map(e => e.visitor_id)).size;
        conversions[ev] = { count: evts.length, unique_visitors: uv, conversion_rate: totalVisitors > 0 ? Math.round((uv / totalVisitors) * 10000) / 100 : 0 };
    });

    return { total_visitors: totalVisitors, conversions };
}

async function getEventCount() {
    const pg = await getSql();
    if (pg) {
        const r = await pg`SELECT COUNT(*) as c FROM analytics_events WHERE site_id = ${SITE_ID}`;
        return parseInt(r[0].c, 10);
    }
    return readLocal().filter(e => e.site_id === SITE_ID).length;
}

module.exports = {
    SITE_ID,
    insertEvent,
    getEvents,
    getAnalyticsSummary,
    getPagesAnalytics,
    getVisitorsAnalytics,
    getSessionsAnalytics,
    getTrafficAnalytics,
    getConversionsAnalytics,
    getEventCount,
    genId,
    trafficSource
};
