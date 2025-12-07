![](../images/Banner-1.png)

# Home Assistant Plugin

The Home Assistant plugin allows you to monitor your Home Assistant entities directly from the dashboard. It fetches basic data such as entity state.

This requires access to the Home Assistant API, which can be provided by setting the the home assistant url in the config.yaml file:

```yaml
plugins:
  homeassistant:
    url: https://your-home-assistant-instance.com
```

Additionally, you need to provide a Home Assistant token to access the API. You can create such a token in Home Assistant directly, by navigating to `User Avatar` > `Configuration` > `Users` > `Your User` > `Long-Lived Access Tokens`. This token should be set as an environment variable `HOME_ASSISTANT_TOKEN `:

```yaml
environment:
  - HOME_ASSISTANT_TOKEN = Home Assistant-Long-Lived-Access-Token
```

## Data Points

- `summary` - Return a summary of the Home Assistant instance, including number of devices and entities
- `state` - Return the current state of an entity

## Example Configuration

```yaml
widgets:
  # Show number of devices and entities in Home Assistant
  - type: datawidget
    subtype: text
    title: Home Assistant
    datasource: homeassistant
    datapoint: summary

  # Show current TV power consumption
  - type: datawidget
    subtype: bar
    title: TV Power Consumption
    datasource: homeassistant
    datapoint: state
    datafilters:
      entity_id: sensor.tv_power_consumption # Home Assistant entity ID (required)
    width: 2

    # Show current TV state
  - type: datawidget
    subtype: bar
    title: Staubsauger Steckdose
    datasource: homeassistant
    datapoint: state
    datafilters:
      entity_id: binary_sensor.tv_power_state # Home Assistant entity ID (required)
    width: 2
```
