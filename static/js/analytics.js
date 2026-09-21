(function() {
    'use strict';

    var API_URL = 'https://states-barbershop.vercel.app';
    var SITE_ID = 'states-barbershop';

    function getVisitorId() {
        var key = 'states_visitor_id';
        var id = localStorage.getItem(key);
        if (!id) {
            id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem(key, id);
        }
        return id;
    }

    function getSessionId() {
        var key = 'states_session_id';
        var stored = sessionStorage.getItem(key);
        if (stored) return stored;
        var id = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(key, id);
        return id;
    }

    function getDeviceType() {
        var w = window.innerWidth;
        if (w <= 768) return 'mobile';
        if (w <= 1024) return 'tablet';
        return 'desktop';
    }

    function getBrowser() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) return 'Chrome';
        if (ua.indexOf('Edg') > -1) return 'Edge';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        return 'Other';
    }

    function getOS() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Win') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'macOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
        return 'Other';
    }

    function getTrafficSource() {
        var ref = document.referrer || '';
        if (!ref) return 'direct';
        var r = ref.toLowerCase();
        if (r.indexOf('google') > -1) return 'google';
        if (r.indexOf('facebook') > -1 || r.indexOf('fb.') > -1) return 'facebook';
        if (r.indexOf('instagram') > -1) return 'instagram';
        if (r.indexOf('tiktok') > -1) return 'tiktok';
        if (r.indexOf('twitter') > -1 || r.indexOf('x.com') > -1) return 'twitter';
        return 'referral';
    }

    function sendEvent(eventName, properties) {
        var payload = {
            site_id: SITE_ID,
            visitor_id: getVisitorId(),
            session_id: getSessionId(),
            event: eventName,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            url: window.location.href,
            title: document.title,
            referrer: document.referrer || '',
            traffic_source: getTrafficSource(),
            device_type: getDeviceType(),
            browser: getBrowser(),
            operating_system: getOS(),
            viewport: { width: window.innerWidth, height: window.innerHeight },
            properties: properties || {}
        };

        if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            navigator.sendBeacon(API_URL + '/api/v1/events', blob);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_URL + '/api/v1/events', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(payload));
        }
    }

    function trackClicks() {
        document.addEventListener('click', function(e) {
            var el = e.target.closest('a, button, [data-analytics-event]');
            if (!el) return;

            var eventName = el.getAttribute('data-analytics-event');
            var service = el.getAttribute('data-analytics-service');
            var location = el.getAttribute('data-analytics-location') || '';

            if (el.closest('[data-analytics-event="whatsapp_click"]') || (el.href && el.href.indexOf('wa.me') > -1)) {
                sendEvent('whatsapp_click', { page: window.location.pathname, location: location });
                return;
            }

            if (el.closest('[data-analytics-event="phone_click"]') || (el.href && el.href.indexOf('tel:') > -1)) {
                sendEvent('phone_click', { page: window.location.pathname, location: location });
                return;
            }

            if (el.closest('[data-analytics-event="booking_click"]')) {
                sendEvent('booking_click', { page: window.location.pathname, location: location });
                return;
            }

            if (el.closest('[data-analytics-event="instagram_click"]') || (el.href && el.href.indexOf('instagram.com') > -1)) {
                sendEvent('instagram_click', { page: window.location.pathname });
                return;
            }

            if (el.closest('[data-analytics-event="tiktok_click"]') || (el.href && el.href.indexOf('tiktok.com') > -1)) {
                sendEvent('tiktok_click', { page: window.location.pathname });
                return;
            }

            if (el.closest('[data-analytics-event="service_click"]') || el.classList.contains('service-btn')) {
                var serviceName = service || el.textContent.trim();
                sendEvent('service_click', { page: window.location.pathname, service_name: serviceName });
                return;
            }

            if (eventName) {
                sendEvent(eventName, { page: window.location.pathname });
            }
        });
    }

    function trackPageView() {
        sendEvent('page_view');
    }

    trackPageView();
    trackClicks();
})();
