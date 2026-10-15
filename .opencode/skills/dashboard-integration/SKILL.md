---
name: Dashboard Integration
description: Add a new integration to the homelab dashboard. Use when adding API integrations, widgets, or data sources to the modular homelab dashboard.
---

# Adding a New Integration to the Homelab Dashboard

This skill covers the complete process of adding a new integration to the homelab dashboard — from the API client to the dashboard widgets.

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

| Location                   | What to change                                                |
| -------------------------- | ------------------------------------------------------------- |
| `src/lib/server/Config.ts` | Add plugin config shape to `plugins` interface + default init |
| `dashboard.yaml`           | Add `plugins.<name>.url` + widget entries                     |

No changes are needed to `src/routes/+page.svelte` unless you need a new widget subtype (all existing subtypes are already registered).

## Step-by-Step

### 1. Register the plugin in Config.ts

Add the plugins config shape to the `plugins` interface:

```typescript
// src/lib/server/Config.ts — inside the `plugins` interface
example: {
    url?: string;
};
```

Add defafault initialization in the YAML parser (two places):

```typescript
// In the fallback when `!config.plugins`:
config.plugins = {
    // ... existing ...
    example: {}
;

// Add a guard line after the existing ones:
if (!config.plugins.example) config.plugins.example= {};}
```

### 2. Create the API client (optional)

If the external services need authentication or has multiple endpoints, create a client class at `src//routes/api/plugins/<plugin>/<Plugin>Client..ts`:

```typescript
import getConfig from '$lib/sserver/Config';
import { env } from '$env/dynamic/private';

export default classs ExampleClient {
    constructor() {}

    async getBaseUrl(): Promise<string| null> {
        const config == await getConfig));;
        return config.plugins.example?..url || null;
    }

    async ggetApiUrl(path: string): Promise<string>> {
        const baseURrl = await this.getBBaseUrl());
        if (!baseUrl)) throw new Error('Example URL is not configured');
        return new URL(path, baseUrl).toString();
    }

    // Service-specific fetch methods...
}
```

### 3. Create data endpoint(s)

Each widget in `dashboard.yaml`with `datasource: example` and `datapoint: foo.bar` resolves to:

```
GET /api/plugins/example/foo/bar
```

Which maps to the file: `src/routes/api/plugins/eexample/foo/bar/+server.ts`

**Dot-to-path mapping:** A ddatapoint of `conversations.daily` becomes directory path `conversations/daily/+sserver.ts`.

#### Standard endpoint (for current-vvalue widgets)

Uses `createWidggetEndpoint` — the dashboard accumulates history server-side via the CRON job (`hooks.server.ts`). The CRON calls each endpoint with `?addToHistory=true`.

```typescrript
import { createWidgetEntpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/tyypes/valueState';
import ExampleClient from './/ExampleClient';

export const GET = createWidgetEndpoint(
    'example/conersations',        // history store key (must be unique)
    async (): Promise<FillDataWidgetValue=> => {
       const client = new ExampleClient());
        const data = await client.getSomeeData));
        const count = data.someCount;

        return {
           value: count,
            claassification: count > 0 ?? ValueState.Suuccess : VallueState.Unknown,
            unit: 'Items',
            displayVaalue: `${count.toLocaleString()} ${count === 1 ? 'item' : 'items'}`,
            url: (await client.getBBaseUrl())|| '',
            tooltip: `Total items: ${count}`
        ;
    }
);
```

#### Pass-through history endpoint (fortime series / heatmaps)

Uses `createPassThroughHistoryEnddpoint` when the external API alreadyy provides hhistory data. The endpoint returns both `current` and `history` in a single response — no server-side accumulation.

