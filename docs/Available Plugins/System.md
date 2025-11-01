![](../images/Banner-1.png)

# System Plugin

The System plugin allows you to monitor your system's performance directly from the dashboard. It fetches data such as CPU usage, memory usage, disk space, and other statistics.

If hosted via Docker, make sure to add the below to your container configuration to allow the plugin to access system metrics:

```yaml
modular-homelab-dashboard:
  image: ghcr.io/kellojo/modular-homelab-dashboard:v1.1.4
  container_name: modular-homelab-dashboard
  restart: unless-stopped
  pid: "host" # Allows access to host system metrics
  volumes:
    - ./config.yaml:/app/dashboard.yaml:ro
    - ./background.jpg:/app/build/client/background.jpg:ro
    - /volume1/some-empty-subfolder:/volume1:ro # allows access to other volumes for disk stats
    - /volume2/some-empty-subfolder:/volume2:ro # allows access to other volumes for disk stats
    - /proc/meminfo:/proc/meminfo:ro # Allows the system plugin to read memory info
    - /proc/cpuinfo:/proc/cpuinfo:ro # Allows the system plugin to read cpu info
    - /var/run/docker.sock:/var/run/docker.sock # Allows the docker plugin to read docker stats
```

## Data Points

- `cpu.currentSpeed` - Show the current CPU speed in GHz
- `cpu.load` - Show the CPU load percentage over time
- `cpu.temperature` - Show the CPU temperature in °C over time
- `memory` - Show the used memory in GB over time
- `disk` - Show the used disk space in GB over time
- `network.totalDown` - Show the total network download speed in Mbps over time
- `network.totalUp` - Show the total network upload speed in Mbps over time
- `network.traffic` - Show the total network traffic in GB over time

## Example Configuration

```yaml
widgets:

  # Show the CPU load over time
  - type: datawidget
    subtype: line
    title: CPU
    datasource: system
    datapoint: cpu.load

  # Show the CPU temperature over time
  - type: datawidget
    subtype: line
    title: Temp.
    datasource: system
    datapoint: cpu.temperature

  # Show the current RAM usage as a progress bar
  - type: datawidget
    subtype: progressbar
    title: RAM
    datasource: system
    datapoint: memory
    width: 1

  # Show the disk usage for a specific volume
  - type: datawidget
    subtype: progressbar
    title: HDD Volume
    datasource: system
    datapoint: disk
    datafilters:
      volume: '/volume1' # optional, leave empty to show total disk usage
    width: 2
```
