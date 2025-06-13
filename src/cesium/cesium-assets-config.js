// Cesium Ion Assets Configuration
// Based on your Cesium Ion account assets

// Your Cesium Ion Access Token (replace with your actual token)
Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_ACCESS_TOKEN';

// Asset IDs from your Cesium Ion account
const CESIUM_ASSETS = {
  cesiumMoonTerrain: 2684829,
  cesiumOSMBuildings: 2521176,
  cesiumWorldBathymetry: 2426648,
  googlePhotorealistic3DTiles: 2275207,
  cesiumOSMBuildingsAlternate: 96188,
  sentinel2: 3954,
  earthAtNight: 3812,
  bingMapsRoad: 4,
  bingMapsAerialWithLabels: 3,
  bingMapsAerial: 2,
  cesiumWorldTerrain: 1
};

// Initialize Cesium Viewer with your assets
const viewer = new Cesium.Viewer('cesiumContainer', {
  // Use Cesium World Terrain
  terrainProvider: Cesium.createWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true
  }),
  
  // Start with Bing Maps Aerial imagery
  imageryProvider: new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.bingMapsAerial }),
  
  // Enable shadows and atmosphere
  shadows: true,
  atmosphereEnabled: true,
  fog: true
});

// Function to add Cesium OSM Buildings
function addOSMBuildings() {
  viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(CESIUM_ASSETS.cesiumOSMBuildings),
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true
    })
  );
}

// Function to add Google Photorealistic 3D Tiles
function addGooglePhotorealistic3DTiles() {
  const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(CESIUM_ASSETS.googlePhotorealistic3DTiles),
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 0.00278,
      dynamicScreenSpaceErrorFactor: 4.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25
    })
  );
  
  // Hide the tileset until it's loaded
  tileset.show = false;
  
  tileset.readyPromise.then(() => {
    tileset.show = true;
    viewer.zoomTo(tileset);
  });
}

// Function to add Sentinel-2 Imagery
function addSentinel2Imagery() {
  const sentinel2 = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.sentinel2 })
  );
  sentinel2.alpha = 0.5; // Semi-transparent overlay
}

// Function to add Earth at Night Imagery
function addEarthAtNightImagery() {
  const earthAtNight = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.earthAtNight })
  );
  earthAtNight.dayAlpha = 0.0; // Only visible at night
  earthAtNight.nightAlpha = 1.0;
}

// Function to switch terrain providers
function switchTerrain(terrainType) {
  switch(terrainType) {
    case 'world':
      viewer.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      });
      break;
    case 'bathymetry':
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(CESIUM_ASSETS.cesiumWorldBathymetry),
        requestWaterMask: true,
        requestVertexNormals: true
      });
      break;
    case 'moon':
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(CESIUM_ASSETS.cesiumMoonTerrain),
        requestVertexNormals: true
      });
      break;
    case 'ellipsoid':
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      break;
  }
}

// Function to switch base imagery layers
function switchBaseImagery(imageryType) {
  // Remove all imagery layers
  viewer.imageryLayers.removeAll();
  
  switch(imageryType) {
    case 'bingAerial':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.bingMapsAerial })
      );
      break;
    case 'bingAerialWithLabels':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.bingMapsAerialWithLabels })
      );
      break;
    case 'bingRoad':
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: CESIUM_ASSETS.bingMapsRoad })
      );
      break;
  }
}

// Layer control configuration
const layerControls = {
  terrainOptions: [
    { name: 'Cesium World Terrain', value: 'world' },
    { name: 'World Bathymetry', value: 'bathymetry' },
    { name: 'Moon Terrain', value: 'moon' },
    { name: 'Flat (Ellipsoid)', value: 'ellipsoid' }
  ],
  
  imageryOptions: [
    { name: 'Bing Aerial', value: 'bingAerial' },
    { name: 'Bing Aerial with Labels', value: 'bingAerialWithLabels' },
    { name: 'Bing Roads', value: 'bingRoad' }
  ],
  
  overlayOptions: [
    { name: 'Sentinel-2', value: 'sentinel2', function: addSentinel2Imagery },
    { name: 'Earth at Night', value: 'earthAtNight', function: addEarthAtNightImagery }
  ],
  
  buildingOptions: [
    { name: 'OSM Buildings', value: 'osmBuildings', function: addOSMBuildings },
    { name: 'Google Photorealistic 3D', value: 'googlePhotorealistic', function: addGooglePhotorealistic3DTiles }
  ]
};

// Export for use in other modules
export { 
  viewer, 
  CESIUM_ASSETS, 
  switchTerrain, 
  switchBaseImagery,
  addOSMBuildings,
  addGooglePhotorealistic3DTiles,
  addSentinel2Imagery,
  addEarthAtNightImagery,
  layerControls
};