---
order: 7
---

![](../images/Banner-1.png)

# Using Plugins

The config.yaml file supports a `plugins` section, where you can configure various plugins to fetch data from your homelab services. Plugins allow you to securely retrieve information without exposing sensitive credentials or API keys in the frontend. The plugins section is optional; if no plugins are needed, you can omit it entirely.

Each plugin has it's own configuration options, which are required for the plugin to work correctly. Below is an example of a few commonly used plugins:

```yaml
plugins:
  gitea:
    url: https://192.168.178.100:3000
  uptimekuma:
    url: https://192.168.178.101/
  pihole:
    url: https://192.168.178.102/
```

Please refer to the individual plugin documentation for detailed configuration options and usage instructions for each plugin.

## Plugin Secrets

Secrets are required by some plugins to authenticate with the respective services. These secrets should be injected via the specified environment variables.
