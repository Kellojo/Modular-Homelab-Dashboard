![](../images/Banner-1.png)

# Gitea Plugin

The gitea plugin allows you to monitor your Gitea repositories directly from the dashboard. It fetches data such as repository number, busy actions runners, and user heatmap data.

This requires access to the Gitea API, which can be provided by setting the the gitea url in the config.yaml file:

```yaml
plugins:
  gitea:
    url: https://your-gitea-instance.com
```

Additionally, you need to provide a PAT (Personal Access Token) with the necessary permissions to access the API. This token should be set as an environment variable `GITEA_TOKEN`:

```yaml
environment:
  - GITEA_TOKEN=${GITEA_TOKEN}
```

## Data Points

- `version` - Gitea version information
- `admin.runners.busy` - List of all busy Gitea runners
- `repos.count` - Total number of git repositories
- `users.heatmap` - Heatmap data for user contributions

## Example Configuration

```yaml
widgets:
  # Show number of busy gitea runners
  - type: datawidget
    subtype: statushistory
    title: Git Runners
    datasource: gitea
    datapoint: admin.runners.busy
    width: 1

  # Show total number of git repos
  - type: datawidget
    subtype: text
    title: Git Repos
    datasource: gitea
    datapoint: repos.count
    width: 1

  # Show total number of images
  - type: datawidget
    subtype: number
    title: Total Images
    datasource: docker
    datapoint: images.count
    width: 1
    height: 1

  # Show the user heatmap for a specific user as a barchart
  - type: datawidget
    icon: https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/gitea.png
    subtype: bar
    title: Gitea
    datasource: gitea
    datapoint: users.heatmap
    datafilters:
      username: MyGiteaUserName
    width: 2
```
