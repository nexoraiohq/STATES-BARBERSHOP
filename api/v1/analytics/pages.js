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

    const { start, end } = req.query;
    const data = await db.getPagesAnalytics(start, end);
    res.json(data);
};
