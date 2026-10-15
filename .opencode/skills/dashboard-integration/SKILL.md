---
name: Dashboard Integration
description: Add a new integration to the homelab dashboard. Use when adding API integrations, widgets, or data sources to the modular homelab dashboard.
---

# Adding a New Integration to the Homelab Dashboard

This skill covers the complete process of adding a new integration: API client, widget endpoints, Config.ts registration, dashboard.yaml config, and documentation on the docs branch.

## Integration Anatomy

An integration consists of these pieces in the main branch:

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

No changes are needed to `src/routes/+page.svelte` unless you need a new widget subtype.

## Documentation (docs branch)

Every integration needs a documentation page on the `docs` branch:

1. Switch to or branch off `docs`
2. Create `docs/Available Plugins/<PluginName>.md`
3. Commit the change

Template:
```markdown
Banner image line
Plugin description
Config setup (URL in plugins section)
Auth setup (environment variables, skip if no auth)
Data Points section (list all datapoints)
Example Configuration section (sample widgets)
```

The `metadata.yaml` in the same directory controls the ordering (`order: 3` for a third-level nav item). Existing plugins (Gitea, n8n, Karakeep, etc.) show the exact format to follow.

For integrations with **no authentication** (public endpoints), omit the environment variable section entirely. The Chatty integration is an example of this.

## Step-by-Step (main branch)

### 1. Register the plugin in Config.ts

Add the plugin config shape to the `plugins` interface:

```typescript
// src/lib/server/Config.ts inside the `plugins` interface
example: {
    url?: string;
};
```

Add default initialization in the YAML parser (two places):

```typescript
// In the fallback when `!config.plugins`:
config.plugins = {
    // ... existing ...
    example: {}
};

// Add a guard line after the existing ones:
if (!config.plugins.example) config.plugins.example = {};
```

### 2. Create the API client (optional)

If the external service needs authentication or has multiple endpoints, create a client class at `src/routes/api/plugins/<plugin>/<Plugin>Client.ts`:

```typescript
import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';

export default class ExampleClient {
    constructor() {}

    async getBaseUrl(): Promise<string | null> {
        const config = await getConfig();
        return config.plugins.example?.url || null;
    }

    async getApiUrl(path: string): Promise<string> {
        const baseUrl = await this.getBaseUrl();
        if (!baseUrl) throw new Error('Example URL is not configured');
        return new URL(path, baseUrl).toString();
    }
}
```

### 3. Create data endpoint(s)

Each widget in `dashboard.yaml` with `datasource: example` and `datapoint: foo.bar` resolves to `GET /api/plugins/example/foo/bar`, mapping to `src/routes/api/plugins/example/foo/bar/+server.ts`.

**Dot-to-path mapping:** `conversations.daily` becomes directory `conversations/daily/+server.ts`.

Import paths: endpoints one level deep use `../ExampleClient`, two levels deep use `../../ExampleClient`.

#### Standard endpoint (for current-value widgets)

Uses `createWidgetEndpoint` existing integrations accumulate history server-side via the CRON job.

```typescript
import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ExampleClient from '../ExampleClient';

export const GET = createWidgetEndpoint(
    'example/count',
    async (): Promise<FillDataWidgetValue> => {
        const client = new ExampleClient();
        const count = await client.getCount();

        return {
            value: count,
            classification: count > 0 ? ValueState.Success : ValueState.Unknown,
            unit: 'Items',
            displayValue: `${formatInteger(count)} ${count === 1 ? 'item' : 'items'}`,
            url: (await client.getBaseUrl()) || '',
            tooltip: `Total items: ${formatInteger(count)}`
        };
    }
);
```

#### Pass-through history endpoint (for time series / heatmaps)

Uses `createPassThroughHistoryEndpoint` when the external API already provides history data. Returns both `current` and `history` in one response.

