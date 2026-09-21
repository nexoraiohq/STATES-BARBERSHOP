/**
 * Test the API client against the local or production server.
 * 
 * Usage:
 *   ANALYTICS_API_URL=http://localhost:3000 ANALYTICS_API_TOKEN=your_token node test.js
 */

const analytics = require('./lib/api');

async function run() {
    console.log('=== Health Check ===');
    const health = await analytics.health();
    console.log(health);

    console.log('\n=== Summary ===');
    const summary = await analytics.summary();
    console.log(JSON.stringify(summary, null, 2));

    console.log('\n=== Events (last 5) ===');
    const evts = await analytics.events({ limit: 5 });
    console.log(`Total: ${evts.total}, showing: ${evts.events.length}`);
    evts.events.forEach(e => console.log(`  ${e.timestamp} | ${e.event_name} | ${e.page} | ${e.visitor_id}`));

    console.log('\n=== Pages ===');
    const pages = await analytics.pages();
    console.log(JSON.stringify(pages, null, 2));

    console.log('\n=== Traffic ===');
    const traffic = await analytics.traffic();
    console.log(JSON.stringify(traffic, null, 2));

    console.log('\n=== Conversions ===');
    const conversions = await analytics.conversions();
    console.log(JSON.stringify(conversions, null, 2));

    console.log('\n=== Visitors ===');
    const visitors = await analytics.visitors();
    console.log(`Total visitors: ${visitors.count}`);
    visitors.visitors.slice(0, 5).forEach(v =>
        console.log(`  ${v.visitor_id} | sessions: ${v.sessions} | events: ${v.events} | last: ${v.last_seen}`)
    );

    console.log('\n=== Sessions ===');
    const sessions = await analytics.sessions();
    console.log(`Total sessions: ${sessions.count}`);
    sessions.sessions.slice(0, 5).forEach(s =>
        console.log(`  ${s.session_id} | ${s.visitor_id} | duration: ${s.duration_seconds}s | events: ${s.events}`)
    );

    console.log('\n=== Date Range Filter (last 24h) ===');
    const now = new Date();
    const dayAgo = new Date(now - 86400000).toISOString();
    const range = await analytics.summary({ start: dayAgo, end: now.toISOString() });
    console.log(`Period: ${range.period.start} to ${range.period.end}`);
    console.log(`Events: ${range.events}, Visitors: ${range.visitors}, Sessions: ${range.sessions}`);

    console.log('\n=== Filter by Event Type ===');
    const pageViews = await analytics.events({ event: 'page_view', limit: 3 });
    console.log(`page_view events: ${pageViews.total}`);
    pageViews.events.forEach(e => console.log(`  ${e.page} | ${e.timestamp}`));

    console.log('\nAll tests passed!');
}

run().catch(err => {
    console.error('Test failed:', err.message);
    process.exit(1);
});
