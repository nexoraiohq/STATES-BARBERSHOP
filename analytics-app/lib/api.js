/**
 * States Barbershop Analytics API Client
 * 
 * Usage:
 *   const analytics = require('./lib/api');
 *   const data = await analytics.summary();
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.ANALYTICS_API_URL || 'https://states-barbershop.vercel.app';
const API_TOKEN = process.env.ANALYTICS_API_TOKEN || '';

if (!API_TOKEN) {
    console.warn('Warning: ANALYTICS_API_TOKEN not set. Set it in your environment or .env file.');
}

async function request(path, params = {}) {
    const url = new URL(`/api/v1${path}`, BASE_URL);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });

    const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    return json;
}

/**
 * Analytics summary (visitors, sessions, page views, events, traffic, devices, conversions)
 * @param {Object} opts - { start, end } ISO date strings
 */
async function summary(opts = {}) {
    return request('/analytics', opts);
}

/**
 * Raw events list
 * @param {Object} opts - { event, page, visitor_id, session_id, start, end, limit, offset }
 */
async function events(opts = {}) {
    return request('/analytics/events', opts);
}

/**
 * Page-level analytics (views, unique visitors, sessions per page)
 * @param {Object} opts - { start, end }
 */
async function pages(opts = {}) {
    return request('/analytics/pages', opts);
}

/**
 * Visitor-level analytics
 * @param {Object} opts - { start, end }
 */
async function visitors(opts = {}) {
    return request('/analytics/visitors', opts);
}

/**
 * Session-level analytics
 * @param {Object} opts - { start, end }
 */
async function sessions(opts = {}) {
    return request('/analytics/sessions', opts);
}

/**
 * Traffic source breakdown
 * @param {Object} opts - { start, end }
 */
async function traffic(opts = {}) {
    return request('/analytics/traffic', opts);
}

/**
 * Conversion rates for tracked actions
 * @param {Object} opts - { start, end }
 */
async function conversions(opts = {}) {
    return request('/analytics/conversions', opts);
}

/**
 * Health check (no auth required)
 */
async function health() {
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    return res.json();
}

module.exports = {
    summary, events, pages, visitors, sessions, traffic, conversions, health
};