```typescript
import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ExampleClient from '../../ExampleClient';

export const GET = createPassThroughHistoryEndpoint(
    'example/daily',
    async (): Promise<DataWidgetResponse<FillDataWidgetValue>> => {
        const client = new ExampleClient();
        const dailyData = await client.getDailyData();

        const overall = dailyData.reduce((sum, d) => sum + d.count, 0);
        const current: FillDataWidgetValue = {
            displayValue: `${formatInteger(overall)} total`,
            value: overall,
            classification: ValueState.Success,
            unit: '',
            url: (await client.getBaseUrl()) || '',
            tooltip: `Overall: ${formatInteger(overall)}`
        };

        return {
            current,
            history: dailyData.map(d => ({
                timestamp: new Date(d.date),
                value: {
                    displayValue: `${formatInteger(d.count)} items`,
                    value: d.count,
                    classification: d.count > 0 ? ValueState.Success : ValueState.Unknown,
                    unit: '',
                    tooltip: `Items on ${d.date}: ${formatInteger(d.count)}`
                }
            }))
        };
    }
);
```

The `timestamp` fields must be `Date` objects. The Heatmap component uses `areOnSameDay()` to match them to calendar days.

## Authentication Patterns

### Bearer Token

Used by Gitea, Gotify, Home Assistant, Karakeep:

```typescript
import { env } from '$env/dynamic/private';

async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = env.EXAMPLE_TOKEN;
    if (!token) throw new Error('EXAMPLE_TOKEN is not set');

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid EXAMPLE_TOKEN');
    }
    return response;
}
```

### API Key Header

Used by n8n: `headers.set('X-N8N-API-KEY', apiKey);`

### No Auth

Used by Chatty (public `/api/statistics` endpoint):

```typescript
const response = await fetch(apiUrl);
```

### Session-Based

Used by Pi-hole: password authentication to get a session ID. See `PiholeClient.ts`.

## Widget Value Types

All endpoints return `FillDataWidgetValue`:

| Field | Type | Description |
|---|---|---|
| `displayValue` | `string` | Display text (e.g. "847 conversations") |
| `value` | `number \| string` | Numeric value for fill/opacity |
| `classification` | `ValueState` | `success`, `warning`, `error`, `info`, `unknown` |
| `tooltip` | `string` | Hover tooltip text |
| `url` | `string?` | Click-through URL |
| `unit` | `string` | Unit label ("%", "GB", "Items") |
| `min` | `number?` | Min value for fill widgets |
| `max` | `number?` | Max value for fill widgets |
| `gradient` | `Gradient?` | Custom color gradient |

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

## Paginated APIs

Use `fetchAllPaginatedResults` from `$lib/server/FetchUtilities`:

```typescript
import { fetchAllPaginatedResults } from '$lib/server/FetchUtilities';

async getAllItems(): Promise<Item[]> {
    return fetchAllPaginatedResults<Item>(async (cursor) => {
        let url = await this.getApiUrl('/api/items');
        if (cursor) url += `?cursor=${cursor}`;
        const response = await this.authenticatedFetch(url);
        const data = await response.json();
        return { cursor: data.nextCursor, results: data.items };
    });
}
```

## CRON History Refresh

The server-side CRON job (`src/hooks.server.ts`) calls every widget endpoint with `?addToHistory=true` on the schedule defined by `config.refreshCron` (default: `*/5 * * * *`). This populates the in-memory history store for `createWidgetEndpoint` endpoints. Pass-through history endpoints return their own history each call and do not need this.

## Reference: Chatty Integration

The `chatty` integration is a minimal, no-auth example:
- `src/routes/api/plugins/chatty/ChattyClient.ts`
- `src/routes/api/plugins/chatty/conversations/+server.ts`
- `src/routes/api/plugins/chatty/conversations/daily/+server.ts`
- `src/routes/api/plugins/chatty/proxy-requests/+server.ts`
- `src/lib/server/Config.ts` plugin registration
- `docs/Available Plugins/Chatty.md` on the docs branch