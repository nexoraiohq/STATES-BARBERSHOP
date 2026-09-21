const db = require('../../lib/db');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const count = await db.getEventCount();
    res.json({ status: 'ok', api: 'analytics', version: 'v1', events_stored: count });
};
