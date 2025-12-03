#!/bin/bash
# Build all Docker images for code execution

echo "Building Docker images for code execution..."

cd "$(dirname "$0")"

echo "Building Node.js image..."
docker build -f Dockerfile.nodejs -t devflow-nodejs:latest .

echo "Building Python image..."
docker build -f Dockerfile.python -t devflow-python:latest .

echo "Building C/C++ image..."
docker build -f Dockerfile.cpp -t devflow-cpp:latest .

echo "Building Java image..."
docker build -f Dockerfile.java -t devflow-java:latest .

echo "All images built successfully!"
docker images | grep devflow
