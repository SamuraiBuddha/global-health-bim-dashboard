# --- Stage 1: Build the Cesium Terrain Server --- 
FROM golang:1.20-bullseye AS builder

# Install additional tools needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    git mercurial unzip wget && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy source code into the build context
COPY . /app

# Disable Go modules for this legacy project
ENV GO111MODULE=off

# Set up GOPATH workspace
ENV GOPATH=/app/go
RUN mkdir -p "$GOPATH/src/github.com/geo-data" && \
    ln -s /app "$GOPATH/src/github.com/geo-data/cesium-terrain-server"

WORKDIR "$GOPATH/src/github.com/geo-data/cesium-terrain-server"

# Fetch Go dependencies and build the server
RUN go get -d -v ./... && \
    go build -v -o /app/bin/cesium-terrain-server ./cmd/cesium-terrain-server

# Download Cesium.js assets
ARG CESIUM_VERSION=1.4
RUN wget -q -O /tmp/cesium.zip "https://cesium.com/downloads/CesiumJS/Cesium-${CESIUM_VERSION}.zip" && \
    unzip -q /tmp/cesium.zip -