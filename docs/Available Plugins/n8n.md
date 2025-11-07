![](../images/Banner-1.png)

# n8n Plugin

The n8n plugin allows you to monitor your n8n workflows directly from the dashboard. It fetches basic data such as workflow execution count.

This requires access to the n8n API, which can be provided by setting the the n8n url in the config.yaml file:

```yaml
plugins:
  n8n:
    url: https://your-n8n-instance.com
```

Additionally, you need to provide a n8n API key to access the API. You can create such a key in n8n directly, by navigating to `Settings` and clicking `n8n API`. This key should be set as an environment variable `N8N_API_KEY`:

```yaml
environment:
  - N8N_API_KEY = n8n-API-Key
```

## Data Points

- `executions` - Overview over n8n workflow executions, grouped by day

## Example Configuration

```yaml
widgets:
  # Show number of n8n workflow executions
  - type: datawidget
    subtype: bar
    title: Workflow Executions
    datasource: n8n
    datapoint: executions
    width: 1
```
