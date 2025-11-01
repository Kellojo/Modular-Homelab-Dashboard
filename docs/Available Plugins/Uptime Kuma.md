![](../images/Banner-1.png)

# Uptime Kuma Plugin

The Uptime Kuma plugin allows you to monitor your Uptime Kuma instance directly from the dashboard. It fetches data such as status, response time, and other statistics.

This requires access to the Uptime Kuma API, which can be provided by setting the the Uptime Kuma url in the config.yaml file:

```yaml
plugins:
  uptimekuma:
    url: https://your-uptime-kuma-instance.com
    statuspage: "default" # Optional: specify the status page to monitor
```

The uptime kuma plugin requires setting up a status page in Uptime Kuma itself. This allows the plugin to fetch the uptime of the specific status page, without any authentication. You can find more details on how to set up a status page in the [Uptime Kuma documentation](https://github.com/louislam/uptime-kuma/wiki/Status-Page).

## Data Points

- `uptime` - Show the uptime percentage of the specified status page

## Example Configuration

```yaml
widgets:
  # Show the uptime percentage as a status history
  - type: datawidget
    subtype: statushistory
    title: Uptime
    datasource: uptimekuma
    datapoint: uptime
    width: 1
```
