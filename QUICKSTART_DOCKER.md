# Quick Start Guide - Docker Setup

## ⚠️ Prerequisites

**Docker Desktop must be running!**

Download from: https://www.docker.com/products/docker-desktop/

## Step-by-Step Setup

### 1. Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully start (whale icon in system tray should be steady)

### 2. Build Docker Images
```powershell
cd F:\devFlow\Backend\docker-images
.\build-images.ps1
```

Expected output:
```
Building Docker images for code execution...
✓ Building Node.js image...
✓ Building Python image...
✓ Building C/C++ image...
✓ Building Java image...
All images built successfully!
```

### 3. Verify Images
```powershell
docker images | Select-String "devflow"
```

Should show:
```
devflow-nodejs    latest
devflow-python    latest
devflow-cpp       latest
devflow-java      latest
```

### 4. Start Backend
```powershell
cd F:\devFlow\Backend
node index.js
```

Expected output:
```
Node.js server listening at http://127.0.0.1:5000
Max concurrent executions: 10
```

## Test It Out

Try running code from the frontend. Each execution will:
1. Create an isolated Docker container
2. Run with 256MB memory limit
3. Run with 50% CPU limit
4. Auto-terminate after 10 seconds
5. Auto-remove container

## Common Issues

### "Docker daemon not running"
→ Start Docker Desktop application

### "Permission denied"
→ Run PowerShell as Administrator (one-time setup)

### "Image not found"
→ Run `.\build-images.ps1` again

## What Changed?

| Before | After |
|--------|-------|
| Code runs directly on system | Code runs in Docker container |
| No resource limits | 256MB memory, 50% CPU, 10s timeout |
| Max 4 concurrent (crash risk) | Max 10 concurrent (safe) |
| System crashes possible | System always stable |
| 8GB RAM vulnerable | Protected resources |

## Benefits

✅ **Isolation**: Each execution is completely isolated  
✅ **Security**: No network access, read-only filesystem  
✅ **Stability**: System never crashes from user code  
✅ **Fairness**: All users get equal resources  
✅ **Scalability**: Can handle 10x more concurrent users  
