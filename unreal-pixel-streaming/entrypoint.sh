#!/bin/bash

# Start Xvfb for headless rendering
Xvfb :99 -screen 0 1920x1080x24 &
export DISPLAY=:99

# Start the signaling server
cd /opt/pixel-streaming/SignallingWebServer
node cirrus.js &

# Start STUN/TURN server for WebRTC
turnserver -v -L 0.0.0.0 -a -u pixelstream:pixelstream -r pixelstream &

# If an Unreal project is mounted, run it
if [ -f "/app/project/GlobalHealthBIM.sh" ]; then
    cd /app/project
    ./GlobalHealthBIM.sh -RenderOffScreen -Windowed -ResX=1920 -ResY=1080 \
        -PixelStreamingIP=0.0.0.0 -PixelStreamingPort=8888 \
        -AllowPixelStreamingCommands \
        -PixelStreamingWebRTCFps=60
else
    echo "No Unreal project found. Please mount your packaged project to /app/project"
    # Keep container running for debugging
    tail -f /dev/null
fi
