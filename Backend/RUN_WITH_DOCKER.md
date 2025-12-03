# How to Run Backend with Docker

## Prerequisites

✅ **Docker Desktop must be installed and running**  
Download: https://www.docker.com/products/docker-desktop/

## Step-by-Step Guide

### 1. Build Docker Images (One-Time Setup)

Open PowerShell and navigate to the docker-images folder:

```powershell
cd F:\devFlow\Backend\docker-images
.\build-images.ps1
```

**Expected output:**
```
Building Docker images for code execution...
✓ Building Node.js image...
✓ Building Python image...
✓ Building C/C++ image...
✓ Building Java image...
All images built successfully!
```

### 2. Verify Images Are Built

```powershell
docker images | Select-String "devflow"
```

**Should show:**
```
devflow-nodejs    latest    ...    50MB
devflow-python    latest    ...    60MB
devflow-cpp       latest    ...    200MB
devflow-java      latest    ...    400MB
```

### 3. Start the Backend

```powershell
cd F:\devFlow\Backend
node index.js
```

**Expected output:**
```
Node.js server listening at http://127.0.0.1:5000
Max concurrent executions: 10
```

### 4. Test It!

- Open Frontend (http://localhost:3000)
- Write some code (JavaScript, Python, C++, or Java)
- Click Run
- Your code now executes inside a Docker container! 🎉

## What Happens When You Run Code?

```
1. User clicks "Run" in Frontend
2. Backend receives code + filename
3. Backend adds to queue (max 10 concurrent)
4. Backend creates Docker container with:
   - 256MB memory limit
   - 50% CPU limit
   - 10-second timeout
   - No network access
5. Code runs inside isolated container
6. Container auto-deletes after execution
7. Output sent back to Frontend
```

## Troubleshooting

### Error: "Docker daemon not running"
**Solution:** Start Docker Desktop application

### Error: "No such image: devflow-nodejs"
**Solution:** Run step 1 again to build images
```powershell
cd F:\devFlow\Backend\docker-images
.\build-images.ps1
```

### Error: "Cannot connect to Docker daemon"
**Solution:** Ensure Docker Desktop is fully started (whale icon steady in system tray)

### Backend won't start
**Solution:** Check if port 5000 is already in use
```powershell
netstat -ano | findstr :5000
```

## Important Notes

⚠️ **You must build images BEFORE starting the backend**  
⚠️ **Docker Desktop must be running**  
⚠️ **Images only need to be built once** (unless you modify Dockerfiles)

## Quick Commands

**Build all images:**
```powershell
cd F:\devFlow\Backend\docker-images; .\build-images.ps1
```

**Start backend:**
```powershell
cd F:\devFlow\Backend; node index.js
```

**Check running containers:**
```powershell
docker ps
```

**Clean up stopped containers:**
```powershell
docker container prune -f
```

**View Docker logs (if issues):**
```powershell
docker logs <container_id>
```

## Architecture

```
Frontend (localhost:3000)
    ↓ HTTP POST /run
Backend (localhost:5000)
    ↓ Creates Docker container
Docker Engine
    ↓ Runs isolated container
    [Node.js / Python / C++ / Java Container]
    ↓ Returns output
Backend
    ↓ Returns output
Frontend (displays result)
```

## Resource Limits (Per Container)

| Resource | Limit |
|----------|-------|
| Memory | 256MB |
| CPU | 50% of 1 core |
| Time | 10 seconds |
| Network | Disabled |
| Filesystem | Read-only |

Your system is now protected from malicious or buggy code! 🛡️
