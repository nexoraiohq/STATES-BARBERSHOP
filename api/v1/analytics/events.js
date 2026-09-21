const db = require('../../../lib/db');

function requireAuth(req, res) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized. Provide Authorization: Bearer <token>' });
        return false;
    }
    if (auth.slice(7) !== process.env.ANALYTICS_API_TOKEN) {
        res.status(401).json({ error: 'Unauthorized. Invalid token.' });
        return false;
    }
    return true;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (!requireAuth(req, res)) return;

    const { event, page, visitor_id, session_id, start, end, limit, offset } = req.query;
    const data = await db.getEvents({
        event, page, visitor_id, session_id, start, end,
        limit: parseInt(limit, 10) || 100,
        offset: parseInt(offset, 10) || 0
    });
    res.json({ events: data.events, count: data.events.length, total: data.total, limit: parseInt(limit, 10) || 100, offset: parseInt(offset, 10) || 0 });
};
