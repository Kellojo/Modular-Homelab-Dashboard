---
order: 5
---

![Link Widget](../images/widgets/link.png)

# Link Widget

Displays a tile that is clickable and routes the user to a specific link. Requires the `url` parameter to be set in addition.

## Configuration Options

| Property      | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | Yes      | The title to display                             |
| `url`         | No       | The URL to navigate to when the tile is clicked. |
| `subtitle`    | No       | The subtitle to display                          |
| `width`       | No       | The width of the tile (e.g., 1, 2).              |
| `height`      | No       | The height of the tile (e.g., 1, 2).             |
| `icon`        | No       | The icon to display in the tile.                 |
| `iconify`     | No       | The Iconify icon to display in the tile.         |
| `iconRounded` | No       | Show the icon with rounded corners.              |

## Configuration Example

```yaml
widgets:
  - type: link
    title: My Dashboard Title
    url: https://example.com
    subtitle: Click to visit example.com
    width: 2
```
