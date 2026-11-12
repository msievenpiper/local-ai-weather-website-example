# Weather App API Documentation

## Overview

This document describes the WeatherAPI.com integration used in this weather application.

## API Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEATHER_API_KEY` | Your WeatherAPI.com API key | Yes |

### Base URL

```
https://api.weatherapi.com/v1
```

## Endpoints Used

### 1. Current Weather & Forecast

**Endpoint:** `/forecast.json`

**Description:** Retrieves current weather and 7-day forecast for a location.

**Parameters:**
| Parameter | Description | Required |
|-----------|-------------|----------|
| `key` | Your API key | Yes |
| `q` | City name, coordinates (lat,long), or zip code | Yes |
| `days` | Number of forecast days (1-10) | No, default: 3 |
| `aqi` | Include air quality data (yes/no) | No, default: no |
| `alerts` | Include weather alerts (yes/no) | No, default: no |

**Example Request:**
```javascript
fetch('https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=San+Francisco&days=7&aqi=yes')
```

**Response Structure:**
```json
{
  "location": {
    "name": "San Francisco",
    "region": "California",
    "country": "USA",
    "lat": 37.77,
    "lon": -122.42,
    "tz_id": "America/Los_Angeles",
    "localtime_epoch": 1699783200,
    "localtime": "2023-11-12 10:00"
  },
  "current": {
    "last_updated_epoch": 1699783200,
    "last_updated": "2023-11-12 10:00",
    "temp_c": 15.6,
    "temp_f": 60.1,
    "is_day": 1,
    "condition": {
      "text": "Partly Cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    },
    "wind_mph": 8.1,
    "wind_kph": 13.0,
    "wind_dir": "WSW",
    "pressure_mb": 1016.0,
    "pressure_in": 30.0,
    "precip_mm": 0.0,
    "precip_in": 0.0,
    "humidity": 65,
    "cloud": 45,
    "feelslike_c": 14.8,
    "feelslike_f": 58.6,
    "vis_km": 10.0,
    "vis_miles": 6.0,
    "uv": 4.0,
    "gust_mph": 12.5,
    "gust_kph": 20.1
  },
  "forecast": {
    "forecastday": [
      {
        "date": "2023-11-12",
        "day": {
          "maxtemp_c": 18.5,
          "mintemp_c": 12.3,
          "avgtemp_c": 15.4,
          "maxwind_mph": 12.3,
          "maxwind_kph": 19.8,
          "totalprecip_mm": 0.5,
          "avgvis_km": 10.0,
          "avgvis_miles": 6.0,
          "avghumidity": 70,
          "condition": {
            "text": "Partly Cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
          },
          "uv": 4.0,
          "daily_chance_of_rain": 20
        },
        "hour": [
          {
            "time_epoch": 1699776000,
            "time": "2023-11-12 00:00",
            "temp_c": 13.5,
            "temp_f": 56.3,
            "is_day": 0,
            "condition": {
              "text": "Clear",
              "icon": "//cdn.weatherapi.com/weather/64x64/night/113.png",
              "code": 1000
            },
            "wind_mph": 6.2,
            "wind_kph": 10.0,
            "wind_dir": "WNW",
            "pressure_mb": 1016.0,
            "pressure_in": 30.0,
            "precip_mm": 0.0,
            "precip_in": 0.0,
            "humidity": 72,
            "cloud": 10,
            "feelslike_c": 12.8,
            "feelslike_f": 55.0,
            "windchill_c": 12.8,
            "windchill_f": 55.0,
            "dewpoint_c": 9.8,
            "dewpoint_f": 49.6,
            "will_rain": 0,
            "chance_of_rain": "0",
            "will_snow": 0,
            "chance_of_snow": "0"
          }
        ]
      }
    ]
  }
}
```

### 2. Search Locations

**Endpoint:** `/search.json`

**Description:** Search for cities/regions by name.

**Parameters:**
| Parameter | Description | Required |
|-----------|-------------|----------|
| `key` | Your API key | Yes |
| `q` | Search query (city name, partial names) | Yes |

