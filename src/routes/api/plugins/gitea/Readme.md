# Gitea Plugin

This plugin integrates Gitea, a self-hosted Git service, into the Homelab Dashboard. It provides various widgets to monitor your Gitea instance right from the dashboard.

## Plugin Configuration

To configure the Gitea plugin, add the following section to your `dashboard.yaml` configuration file:

```yaml
plugins:
  gitea:
    url: https://your-gitea-instance.com
```

Additionally, you need to set up an API token for authentication. You can generate a personal access token in your Gitea user settings. Make sure to only grant read access to the necessary scopes (listed below).
The token should be made available to the Homelab Dashboard application via the environment variable `GITEA_TOKEN`.

## Datapoints

- `repos/count`: Displays the total number of repositories in your Gitea instance (scope: repo).
- `admin/runners`: Shows the total number of GitHub Actions runners registered in your Gitea instance (scope: admin).
