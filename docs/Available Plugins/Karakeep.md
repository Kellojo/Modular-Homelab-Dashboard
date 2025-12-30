![](../images/Banner-1.png)

# Gotify Plugin

The Karakeep plugin allows you to monitor your Karakeep data directly from the dashboard. It fetches basic data such as bookmark, list, and tag counts.

This requires access to the Karakeep API, which can be provided by setting the the karakeep url in the config.yaml file:

```yaml
plugins:
  karakeep:
    url: https://your-karakeep-instance.com
```

Additionally, you need to provide a Karakeep API key. You can create such a token in Karakeep directly, by clicking your user avatar in the top right of Karakeep, clicking `User Settings` > `API Keys`. This token should be set as an environment variable `KARAKEEP_API_KEY `:

```yaml
environment:
  - KARAKEEP_API_KEY = Karakeep-API-Key
```

## Data Points

- `summary` - Shows a summary of karakeep data
- `bookmarks.count` - Total number of karakeep bookmarks
- `lists.count` - Total number of karakeep lists
- `tags.count` - History of new karakeep tags

## Example Configuration

```yaml
widgets:
  - type: datawidget
    subtype: text
    title: Karakeep
    datasource: karakeep
    datapoint: summary

  - type: datawidget
    subtype: bar # other types would also work
    title: Karakeep Bookmarks
    datasource: karakeep
    datapoint: bookmarks.count

  - type: datawidget
    subtype: bar # other types would also work
    title: Karakeep Lists
    datasource: karakeep
    datapoint: lists.count

  - type: datawidget
    subtype: bar # other types would also work
    title: Karakeep Tags
    datasource: karakeep
    datapoint: tags.count
```