**Example Request:**
```javascript
fetch('https://api.weatherapi.com/v1/search.json?key=YOUR_API_KEY&q=san')
```

**Response Structure:**
```json
[
  {
    "id": 539,
    "name": "San Francisco",
    "region": "California",
    "country": "USA",
    "lat": 37.77,
    "lon": -122.42,
    "url": "san-francisco,california,usa"
  }
]
```

## Weather Condition Codes

| Code | Description |
|------|-------------|
| 1000 | Sunny/Clear |
| 1003 | Partly Cloudy |
| 1006 | Cloudy |
| 1009 | Overcast |
| 1030 | Mist |
| 1069 | Patchy Rain Possible |
| 1072 | Light Drizzle |
| 1087 | Patchy Lightning Possible |
| 1114 | Moderate Snow |
| 1135 | Heavy Snow |
| 1147 | Sleet |
| 1168 | Light Rain |
| 1171 | Heavy Rain |
| 1189 | Light Rain Shower |
| 1192 | Moderate Rain |
| 1195 | Heavy Rain Shower |
| 1204 | Light Sleet |
| 1207 | Moderate Sleet |
| 1210 | Heavy Sleet |
| 1213 | Light Snow |
| 1216 | Moderate Snow |
| 1219 | Heavy Snow |
| 1222 | Light Snow Shower |
| 1225 | Moderate Snow Shower |
| 1237 | Hail |
| 1261 | Light Showers of Ice Pellets |
| 1264 | Moderate Ice Pellets |
| 1277 | Heavy Snow |
| 1282 | Light Snow |
| 1285 | Moderate Snow |
| 1305 | Heavy Rain |
| 1308 | Light Rain Shower |
| 1311 | Moderate Rain Shower |
| 1314 | Heavy Rain Shower |
| 1317 | Light Showers of Ice Pellets |
| 1320 | Moderate Ice Pellets |
| 1323 | Heavy Showers of Ice Pellets |
| 1326 | Light Snow Shower |
| 1329 | Moderate Snow Shower |
| 1332 | Heavy Snow Shower |
| 1335 | Light Snow |
| 1338 | Moderate Snow |
| 1341 | Heavy Snow |
| 1344 | Patchy Light Snow |
| 1347 | Moderate Snow |
| 1350 | Heavy Snow |
| 1353 | Light Rain |
| 1356 | Moderate Rain |
| 1359 | Heavy Rain |
| 1362 | Light Showers of Ice Pellets |
| 1365 | Moderate Showers of Ice Pellets |
| 1368 | Heavy Showers of Ice Pellets |
| 1371 | Light Snow Shower |
| 1374 | Moderate Snow Shower |
| 1377 | Heavy Snow Shower |
| 1382 | Light Showers of Ice Pellets |
| 1385 | Moderate Showers of Ice Pellets |
| 1388 | Heavy Showers of Ice Pellets |

## Air Quality Index (AQI)

| Index | Description |
|-------|-------------|
| 1 | Good |
| 2 | Moderate |
| 3 | Unhealthy for Sensitive Groups |
| 4 | Unhealthy |
| 5 | Very Unhealthy |
| 6 | Hazardous |

## Usage Limits

### Free Tier
- 1,000 API calls per day
- Real-time weather data
- 3-day forecast
- No HTTPS support

### Paid Tiers
- More API calls per day
- Extended forecast (up to 14 days)
- Hourly updates
- HTTPS support

## Error Handling

The API returns HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (API key not enabled for this feature)
- `404` - Not Found (location not found)
- `429` - Too Many Requests (rate limit exceeded)

## Best Practices

1. Always check for API key validity
2. Handle rate limiting gracefully
3. Cache weather data to reduce API calls
4. Use appropriate error messages for users
5. Implement retry logic with exponential backoff

## Support

For API support, visit:
- [WeatherAPI.com Documentation](https://www.weatherapi.com/docs/)
- [WeatherAPI.com Pricing](https://www.weatherapi.com/pricing.aspx)
