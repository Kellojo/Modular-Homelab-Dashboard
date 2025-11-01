---
order: 2
---

![](../images/Banner-2.png)

# Widget Types

There are various widget types available to display different kinds of information on your dashboard. Each widget type displays data in a unique way.

Widgets types are indicated by the `type` field in the configuration file:

```yaml
widgets:
  - type: title
    title: My Dashboard Title

  - type: link
    title: My Awesome Link
    url: https://example.com

  - type: datawidget
    subtype: line
    title: CPU
    datasource: system
    datapoint: cpu.load
```

## Available Widget Types

The following widget types are currently available:

| Type                                     | Description                                                                                                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [title](#Configuration/Title-Widget)     | Displays a title for the dashboard or a specific section.                                                                                                         |
| [text](#Configuration/Text-Widget)       | Displays a text only widget for the dashboard or a specific section.                                                                                              |
| [link](#Configuration/Link-Widget)       | Displays a tile that is clickable and routes the user to a specific link. Requires the url parameter to be set in addition.                                       |
| [datawidget](#Configuration/Data-Widget) | Displays data that is made available from one of the plugins. The data is pulled through a backend service by specifying the datasource and datapoint properties. |
