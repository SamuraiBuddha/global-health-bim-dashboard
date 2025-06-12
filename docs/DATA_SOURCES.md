# Data Sources Documentation

## Overview

The Global Health BIM Dashboard integrates data from multiple authoritative sources to provide comprehensive monitoring of global challenges.

## Environmental Data

### Climate & Weather

**NOAA (National Oceanic and Atmospheric Administration)**
- Real-time weather data
- Climate projections
- Extreme weather events
- API: https://www.ncdc.noaa.gov/cdo-web/webservices/v2

**NASA Earthdata**
- Satellite imagery
- Environmental monitoring
- API: https://earthdata.nasa.gov/

### Sea Level & Ocean Data

**NOAA Tides and Currents**
- Real-time water levels
- Tide predictions
- API: https://tidesandcurrents.noaa.gov/api/

## Geological Hazards

### Seismic Activity

**USGS Earthquake Hazards Program**
- Real-time earthquake data
- Historical seismic records
- API: https://earthquake.usgs.gov/fdsnws/event/1/

### Volcanic Activity

**Smithsonian Global Volcanism Program**
- Active volcano monitoring
- Eruption alerts
- API: https://volcano.si.edu/

## Human Crisis Data

### Conflict & Security

**ACLED (Armed Conflict Location & Event Data)**
- Real-time conflict tracking
- Political violence data
- API: https://acleddata.com/acleddatanew/

### Health Data

**WHO Global Health Observatory**
- Disease outbreaks
- Health statistics
- API: https://www.who.int/data/gho/

**CDC Data**
- US health statistics
- Disease surveillance
- API: https://data.cdc.gov/

### Humanitarian Crisis

**UNHCR (UN Refugee Agency)**
- Refugee movements
- Displacement data
- API: https://www.unhcr.org/refugee-statistics/

**FAO (Food and Agriculture Organization)**
- Food security indices
- Agricultural data
- API: https://www.fao.org/faostat/

## Economic Indicators

**World Bank Open Data**
- Economic indicators
- Development metrics
- API: https://data.worldbank.org/

**IMF Data**
- Financial statistics
- Economic forecasts
- API: https://www.imf.org/external/datamapper/

## Infrastructure Data

**OpenStreetMap**
- Global infrastructure mapping
- Building footprints
- API: https://www.openstreetmap.org/api/

**Local Government APIs**
- Building permits
- Zoning data
- Infrastructure plans

## Data Integration Patterns

### Real-time Streaming
```python
# Example: USGS Earthquake Stream
import asyncio
import aiohttp
import json

async def stream_earthquakes():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    async with aiohttp.ClientSession() as session:
        while True:
            async with session.get(url) as response:
                data = await response.json()
                for feature in data['features']:
                    yield feature
            await asyncio.sleep(60)  # Poll every minute
```

### Batch Processing
```python
# Example: WHO Data Import
import pandas as pd
import requests

def import_who_data():
    indicators = ['WHOSIS_000001', 'WHOSIS_000002']  # Health indicators
    base_url = "https://ghoapi.azureedge.net/api/"
    
    for indicator in indicators:
        response = requests.get(f"{base_url}{indicator}")
        data = response.json()
        # Process and store data
```

## Data Quality & Validation

### Validation Rules
- Timestamp verification
- Coordinate boundary checks
- Data type validation
- Cross-source verification

### Update Frequencies
- Real-time: Earthquakes, weather (< 5 min)
- Hourly: Conflict data, health alerts
- Daily: Economic indicators, satellite imagery
- Monthly: Climate projections, infrastructure updates