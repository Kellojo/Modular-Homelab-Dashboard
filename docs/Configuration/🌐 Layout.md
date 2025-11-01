---
order: 1
---

![](../images/Banner-2.png)

# Layout

The dashboard uses a CSS grid layout to arrange widgets in a flexible and responsive way. The grid by default has 8 columns, which can be occupied by widgets of varying widths. Each widget can specify its width and height in terms of grid units.

The layout is defined in the `config.yaml` file under the `widgets` section. Each widget can have the following layout properties:

```yaml
widgets:
  - type: link
    title: My Awesome Link
    url: https://example.com
    width: 2 # width in grid units (optional)
    height: 2 # height in grid units (optional)
```

The order of widgets in the configuration file determines their placement on the grid. Widgets are placed from left to right, top to bottom, filling available space based on their specified widths and heights.

The only exception are title widgets, which always take the full width of the dashboard:

```yaml
widgets:
  - type: title
    title: My Dashboard Title

  - type: link
    title: My Awesome Link
    url: https://example.com
```

## Responsive Design

The dashboard layout is responsive and adapts to different screen sizes. On smaller screens, such as on phones, the number of columns may be reduced, jumping to 6, 4 and 2 columns.
