# 🚀 DevFlow - AI-Powered Online IDE

<div align="center">

![DevFlow Banner](https://img.shields.io/badge/DevFlow-AI%20Powered%20IDE-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern, AI-powered online IDE with intelligent code assistance, optimization, and isolated Docker execution**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Architecture](#-architecture) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Language Support**: JavaScript, Python, C/C++, and Java
- **Real-Time Code Execution**: Run code instantly with live output
- **Monaco Editor**: Industry-standard VS Code editor experience
- **File Management**: Create, edit, and organize multiple files with tabs

### 🤖 AI-Powered Tools
- **AI Help**: Context-aware programming assistance using RAG (Retrieval-Augmented Generation)
- **Code Optimizer**: Automatic complexity analysis and code optimization suggestions
- **Smart Documentation**: Instant access to language-specific help and best practices

### 🔒 Security & Isolation
- **Docker Containers**: Each execution runs in isolated containers
- **Resource Limits**: 256MB memory, 50% CPU, 10-second timeout per execution
- **No Network Access**: Containers run without internet connectivity
- **Auto Cleanup**: Containers automatically removed after execution

### ⚡ Performance
- **Queue Management**: Handle 10+ concurrent executions safely
- **Rate Limiting**: 20 requests/minute per IP
- **Optimized Images**: Lightweight Alpine-based Docker images
- **Crash Protection**: System-level resource safeguards

---

## 🎬 Demo

### Code Editor Interface
![DevFlow IDE](https://via.placeholder.com/800x450/1e1e1e/ffffff?text=DevFlow+IDE+Screenshot)

### AI-Powered Features
| Feature | Description |
|---------|-------------|
| 🤖 **AI Help** | Get instant context-aware programming assistance |
| ⚡ **Code Optimizer** | Analyze complexity and receive optimization suggestions |
| 🐳 **Docker Execution** | Run code in isolated containers with resource limits |
| 📁 **Multi-File Support** | Manage multiple files with tab interface |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Editor**: Monaco Editor (VS Code)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend Services
- **Code Execution**: Node.js + Express + Docker
- **RAG Service**: ChromaDB + Gemini 2.5 Flash
- **Optimizer**: Gemini AI for code analysis
- **Database**: ChromaDB for vector storage

### Infrastructure
- **Containerization**: Docker with resource limits
- **Runtime Images**: Alpine-based lightweight containers
- **Queue System**: Custom concurrent execution manager

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher
- **Docker Desktop** (running)
- **Python** 3.8+ (for ChromaDB)
- **Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AyushChavan612/Online-Compiler.git
cd Online-Compiler
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install Frontend dependencies
cd Frontend
npm install

# Install Backend dependencies
cd ../Backend
npm install

# Install RAG service dependencies
cd ../RAG
npm install

# Install Optimizer dependencies
cd ../optimizer
npm install
```

### 3. Configure Environment Variables

Create `.env` files in the respective directories:

**RAG/.env**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**optimizer/.env**
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend/.env.local**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_RAG_URL=http://localhost:8080
NEXT_PUBLIC_OPTIMIZER_URL=http://localhost:5001
```

### 4. Build Docker Images

```bash
cd Backend/docker-images

# Windows (PowerShell)
.\build-images.ps1

# Linux/Mac
chmod +x build-images.sh
./build-images.sh
```

This builds 4 lightweight images:
- `devflow-nodejs` (~191MB)
- `devflow-python` (~83MB)
- `devflow-cpp` (~341MB)
- `devflow-java` (~550MB)

### 5. Seed RAG Database

```bash
cd RAG
node seedDocs.js
```

---

## 🎯 Usage

### Running the Application

Start all 5 services in separate terminals:

**Terminal 1: ChromaDB**
```bash
cd RAG
chroma run --path ./chroma_db --port 8000
```

**Terminal 2: RAG Service**
```bash
cd RAG
node server.js
```

**Terminal 3: Backend**
```bash
cd Backend
node index.js
```

**Terminal 4: Optimizer**
```bash
cd optimizer
node server.js
```

**Terminal 5: Frontend**
```bash
cd Frontend
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                    Port 3000 - React UI                      │
└───────────┬─────────────────────────────────────────────────┘
            │
            ├──────────────┬──────────────┬──────────────┐
            ▼              ▼              ▼              ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
    │   Backend    │ │   RAG    │ │Optimizer │ │   ChromaDB   │
    │  Port 5000   │ │Port 8080 │ │Port 5001 │ │  Port 8000   │
    └──────┬───────┘ └────┬─────┘ └──────────┘ └──────────────┘
           │              │
           ▼              ▼
    ┌──────────────┐ ┌──────────┐
    │   Docker     │ │  Vector  │
    │  Containers  │ │ Database │
    └──────────────┘ └──────────┘
```

### Service Details

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 3000 | React UI with Monaco Editor |
| **Backend** | 5000 | Code execution in Docker containers |
| **RAG** | 8080 | AI-powered code assistance |
| **Optimizer** | 5001 | Code optimization and analysis |
| **ChromaDB** | 8000 | Vector database for documentation |

---

## 🐳 Docker Execution

### Resource Limits (Per Container)

| Resource | Limit | Description |
|----------|-------|-------------|
| **Memory** | 256MB | Hard limit, container killed if exceeded |
| **CPU** | 50% of 1 core | Prevents CPU hogging |
| **Timeout** | 10 seconds | Auto-termination for long-running code |
| **Network** | Disabled | No internet access for security |
| **Filesystem** | Read-only | Code directory mounted read-only |

### Queue System

- **Concurrent Limit**: 10 containers running simultaneously
- **Queue Size**: Unlimited (automatically managed)
- **Fair Scheduling**: First-come, first-served execution
- **Auto Cleanup**: Containers removed after completion

### Security Features

✅ Non-root user execution  
✅ Read-only filesystem  
✅ No network access  
✅ Resource isolation  
✅ Automatic cleanup  

---

## 🎨 Features Walkthrough

### 1. **Write Code**
Choose from JavaScript, Python, C/C++, or Java and start coding with syntax highlighting and IntelliSense.

### 2. **Run Code**
Click the **Run** button to execute your code in an isolated Docker container. Output appears in the integrated terminal.

### 3. **AI Help**
Need assistance? Click **AI Help** to get context-aware programming guidance based on your current code.

### 4. **Optimize Code**
Click **Optimize** to receive:
- Time and space complexity analysis
- Optimized code suggestions
- Performance improvement recommendations

### 5. **Multi-File Support**
Create and manage multiple files with the built-in tab system.

---

## 📊 Performance Metrics

From our research paper:

| Metric | Result |
|--------|--------|
| **Debugging Accuracy** | 94% |
| **Optimization Success Rate** | 92% |
| **Average Response Time** | <2 seconds |
| **Concurrent Users Supported** | 10+ (with queuing) |
| **System Crash Rate** | 0% (with Docker isolation) |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Troubleshooting

### Docker Issues

**Problem**: "Docker daemon not running"  
**Solution**: Start Docker Desktop and wait for it to fully start

**Problem**: "Image not found"  
**Solution**: Run `build-images.ps1` to build Docker images

### Port Conflicts

**Problem**: "Port already in use"  
**Solution**: Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :PORT_NUMBER
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :PORT_NUMBER
kill -9 <process_id>
```

### API Key Issues

**Problem**: "Gemini API error"  
**Solution**: Verify your API key in `.env` files

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- Monaco Editor by Microsoft
- ChromaDB for vector database
- Google Gemini for AI capabilities
- Docker for containerization
- Next.js and React teams

---

## 📧 Contact

For questions, issues, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/AyushChavan612/Online-Compiler/issues)
- **Email**: ayushchavan612@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the DevFlow Team

</div>
