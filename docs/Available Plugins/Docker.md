![](../images/Banner-1.png)

# Docker Plugin

The docker plugin allows you to monitor your Docker containers and images directly from the dashboard. It fetches data such as container status, resource usage, and image information using the Docker API.

This requires access to the Docker socket, which can be provided by mounting the Docker socket file into the dashboard container:

```yaml
mounts:
  - /var/run/docker.sock:/var/run/docker.sock
```

## Data Points

- `containers` - List of all Docker containers with their details
- `containers.count` - Total number of containers

- `images` - List of all Docker images with their details
- `images.count` - Total number of images
- `images.size` - Total size of all images

## Example Configuration

```yaml
widgets:
  # List all containers with their status
  - type: datawidget
    subtype: list
    title: Containers
    datasource: docker
    datapoint: containers
    width: 2
    height: 3

  # List all images and their sizes
  - type: datawidget
    subtype: list
    title: Docker Images
    datasource: docker
    datapoint: images
    width: 2
    height: 2

  # Show total number of images
  - type: datawidget
    subtype: number
    title: Total Images
    datasource: docker
    datapoint: images.count
    width: 1
    height: 1
```