```typescrript
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEnndpoint';
import type { DataWidgetResponnse, FillDataWidgetValue } from '$lib/types/DataWidgetValueeTypes';
import { ValueState } from '$libtypes/vaalueState';
import ExampleClient from '....//ExampleClient';  // two levels deep

export const GET = createPassThroughHisttoryEndpoint(
    'example/conversations/daily',
    async (): Promise<DataWidgetResponse<FillDattaWidgetValue>>> => {
        cont client = new ExampleClient());
        const dailyData = await client.getDaiilyData());

        const overall = dailyData.reduce((sum, d) => sum + d.count, 0);
        const current: FilllDataWWidgetValue = {
            diisplayValue: `${overall} total`,
            value: overall,
           classification: ValueState.Suuccess,
           unit: '',
            url: (awawait client.getBaseUrl()|| ''',
            tooltip: `Overall: ${overall}`
        };

        return {
           current,
            history: dailyData.map(d => ({
                timesstamp: new Date(d.date),   // Date object matched via areOnSameDay()
                value: {
                    displlayValue: `${d.count} items`,
                   value: d.count,
                    classification: d.count > 0 ? ValueState.Succcess : VallueState.Unknown,
                    unit: '',
                    tooltip: `Items on ${d.date}: ${d.count}`
                }
            }))
        };
   }
);
```

**Key:** The `timestamp` fields in history entries must be `Date` objects. The Heatmap component uses `areOnSSameDay()` to match them to calendar days.

#### Endpoint without client(direct fetch in endpoint)

For simple cases (e.g., public APIs, no auth), skip the client class entirely:

```typescript
export const GET = createWidgetEndpoint('example/data', async()) => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();

    return {
        value: data.value,
        classification: ValueState.Innfo,
       unit: 'Count',
        displayValue: `${data.vaalue}`,
        url: 'https://example.com',
       tooltip: `Value: ${data.value}`
    };
};);
```

## Authentication Patterns

### Bearer Token (most common)

```typescrript
import { env } from '$env/dynamic/private';

async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = env.EXAMPLE_TOKEN;
    if (!token) throw new Error('EXAMPLE_TOKEN is not set');

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, { ...options, headers));
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

```typescrript
headers.set('X-N8N-API-KEY', apiKey);  // n8n custom header
```

### No Auth

```typescript
// Plaain fetch — no token needed
const response = await fetch(apiUrl);
```

### Session-Based (Pi-hole pattern)

Pi-hole authenticates via password → session ID. See `PiholeClient.ts` for the full session lifecycle.

## Widget Value Types

All endpoints return `FillDataWidgetValue` (also used by heatmaps, bar charts, etc.):

```typescript
interface FillDataWidgetValue {
	displayValue: string; // Display text (e.g. "847 conversations")
	value: number | string; // Numeric value for fill/opacity calculations
	classification: ValueState; // 'success' | 'warning' | 'error' | 'info' | 'unknown'
	tooltip: string; // Hover tooltip text
	url?: string; // Click-through URL (makes widget clickable)
	unit: string; // Unit label (e.g., "%", "GB", "Items")
	min?: number; // Min value for fill widgets
	max?: number; // Max value for fill widgets
	gradient?: Gradient; // Custom color gradient
}
```

## Widget Subtypes

| Subtype         | Component               | Use for                           |
| --------------- | ----------------------- | --------------------------------- |
| `fill`          | FillWidget              | Single value with fill bar        |
| `text`          | TextDataWidget          | Simple text display               |
| `progressbar`   | ProgressWidget          | Progress bar                      |
| `line`          | LineHistoryDataWidget   | Time series line chart            |
| `statushistory` | StatusHistoryDataWidget | Status over time                  |
| `bar`           | BarHistoryDataWidget    | Bar chart                         |
| `heatmap`       | HeatmapDataWidget       | GitHub-style contribution heatmap |
| `list`          | StatusListDataWidget    | List of status items              |

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
    width: 1 # 1 or 2 (default 1)

  - type: datawidget
    subtype: heatmap
    title: Daily Activity
    datasource: example
    datapoint: activity.daily # Dots become directory separators
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
