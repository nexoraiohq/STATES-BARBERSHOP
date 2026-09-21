const db = require('../../lib/db');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

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
};
