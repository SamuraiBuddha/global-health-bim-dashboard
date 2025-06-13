# Unreal Engine Pixel Streaming Server
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    build-essential \
    cmake \
    python3 \
    python3-pip \
    nodejs \
    npm \
    libvulkan1 \
    vulkan-utils \
    libgl1-mesa-glx \
    libglu1-mesa \
    libxcursor1 \
    libxinerama1 \
    libxrandr2 \
    libxi6 \
    x11-utils \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install Pixel Streaming signaling server dependencies
WORKDIR /opt/pixel-streaming

# Clone Epic's Pixel Streaming infrastructure
RUN git clone https://github.com/EpicGames/PixelStreamingInfrastructure.git . && \
    cd SignallingWebServer && \
    npm install

# Create directories for Unreal project
RUN mkdir -p /app/project /app/config

# Copy signaling server config
COPY signaling-config.json /opt/pixel-streaming/SignallingWebServer/config.json

# Expose ports
EXPOSE 80 443 8888 19302-19303

# Entry point script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
