// Unreal Engine Pixel Streaming Integration for Cesium Viewer
// This module handles the connection between Cesium and Unreal Engine for high-quality BIM visualization

class UnrealStreamingIntegration {
    constructor(cesiumViewer, config = {}) {
        this.viewer = cesiumViewer;
        this.config = {
            streamUrl: config.streamUrl || 'http://localhost:8090',
            webSocketUrl: config.webSocketUrl || 'ws://localhost:8888',
            autoConnect: config.autoConnect || false,
            ...config
        };
        
        this.streamContainer = null;
        this.streamConnection = null;
        this.isStreaming = false;
        
        this.initializeUI();
        if (this.config.autoConnect) {
            this.connect();
        }
    }
    
    initializeUI() {
        // Create overlay container for Unreal stream
        this.streamContainer = document.createElement('div');
        this.streamContainer.id = 'unreal-stream-container';
        this.streamContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.9);
        `;
        
        // Create iframe for pixel streaming
        const iframe = document.createElement('iframe');
        iframe.id = 'unreal-stream-iframe';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        this.streamContainer.appendChild(iframe);
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕ Close Unreal View';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            z-index: 1001;
        `;
        closeBtn.onclick = () => this.hideStream();
        this.streamContainer.appendChild(closeBtn);
        
        // Add PIP (Picture-in-Picture) toggle
        const pipBtn = document.createElement('button');
        pipBtn.innerHTML = '⧉ PIP Mode';
        pipBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 180px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            z-index: 1001;
        `;
        pipBtn.onclick = () => this.togglePIPMode();
        this.streamContainer.appendChild(pipBtn);
        
        document.body.appendChild(this.streamContainer);
    }
    
    async connect() {
        try {
            // Establish WebSocket connection for signaling
            this.streamConnection = new WebSocket(this.config.webSocketUrl);
            
            this.streamConnection.onopen = () => {
                console.log('Connected to Unreal Engine pixel streaming');
                this.isStreaming = true;
            };
            
            this.streamConnection.onmessage = (event) => {
                this.handleStreamMessage(event.data);
            };
            
            this.streamConnection.onerror = (error) => {
                console.error('Unreal streaming error:', error);
            };
            
            this.streamConnection.onclose = () => {
                console.log('Unreal streaming connection closed');
                this.isStreaming = false;
            };
            
        } catch (error) {
            console.error('Failed to connect to Unreal Engine:', error);
        }
    }
    
    handleStreamMessage(data) {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'ready':
                    console.log('Unreal Engine ready for streaming');
                    break;
                case 'viewport':
                    // Handle viewport synchronization
                    this.syncViewport(message.data);
                    break;
                case 'selection':
                    // Handle object selection sync
                    this.syncSelection(message.data);
                    break;
            }
        } catch (error) {
            console.error('Error handling stream message:', error);
        }
    }
    
    showStream(options = {}) {
        const iframe = document.getElementById('unreal-stream-iframe');
        
        // Build URL with parameters
        const params = new URLSearchParams({
            cesium: true,
            quality: options.quality || 'ultra',
            fps: options.fps || 60,
            ...options
        });
        
        iframe.src = `${this.config.streamUrl}?${params}`;
        this.streamContainer.style.display = 'block';
        
        // Send current Cesium camera to Unreal
        if (this.isStreaming) {
            this.syncCameraToUnreal();
        }
    }
    
    hideStream() {
        this.streamContainer.style.display = 'none';
        const iframe = document.getElementById('unreal-stream-iframe');
        iframe.src = '';
    }
    
    togglePIPMode() {
        const container = this.streamContainer;
        
        if (container.classList.contains('pip-mode')) {
            // Exit PIP mode
            container.classList.remove('pip-mode');
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                z-index: 1000;
                background: rgba(0, 0, 0, 0.9);
            `;
        } else {
            // Enter PIP mode
            container.classList.add('pip-mode');
            container.style.cssText = `
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 400px;
                height: 300px;
                display: block;
                z-index: 1000;
                background: black;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                overflow: hidden;
            `;
        }
    }
    
    // Sync Cesium camera to Unreal
    syncCameraToUnreal() {
        if (!this.isStreaming || !this.streamConnection) return;
        
        const camera = this.viewer.camera;
        const cartographic = Cesium.Cartographic.fromCartesian(camera.position);
        
        const cameraData = {
            type: 'camera_sync',
            data: {
                longitude: Cesium.Math.toDegrees(cartographic.longitude),
                latitude: Cesium.Math.toDegrees(cartographic.latitude),
                height: cartographic.height,
                heading: Cesium.Math.toDegrees(camera.heading),
                pitch: Cesium.Math.toDegrees(camera.pitch),
                roll: Cesium.Math.toDegrees(camera.roll)
            }
        };
        
        this.sendToUnreal(cameraData);
    }
    
    // Send data to Unreal Engine
    sendToUnreal(data) {
        if (this.streamConnection && this.streamConnection.readyState === WebSocket.OPEN) {
            this.streamConnection.send(JSON.stringify(data));
        }
    }
    
    // Load a specific BIM model in Unreal
    loadBIMModel(modelPath, options = {}) {
        this.showStream();
        
        const command = {
            type: 'load_model',
            data: {
                path: modelPath,
                datasmith: options.datasmith || false,
                georeferenced: options.georeferenced || true,
                position: options.position || null,
                ...options
            }
        };
        
        this.sendToUnreal(command);
    }
    
    // Focus on a specific Revit element
    focusOnRevitElement(guid) {
        const command = {
            type: 'focus_element',
            data: {
                guid: guid,
                cinematicMode: true,
                duration: 2.0
            }
        };
        
        this.sendToUnreal(command);
    }
    
    // Apply visual effects for health data
    applyHealthVisualization(type, data) {
        const command = {
            type: 'health_visualization',
            data: {
                visualizationType: type,
                parameters: data
            }
        };
        
        this.sendToUnreal(command);
    }
    
    // Example visualization effects
    visualizeHospitalCapacity(occupancyData) {
        this.applyHealthVisualization('hospital_capacity', {
            occupancy: occupancyData,
            colorGradient: ['#00ff00', '#ffff00', '#ff0000'],
            showPatientFlow: true,
            particleIntensity: occupancyData.critical
        });
    }
    
    visualizeDiseaseSpread(spreadData) {
        this.applyHealthVisualization('disease_spread', {
            infectionRate: spreadData.rate,
            hotspots: spreadData.locations,
            particleSystem: 'virus_spread',
            heatmapOpacity: 0.7
        });
    }
    
    visualizeSeismicRisk(seismicData) {
        this.applyHealthVisualization('seismic_risk', {
            magnitude: seismicData.magnitude,
            epicenter: seismicData.location,
            waveAnimation: true,
            buildingStress: true
        });
    }
}

