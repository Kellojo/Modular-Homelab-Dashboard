# Modular Homelab Dashboard
This project is a modular dashboard designed for managing and monitoring a homelab environment. It provides a customizable interface to display various metrics, system statuses, and other relevant information about your homelab.

All configured in a simple yaml file with a backend to securely fetch data from your homelab services, without exposing credentials/API keys to the frontend.

![Dashboard Screenshot](https://github.com/Kellojo/Modular-Homelab-Dashboard/blob/docs/docs/images/preview.png?raw=true)

## ✨ Features
- Modular design: Easily add or remove widgets to customize your dashboard.
- Secure backend: Fetch data securely from your homelab services without exposing sensitive information.
- YAML configuration: Simple and intuitive configuration using a YAML file.
- Responsive design: Works well on various screen sizes and devices, even your phone!
- Provides widgets for popular homelab services like Pi-hole, Docker, Gitea and many more.
- Easily extendable: integrate your own services by following the integration guide.

## 🚀 Getting Started
Docker Compose is the recommended way to run the Modular Homelab Dashboard. Make sure you have Docker and Docker Compose installed on your system.

Add the following service to your existing `docker-compose.yaml` file:

```yaml
services:
  modular-homelab-dashboard:
    image: ghcr.io/kellojo/modular-homelab-dashboard:v1.1.4
    container_name: modular-homelab-dashboard
    restart: unless-stopped
    pid: "host"
    volumes:
      - ./config.yaml:/app/dashboard.yaml:ro                    # your dashboard config
      - ./background.jpg:/app/build/client/background.jpg:ro    # optional custom background
```

Create a `config.yaml` file and mount it to `/app/dashboard.yaml` in the container:

```yaml
plugins:
  uptimekuma:
    url: http://192.168.178.100:3000

widgets:
  - type: title
    title: System Status

  - type: datawidget
    subtype: line
    title: CPU
    datasource: system
    datapoint: cpu.load

  - type: title
    title: Apps

  - type: link
    url: https://pihole.local/admin
    title: Pi-hole
    icon: https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/pi-hole.png
    width: 2
```

## 🔌 Plugins
- System Metrics
- Docker
- Pi-hole
- Uptime Kuma
- Gitea
