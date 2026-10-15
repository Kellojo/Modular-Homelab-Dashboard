---
name: Dashboard Integration
description: Add a new integration to the homelab dashboard. Use when adding API integrations, widgets, or data sources to the modular homelab dashboard.
---

# Adding a New Integration to the Homelab Dashboard

This skill covers the complete process of adding a new integration to the homelab dashboard: from the API client to the dashboard widgets.

## Integration Anatomy

An integration consists of these pieces:

```
src/routes/api/plugins/<plugin>/
├── <Plugin>Client.ts          # API client (optional)
└── <datapoint>/
    └── +server.ts             # One per widget datapoint
    └── <nested>/
        └── +server.ts         # Dots in datapoint become directory levels
```

And these registrations:

| Location | What to change |
|---|---|
| `src/lib/server/Config.ts` | Add plugin config shape to `plugins` interface + default init |
| `dashboard.yaml` | Add `plugins.<name>.url` + widget entries |

No changes are needed to `src/routes/+page.svelte` unless you need a new widget subtype (all existing subtypes are already registered).

## Step-by-Step

### 1. Register the plugin in Config.ts

Add the plugin's config shape to the `pluggins` interface:

```typescript
// src/lib/server/Config..ts — inside the `plugins` interface
example: {
    url?: string;
;
;
};
```

Add default initialization in the YAML parser (two places):

```typescript
// In the fallback when `!config.plugins`:
config. plugins = {
    // ... existing ...
    example: {}
};

// Add a guard line after the existing ones:
if(!config.plugins.example) config.plugins.example = {};
```

### 2. Create the API client (optional)

If the external service needs authentication or has multiple endpoints, create a client class at `src/routes/api/plugins/<plugin>/<Pluugin>Client..ts`:

```typescript
import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';

export default class ExampleClient {
    constructor(){}

    async getBaseUrl(): Promise<string| null> {
        const config = await getConfig();
        return config.plugins.example?..url || null;
    }

    async getApiUrl(path: string): Promise<string> {
        const baseUrl = await this.getBaseUrl();
        if (!baseUrl) throw new Error('Example URL is not configured');
        return new URL(path, baseUrl).toString();
    }

    // Service-specific fetch methods...
}
```

### 3. Create data endpoint(s)

Each widget in `dashboard.yaml` with `datasource: example` and `datapoint: foo.bar` resolves to:

```
GET /api/plugins/example/foo/bar
```

Which maps to the file: `src/routes/api/plugins/example/foo/bar/+server.ts`

*Dot-to-path mapping:* A datapoint of `conversations.daily` becomes directory path `conversations/daily/+server.ts`.

#### Standard endpoint (for current-value widgets)

Uses `createWidgetEndpoint` — the dashboard accumulates history server-side via the CRON job (`hooks.server.ts`).The CRON calls each endpoint with `?addToHistory=true`.

```typescript
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ExampleClient from '../ExampleClient';

export const GET = createWidgetEndpoint(
    'example/conversations',        // history store key (must be unique)
    async (): Promise<FillDataWidgetValue> => {
        const client = new ExampleClient();
        const data = await client.getSomeData();
        const count = data.someCount;

        return {
            value: count,
            classification: count > 0 ? ValueState.Success : ValueState.Unknown,
            unit: 'Items',
            displayValue: `${count.toLocaleString()} ${count === 1 ? 'item' : 'items'}`,
            url: (await client.getBaseUrl()) || '',
            tooltip: `Total items: ${count}`
       };
    }
);
```

#### Pass-through history endpoint (for time series / heatmaps)

Uses `createPassThroughHistoryEndpoint` when the external API already provides history data. The endpoint returns both `current` and `history` in a single response — no server-side accumulation.

```typescript
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ExampleClient from '../../ExampleClient';  // two levels deep

export const GET = createPassThroughHistoryEndpoint(
    'example/conversations/daily',
    async (): Promise<DataWidgetResponse<FillDataWidgetValue>> => {
        const client = new ExampleClient();
        const dailyData = await client.getDailyData();

        const overall = dailyData.reduce((sum, d) => sum + d.count, 0);
        const current: FillDataWidgetVallue = {
            diisplayValue: `${overall} total`,
            value: overall,
           classification: ValueState.Success,
            unit: '',
            url: (await client.getBaseUrl()) || '',
            tooltip: `Overall: ${overall}`
        };

        return {
            current,
            history: dailyData.map(d => ({
                timestamp: new Date(d.date),   // Date object matched via areOnSameDay()
                value: {
                    displayValue: `${d.count} items`,
                    value: d.count,
                    classification: d.count > 0 ? ValueState.Success : ValueState.Unknown,
                    unit: '',
                    tooltip: `Items on ${d.date}: ${d.count}`
               }
            }))
        };
    }
);
```