// Integration with Cesium viewer
function integrateUnrealWithCesium(viewer) {
    // Create Unreal streaming integration
    const unrealStream = new UnrealStreamingIntegration(viewer, {
        streamUrl: window.REACT_APP_UNREAL_STREAM_URL || 'http://localhost:8090',
        autoConnect: true
    });
    
    // Add handler for entity selection
    viewer.selectedEntityChanged.addEventListener(function() {
        const entity = viewer.selectedEntity;
        if (!entity) return;
        
        // Check if entity has BIM properties
        if (entity.properties && entity.properties.hasValue('revitGuid')) {
            const guid = entity.properties.revitGuid.getValue();
            
            // Show option to view in Unreal
            if (confirm('View this building in high-quality Unreal Engine?')) {
                unrealStream.showStream();
                unrealStream.focusOnRevitElement(guid);
            }
        }
        
        // Check for health data visualization needs
        if (entity.properties && entity.properties.hasValue('healthData')) {
            const healthData = entity.properties.healthData.getValue();
            
            if (healthData.type === 'hospital') {
                unrealStream.visualizeHospitalCapacity(healthData.occupancy);
            } else if (healthData.type === 'outbreak') {
                unrealStream.visualizeDiseaseSpread(healthData.spread);
            }
        }
    });
    
    // Sync camera movement (throttled)
    let cameraTimeout;
    viewer.camera.changed.addEventListener(() => {
        clearTimeout(cameraTimeout);
        cameraTimeout = setTimeout(() => {
            unrealStream.syncCameraToUnreal();
        }, 100);
    });
    
    return unrealStream;
}

// Export for use
export { UnrealStreamingIntegration, integrateUnrealWithCesium };
