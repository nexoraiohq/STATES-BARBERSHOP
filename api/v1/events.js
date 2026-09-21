const db = require('../../lib/db');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
};
