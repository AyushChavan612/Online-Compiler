# DevFlow Docker Setup

## Overview

DevFlow now executes all user code inside isolated Docker containers with strict resource limits for security and stability.

## Features

✅ **Isolated Execution**: Each code submission runs in a separate Docker container  
✅ **Resource Limits**: 256MB memory, 50% CPU, 10-second timeout per execution  
✅ **No Network Access**: Containers have no internet connectivity  
✅ **Auto Cleanup**: Containers are automatically removed after execution  
✅ **Queue Management**: Max 10 concurrent containers, unlimited queue size  

## Setup Instructions

### 1. Build Docker Images

Before starting the backend, build all language runtime images:

**Windows (PowerShell):**
```powershell
cd Backend\docker-images
.\build-images.ps1
```

**Linux/Mac:**
```bash
cd Backend/docker-images
chmod +x build-images.sh
./build-images.sh
```

This creates 4 lightweight images:
- `devflow-nodejs:latest` - Node.js 20 Alpine (~50MB)
- `devflow-python:latest` - Python 3.11 Alpine (~60MB)
- `devflow-cpp:latest` - GCC 13 Alpine (~200MB)
- `devflow-java:latest` - OpenJDK 21 Slim (~400MB)

### 2. Start Backend

```bash
cd Backend
npm install
node index.js
```

### 3. Verify Docker Images

```bash
docker images | grep devflow
```

You should see all 4 images listed.

## Resource Limits

Each container is limited to:

| Resource | Limit | Description |
|----------|-------|-------------|
| **Memory** | 256MB | Hard limit, container killed if exceeded |
| **CPU** | 50% of 1 core | Prevents CPU hogging |
| **Time** | 10 seconds | Execution timeout |
| **Network** | None | No internet access |
| **Disk** | Read-only | Code directory mounted read-only |

## Queue System

- **Concurrent Limit**: 10 containers running simultaneously
- **Queue Size**: Unlimited (was 200, now removed since Docker provides isolation)
- **Wait Time**: Automatic queuing when limit reached
- **Rate Limit**: 20 requests/minute per IP

## How It Works

### Before (Direct Execution)
```
User Code → exec() → System Process → System Resources
❌ No isolation
❌ No resource limits
❌ Crash risk with many users
```

### After (Docker Execution)
```
User Code → Docker Container → Isolated Environment → Controlled Resources
✅ Full isolation
✅ Strict resource limits
✅ System stays stable
```

### Execution Flow

1. User submits code → Added to queue
2. Queue processes → Creates Docker container
3. Container runs with limits:
   - 256MB memory max
   - 50% of one CPU core
   - 10-second timeout
   - No network access
4. Container auto-removes after completion
5. Next queued request processes

## Security Features

### Container Isolation
- Non-root user execution
- Read-only file system
- No network access
- Auto-removal after execution

### Resource Protection
- Memory limit prevents RAM exhaustion
- CPU limit prevents system lockup
- Timeout prevents infinite loops
- Queue prevents overload

## Troubleshooting

### Docker Images Not Found
```bash
# Rebuild images
cd Backend/docker-images
./build-images.ps1  # Windows
./build-images.sh   # Linux/Mac
```

### Permission Denied (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

### Container Cleanup
```bash
# Remove all stopped containers
docker container prune -f

# Remove DevFlow images
docker rmi devflow-nodejs devflow-python devflow-cpp devflow-java
```

## Performance Comparison

| Metric | Before (exec) | After (Docker) |
|--------|---------------|----------------|
| Isolation | ❌ None | ✅ Full |
| Memory Limit | ❌ None | ✅ 256MB |
| CPU Limit | ❌ None | ✅ 50% |
| Timeout | ✅ 10s | ✅ 10s |
| Concurrent Limit | 4 (crash risk) | 10 (safe) |
| System Crash Risk | ⚠️ High | ✅ None |

## Development

### Modify Resource Limits

Edit `Backend/index.js`:

```javascript
const DOCKER_MEMORY_LIMIT = 256 * 1024 * 1024; // 256MB
const DOCKER_CPU_QUOTA = 50000; // 50% CPU
const DOCKER_TIMEOUT_MS = 10000; // 10 seconds
const MAX_CONCURRENT_EXECUTIONS = 10; // Concurrent containers
```

### Add New Language

1. Create `Dockerfile.<language>` in `Backend/docker-images/`
2. Add to `build-images.ps1` and `build-images.sh`
3. Add case in `executeCode()` function in `Backend/index.js`

## Docker Compose (Full Stack)

To run the entire DevFlow stack with Docker Compose:

```bash
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- RAG Service: http://localhost:8080
- Optimizer: http://localhost:5001
- ChromaDB: http://localhost:8000

## Notes

- Docker Desktop must be running on Windows/Mac
- Docker daemon must be accessible on Linux
- Images are built once and reused for all executions
- Containers are ephemeral (created and destroyed per execution)
- Temp files are mounted read-only into containers
