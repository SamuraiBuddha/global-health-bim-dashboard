#!/bin/sh
# Entrypoint script for Cesium viewer nginx container

# Replace the token placeholder with the actual token from environment
if [ -n "$CESIUM_ION_TOKEN" ]; then
    echo "Injecting Cesium Ion token..."
    sed -i "s/YOUR_CESIUM_ION_ACCESS_TOKEN/$CESIUM_ION_TOKEN/g" /usr/share/nginx/html/index.html
else
    echo "WARNING: CESIUM_ION_TOKEN not set!"
fi

# Start nginx
exec nginx -g 'daemon off;'
