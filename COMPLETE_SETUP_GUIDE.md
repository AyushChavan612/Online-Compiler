# DevFlow - Complete Setup & Run Guide

## Prerequisites

1. **Node.js** installed (v18 or higher)
2. **Docker Desktop** installed and running
3. **Python** installed (for ChromaDB)
4. **Gemini API Key** from Google AI Studio

---

## One-Time Setup

### 1. Install Dependencies

Open PowerShell and run:

```powershell
# Install root dependencies
cd F:\devFlow
npm install

# Install Frontend dependencies
cd Frontend
npm install

# Install Backend dependencies
cd ..\Backend
npm install

# Install RAG dependencies
cd ..\RAG
npm install

# Install Optimizer dependencies
cd ..\optimizer
npm install
```

### 2. Configure Environment Variables

Create `.env` files with your Gemini API key:

**RAG/.env:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**optimizer/.env:**
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend/.env.local:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_RAG_URL=http://localhost:8080
NEXT_PUBLIC_OPTIMIZER_URL=http://localhost:5001
```

### 3. Build Docker Images (For Code Execution)

```powershell
cd F:\devFlow\Backend\docker-images
.\build-images.ps1
```

Wait for all 4 images to build (~5-10 minutes first time).

Verify:
```powershell
docker images | Select-String "devflow"
```

Should show:
- devflow-nodejs
- devflow-python
- devflow-cpp
- devflow-java

### 4. Seed RAG Database (One-Time)

```powershell
cd F:\devFlow\RAG
node seedDocs.js
```

---

## Running the Project

You need to start **5 services** in **5 separate terminals**:

### Terminal 1: ChromaDB

```powershell
cd F:\devFlow\RAG
chroma run --path ./chroma_db --port 8000
```

**Expected output:**
```
Running Chroma
Chroma server running on http://localhost:8000
```

### Terminal 2: RAG Service

```powershell
cd F:\devFlow\RAG
node server.js
```

**Expected output:**
```
RAG Service running on http://localhost:8080
```

### Terminal 3: Backend (Code Execution)

```powershell
cd F:\devFlow\Backend
node index.js
```

**Expected output:**
```
Node.js server listening at http://127.0.0.1:5000
Max concurrent executions: 10
```

### Terminal 4: Optimizer Service

```powershell
cd F:\devFlow\optimizer
node server.js
```

**Expected output:**
```
Optimizer service running on port 5001
```

### Terminal 5: Frontend

```powershell
cd F:\devFlow\Frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

---

## Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the DevFlow IDE! 🎉

---

## Quick Test

1. **Write some code** in the editor (JavaScript, Python, C++, or Java)
2. **Click "Run"** - Code executes in Docker container
3. **Click "AI Help"** - RAG service provides context-aware help
4. **Click "Optimize"** - AI optimizes your code

---

## Architecture Overview

```
Frontend (Port 3000)
    ↓
Backend (Port 5000) → Docker Containers (Code Execution)
    ↓
RAG Service (Port 8080) → ChromaDB (Port 8000)
    ↓
Optimizer Service (Port 5001)
```

---

## Stopping the Project

Press `Ctrl+C` in each terminal to stop each service.

To clean up Docker containers:
```powershell
docker container prune -f
```

---

## Common Issues

### "Docker daemon not running"
→ Start Docker Desktop

### "Port already in use"
→ Kill the process using that port:
```powershell
# Find process on port 3000 (or 5000, 8080, etc.)
netstat -ano | findstr :3000
# Kill it
taskkill /PID <process_id> /F
```

### "Cannot find module"
→ Install dependencies again:
```powershell
cd F:\devFlow\<service>
npm install
```

### "Gemini API error"
→ Check your API key in `.env` files

### "Docker images not found"
→ Build images again:
```powershell
cd F:\devFlow\Backend\docker-images
.\build-images.ps1
```

---

## Services Summary

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 3000 | React/Next.js UI |
| **Backend** | 5000 | Code execution in Docker |
| **RAG** | 8080 | AI-powered help |
| **Optimizer** | 5001 | Code optimization |
| **ChromaDB** | 8000 | Vector database |

---

## Resource Limits (Docker)

Each code execution runs in isolated container with:
- **Memory**: 256MB max
- **CPU**: 50% of one core
- **Timeout**: 10 seconds
- **Network**: Disabled
- **Concurrent**: 10 containers max

---

## Development Tips

**Hot reload:** Frontend auto-reloads on changes

**Backend changes:** Restart `node index.js` after editing

**Database reset:** Delete `RAG/chroma_db` and run `node seedDocs.js` again

**Clear Docker:** 
```powershell
docker system prune -a
```

---

Enjoy coding with DevFlow! 🚀