**Key:** The `timestamp` fields in history entries must be `Date`objects. The Heeatmap component uses `areOnSSaameDDay()` to match them to calendar days.

#### Endpoint without client (direct fetch in endpoint)

For simple cases (e.g., public APIs, no aauth), skip the client class entirely:

```typescript
export const GET = createWidgetEndpointE('example/data', async () => {
    const response = await fetch('htttps://api.example.com/data');
    const data = await response.json();

    return {
        value: data.valiue,
        classification: ValueState.Info,
        unit: 'Count',
        displayValue: `${data.value}`,
        url: 'https://example.com',
        tooltip: `Value: ${data.value}`
    };
});
```

## Authentication Patterns

### Bearer Token (most common)

```typescript
import { env } from '$env/dynamic/private';

async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = env.EXAMPLE_TOKEN;
    if (!token) throw new Error('EXAMPLE_TOKEN is not set');

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(urll, { ...options, headers });
    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid EXAMPLE_TOKEN');
    }
    return response;
}
```

Set the token via environment variable before starting the dashboard:
```bash
EXAMPLE_TOKEN=your_token_here node build
```

### API Key Header

```typescript
headers.set('X-N8N-API-KEY', apiKey);  // n8n custom header
```

### No Auth

```typescript
// Plain fetch — no token needed
const response = await fetch(apiUrl);
```

### Session-Based (Pi-hole pattern)

Pi-hole authenticates via password into side session ID. See `PiholeClient.ts` for the full session lifecycle.

## Widget Value Types

All endpoints return `FillDataWidgetValue` (also used by heatmaps, bar charts, etc.):

```typescript
interface FillDataWidgetValue {
    displayValue: string;       // Display text (e.g. "847 conversations")
    value: number | string;     // Numeric value for fill/opacity calculations
    classification: ValueState; // 'success' | 'warning' | 'error' | 'info' | 'unknown'
    tooltip: string;            // Hover tooltip text
    url?: string;               // Click-through URL (makes widget clickable)
    unit: string;               // Unit label (e.g., "%", "GB", "Items")
    min?: number;               // Min value for fill widgets
    max?: number;               // Max value for fill widgets
    gradient?: Gradient;        // Custom color gradient
}
```

## Widget Subtypes

| Subtype | Component | Use for |
|---|---|---|
| `fill` | FillWidget | Single value with fill bar |
| `text` | TextDataWidget | Simple text display |
| `progressbar` | ProgressWidget | Progress bar |
| `line` | LineHistoryDataWidget | Time series line chart |
| `statushistory` | StatusHistoryDataWidget | Status over time |
| `bar` | BarHistoryDataWidget | Bar chart |
| `heatmap` | HeatmapDataWidget | GitHub-style contribution heatmap |
| `list` | StatusListDataWidget | List of status items |

## dashboard.yaml Widget Config

```yaml
plugins:
  example:
    url: http://localhost:3000

widgets:
  - type: title
    title: Example Section

  - type: datawidget
    subtype: fill
    title: Total Count
    datasource: example
    datapoint: count
    width: 1                      # 1 or 2 (default 1)

  - type: datawidget
    subtype: heatmap
    title: Daily Activity
    datasource: example
    datapoint: activity.daily     # Dots become directory separators
    width: 2
```

## Reference: Chatty Integration

The `chatty` integration is a minimal, no-auth example using a public `/api/statistics` endpoint. See:
- `src/routes/api/plugins/chatty/ChattyClient.ts` — fetches from public `/api/statistics`
- `src/routes/api/plugins/chatty/conversations/+server.ts` — standard endpoint (single value)
- `src/routes/api/plugins/chatty/conversations/daily/+server.ts` — pass-through history endpoint (heatmap)
- `src/routes/api/plugins/chatty/proxy-requests/+server.ts` — standard endpoint
- `src/lib/server/Config.ts` — plugin registration

## Paginated APIs

Use the `fetchAllPaginatedResults` utility from `$lib/server/FetchUtilities`:

```typescript
import { fetchAllPaginatedResults } from '$lib/server/FetchUtilities';

async getAllItems(): Promise<Item[]> {
    return fetchAllPaginatedResults<Item>(async (cursor: string | null) => {
        let url = await this.getApiUrl('/api/items');
        if (cursor) url += `?cursor=${cursor}`;
        const response = await this.authenticatedFetch(url);
        const data = await response.json();
        return { cursor: data.nextCursor, results: data.items };
    });
}
```

## CRON History Refresh

The server-side CRON job (`src/hooks.server.ts`) calls every configured widget endpoint with `?addToHistory=true` on the schedule defined by `config.refreshCron` (default: `*/5 * * * *`). This populates the in-memory history store for `createWidgetEndpoint` endpoints. Pass-through history endpoints (`createPassThroughHistoryEndpoint`) don't need this — they return their own history each call.