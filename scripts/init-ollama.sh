#!/bin/bash

# Initialize Ollama with required models
# Run this after docker-compose up

echo "Waiting for Ollama to be ready..."
sleep 5

echo "Pulling llama3.2 model..."
docker exec ollama ollama pull llama3.2

echo "Pulling nomic-embed-text model for embeddings..."
docker exec ollama ollama pull nomic-embed-text

echo "Ollama models initialized successfully!"
echo "Available models:"
docker exec ollama ollama list