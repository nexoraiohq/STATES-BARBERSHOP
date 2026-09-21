# States Barbershop — Analytics API

First-party analytics API. No third-party services.

## Production Base URL

```
https://states-barbershop.vercel.app
```

## Local Development

```
http://localhost:3000
```

## Site ID

```
states-barbershop
```

## Database

**Production:** Vercel Postgres (via `@vercel/postgres`)
**Local:** JSON file at `data/analytics.json`

---

## Authentication

### Public endpoints (no auth)

- `POST /api/v1/events` — website sends analytics
- `GET /api/v1/health` — health check
- `GET /api/v1` — API metadata

### Authenticated endpoints (Bearer token)

All read endpoints require:

```
Authorization: Bearer <ANALYTICS_API_TOKEN>
```

Token is set via environment variable `ANALYTICS_API_TOKEN`.

---

## Environment Variables

| Variable              | Required   | Description                                   |
| --------------------- | ---------- | --------------------------------------------- |
| `POSTGRES_URL`        | Production | Vercel Postgres connection string             |
| `ANALYTICS_API_TOKEN` | Yes        | Bearer token for authenticated read endpoints |

---

## Endpoints

### POST /api/v1/events

Public. Ingest a tracking event.

**Request:**

```json
{
  "site_id": "states-barbershop",
  "visitor_id": "UUID",
  "session_id": "UUID",
  "event": "page_view",
  "timestamp": "2026-09-21T12:00:00.000Z",
  "page": "/",
  "url": "https://statesbarbershop.co.ke/",
  "title": "States Barbershop",
  "referrer": "",
  "traffic_source": "direct",
  "device_type": "desktop",
  "browser": "Chrome",
  "operating_system": "Windows",
  "viewport": { "width": 1440, "height": 900 },
  "properties": {}
}
```

**Required:** `site_id`, `event`, `visitor_id`, `session_id`

**Response (201):**

```json
{ "success": true, "event_id": "m1a2b3c4d5e6f7" }
```

---

### GET /api/v1/health

Public.

```json
{ "status": "ok", "api": "analytics", "version": "v1", "events_stored": 150 }
```

---

### GET /api/v1

Public. API metadata.

```json
{
  "version": "v1",
  "site_id": "states-barbershop",
  "endpoints": { ... }
}
```

---

### GET /api/v1/analytics

Authenticated. Summary.

**Parameters:** `start`, `end` (ISO dates)

**Response:**

```json
{
  "site_id": "states-barbershop",
  "period": { "start": "...", "end": "..." },
  "visitors": 45,
  "sessions": 62,
  "page_views": 180,
  "events": 320,
  "top_pages": [{ "page": "/", "views": 120 }],
  "traffic_sources": { "direct": 100, "google": 80 },
  "devices": { "desktop": 90, "mobile": 70 },
  "events_by_type": { "page_view": 180 },
  "conversions": { "whatsapp_click": 35 }
}
```

---

### GET /api/v1/analytics/events

Authenticated. Raw events.

**Parameters:** `start`, `end`, `event`, `page`, `visitor_id`, `session_id`, `limit`, `offset`

**Response:**

```json
{
  "events": [ { "id": "...", "event": "whatsapp_click", ... } ],
  "count": 1,
  "total": 35,
  "limit": 100,
  "offset": 0
}
```

---

### GET /api/v1/analytics/pages

Authenticated.

```json
{
  "pages": [
    { "page": "/", "views": 120, "unique_visitors": 40, "sessions": 55 }
  ]
}
```

---

### GET /api/v1/analytics/visitors

Authenticated.

```json
{
  "visitors": [
    {
      "visitor_id": "...",
      "first_seen": "...",
      "last_seen": "...",
      "sessions": 3,
      "events": 15,
      "pages_viewed": 4
    }
  ],
  "count": 1
}
```

---

### GET /api/v1/analytics/sessions

Authenticated.

```json
{
  "sessions": [
    {
      "session_id": "...",
      "visitor_id": "...",
      "started_at": "...",
      "last_activity": "...",
      "page_views": 3,
      "events": 8,
      "duration_seconds": 1800
    }
  ],
  "count": 1
}
```

---

### GET /api/v1/analytics/traffic

Authenticated.

```json
{
  "traffic_sources": {
    "direct": 100,
    "google": 80,
    "facebook": 40
  }
}
```

---

### GET /api/v1/analytics/conversions

Authenticated.

```json
{
  "total_visitors": 45,
  "conversions": {
    "whatsapp_click": { "count": 35, "unique_visitors": 20, "conversion_rate": 44.44 },
    "phone_click": { "count": 12, "unique_visitors": 8, "conversion_rate": 17.78 },
    "booking_click": { "count": 8, "unique_visitors": 6, "conversion_rate": 13.33 }
  }
}
```

---

## Event Names

| Event           | Properties            |
| --------------- | --------------------- |
| page_view       | page, title, referrer |
| whatsapp_click  | page, location        |
| phone_click     | page, location        |
| booking_click   | page, location        |
| instagram_click | page, location        |
| tiktok_click    | page, location        |
| service_click   | page, service_name    |

## Error Codes

| Status | Meaning            |
| ------ | ------------------ |
| 200    | Success            |
| 201    | Event created      |
| 400    | Bad request        |
| 401    | Unauthorized       |
| 405    | Method not allowed |
| 500    | Server error       |

## Example Authenticated Request

```http
GET /api/v1/analytics?start=2026-09-01&end=2026-09-21
Authorization: Bearer <ANALYTICS_API_TOKEN>
```

## Deployment

1. Create Vercel Postgres database in Vercel dashboard
2. Set `POSTGRES_URL` environment variable
3. Set `ANALYTICS_API_TOKEN` environment variable
4. Deploy: `vercel --prod`
