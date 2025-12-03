# Build all Docker images for code execution
Write-Host "Building Docker images for code execution..." -ForegroundColor Green

Set-Location $PSScriptRoot

Write-Host "`nBuilding Node.js image..." -ForegroundColor Cyan
docker build -f Dockerfile.nodejs -t devflow-nodejs:latest .

Write-Host "`nBuilding Python image..." -ForegroundColor Cyan
docker build -f Dockerfile.python -t devflow-python:latest .

Write-Host "`nBuilding C/C++ image..." -ForegroundColor Cyan
docker build -f Dockerfile.cpp -t devflow-cpp:latest .

Write-Host "`nBuilding Java image..." -ForegroundColor Cyan
docker build -f Dockerfile.java -t devflow-java:latest .

Write-Host "`nAll images built successfully!" -ForegroundColor Green
docker images | Select-String "devflow"
