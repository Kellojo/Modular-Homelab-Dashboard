---
order: 1
---

![](../images/Banner-2.png)

# General Configuration

The dashboard supports a smaller set of global configuration options that can be set in the `config` section of the `config.yaml` file.

```yaml
config:
  historyLength: 100
  refreshCron: "*/5 * * * * *"
  disableSeasonalEvents: false
  background:
    url: ./background.jpg
    blur: 0.5rem
    brightness: 0.25
```

| Property                | Required | Description                                                                                                        |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `historyLength`         | No       | The number of historical data points to keep for data widgets that support history (default: 100).                 |
| `refreshCron`           | No       | The cron expression that defines how often data widgets should refresh their data (default: "_/10 _ \* \* \* \*"). |
| `disableSeasonalEvents` | No       | Disable seasonal events and decorations (default: false).                                                          |
| `background`            | No       | Configuration for the dashboard background image, including URL, blur, and brightness.                             |
| `background.url`        | No       | The URL or path to the background image.                                                                           |
| `background.blur`       | No       | The amount of blur to apply to the background image (e.g., "0.5rem").                                              |
| `background.brightness` | No       | The brightness level to apply to the background image (e.g., 0.25).                                                |
