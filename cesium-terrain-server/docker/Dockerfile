# --- Stage 1: Build the Cesium Terrain Server --- 
FROM golang:1.20-bullseye AS builder

# Install additional tools needed (if any)
RUN apt-get update && apt-get install -y --no-install-recommends git mercurial unzip wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy source code and build scripts into the build context
COPY . /app

# (Optional) Disable Go modules to use GOPATH mode for this legacy project
ENV GO111MODULE=off

# Set up GOPATH workspace for the project
ENV GOPATH=/app/go
RUN mkdir -p "$GOPATH/src/github.com/geo-data"

# Clone the cesium-terrain-server source
RUN git clone https://github.com/geo-data/cesium-terrain-server.git "$GOPATH/src/github.com/geo-data/cesium-terrain-server"
WORKDIR "$GOPATH/src/github.com/geo-data/cesium-terrain-server"

# Fetch Go dependencies and build the server
RUN go get -d -v ./...  && \
    go build -v -o /app/bin/cesium-terrain-server ./cmd/cesium-terrain-server

# Download Cesium.js assets (version taken from build ARG or file)
ARG CESIUM_VERSION=1.4    # adjust to desired version
RUN wget -q -O /tmp/cesium.zip "https://cesium.com/downloads/cesiumjs/releases/${CESIUM_VERSION}/Cesium-${CESIUM_VERSION}.zip" && \
    unzip -q /tmp/cesium.zip -d /app/cesium && \
    rm -f /tmp/cesium.zip

# --- Stage 2: Create the final runtime image ---
FROM ubuntu:22.04

# Set locale to UTF-8 (avoid locale issues)
ENV LANG=C.UTF-8

# Create a user (optional for security – you can run as root if preferred)
RUN useradd -m -d /home/cesium cesium

# Create necessary directories
RUN mkdir -p /data/tilesets/terrain /data/cesium && chown -R cesium /data

# Copy the compiled server binary and Cesium assets from builder
COPY --from=builder /app/bin/cesium-terrain-server /usr/local/bin/cesium-terrain-server
COPY --from=builder /app/cesium /data/cesium

# Switch to non-root user
USER cesium

# Expose the server port
EXPOSE 8000

# Set the entrypoint to the server binary
ENTRYPOINT ["/usr/local/bin/cesium-terrain-server"]

# Default command arguments
CMD ["--dir", "/data/tilesets/terrain", "--port", "8000"]
