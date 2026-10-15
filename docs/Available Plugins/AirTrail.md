![](../images/Banner-1.png)

# AirTrail Plugin

The AirTrail plugin lets you monitor your flight log directly from the dashboard. It uses the AirTrail v1 API to show the number of flights, total distance travelled and total time in the air, each broken down for the current year and all time.

This requires access to the AirTrail API, which can be provided by setting the AirTrail URL in the config.yaml file:

```yaml
plugins:
  airtrail:
    url: https://your-airtrail-instance.com
```

Additionally, you need to provide an AirTrail API key. You can create one under `Settings` > `Security` > `API Keys` (select the `stats.read` and `flight.read.own` scopes). This key should be set as an environment variable `AIRTRAIL_TOKEN`:

```yaml
environment:
  - AIRTRAIL_TOKEN=${AIRTRAIL_TOKEN}
```

## Data Points

- `flights.count` - Number of flights in the current year (all time shown in the tooltip and subtitle)
- `distance` - Kilometres travelled in the current year (all time shown in the tooltip and subtitle)
- `duration` - Time in the air for the current year (all time shown in the tooltip and subtitle)

> **Note:** AirTrail does not expose per-flight distance in its API. The `distance` data point derives the current-year distance from the average distance per flight returned by the statistics endpoint, so it may differ slightly from the true figure.

## Example Configuration

```yaml
widgets:
  - type: title
    title: AirTrail

  # Number of flights this year (all time in the tooltip)
  - type: datawidget
    subtype: fill
    title: Flights
    datasource: airtrail
    datapoint: flights.count
    width: 1

  # Kilometres travelled this year (all time in the tooltip)
  - type: datawidget
    subtype: fill
    title: Distance
    datasource: airtrail
    datapoint: distance
    width: 1

  # Time in the air this year (all time in the tooltip)
  - type: datawidget
    subtype: fill
    title: Duration
    datasource: airtrail
    datapoint: duration
    width: 1
```