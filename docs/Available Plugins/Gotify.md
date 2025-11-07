![](../images/Banner-1.png)

# Gotify Plugin

The Gotify plugin allows you to monitor your Gotify notifications directly from the dashboard. It fetches basic data such as notification count.

This requires access to the Gotify API, which can be provided by setting the the gotify url in the config.yaml file:

```yaml
plugins:
  gotify:
    url: https://your-gotify-instance.com
```

Additionally, you need to provide a Gotify Client token to access the API. You can create such a token in Gotify directly, by navigating to `Clients` and clicking `Create Client`. This token should be set as an environment variable `GOTIFY_CLIENT_TOKEN `:

```yaml
environment:
  - GOTIFY_CLIENT_TOKEN = Gotify-Client-Token
```

## Data Points

- `applications.count` - Total number of gotify applications
- `clients.count` - Total number of gotify clients
- `messages.count` - Total number of gotify messages
- `messages.new` - History of new gotify messages

## Example Configuration

```yaml
widgets:
  # Show number of gotify applications
  - type: datawidget
    subtype: statushistory
    title: Gotify Applications
    datasource: gotify
    datapoint: applications.count
    width: 1

  # Show total number of gotify clients
  - type: datawidget
    subtype: text
    title: Gotify Clients
    datasource: gotify
    datapoint: clients.count
    width: 1

  # Show total number of gotify messages
  - type: datawidget
    subtype: number
    title: Total Messages
    datasource: gotify
    datapoint: messages.count
```
