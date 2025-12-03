// backend/index.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Docker from 'dockerode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;
const docker = new Docker();

app.use(cors());
app.use(express.json());

// Queue to limit concurrent executions
let activeExecutions = 0;
const MAX_CONCURRENT_EXECUTIONS = 10; // Increased since Docker provides isolation
const executionQueue = [];

// Docker resource limits
const DOCKER_MEMORY_LIMIT = 256 * 1024 * 1024; // 256MB per container
const DOCKER_CPU_PERIOD = 100000; // 100ms
const DOCKER_CPU_QUOTA = 50000; // 50% of one CPU core
const DOCKER_TIMEOUT_MS = 10000; // 10 second timeout

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20, // Max 20 requests per minute per IP
  message: "Too many code execution requests. Please wait a minute before trying again.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});
app.use(limiter);

// Process execution queue
function processQueue() {
  if (executionQueue.length > 0 && activeExecutions<MAX_CONCURRENT_EXECUTIONS) {
    const task = executionQueue.shift();
    task();
  }
}

app.post('/run', (req, res) => {
  const { code, filename } = req.body;
  console.log(`\nReceived request for file: ${filename}`);

  if (!code || !filename) {
    return res.status(400).json({ error: 'Code or filename not provided.' });
  }

  // Check queue size - reject if too many pending
  if (executionQueue.length >= 200) {
    return res.status(503).json({ 
      output: 'Server is currently overloaded. Please try again in a few moments.' 
    });
  }

  // Add to queue
  executionQueue.push(() => executeCode(req, res));
  processQueue();
});

async function executeCode(req, res) {
  activeExecutions++;
  const { code, filename } = req.body;

  try {
    const extension = path.extname(filename).substring(1);
    const uniqueId = uuidv4();
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    
    let dockerImage, cmd, filePath, fileName;
    
    switch (extension) {
      case 'js':
        dockerImage = 'devflow-nodejs:latest';
        fileName = `${uniqueId}.js`;
        filePath = path.join(tempDir, fileName);
        cmd = ['node', `/app/${fileName}`];
        break;
      case 'py':
        dockerImage = 'devflow-python:latest';
        fileName = `${uniqueId}.py`;
        filePath = path.join(tempDir, fileName);
        cmd = ['python3', `/app/${fileName}`];
        break;
      case 'c':
      case 'cpp':
        dockerImage = 'devflow-cpp:latest';
        const compiler = extension === 'c' ? 'gcc' : 'g++';
        fileName = `${uniqueId}.${extension}`;
        const outputName = uniqueId;
        filePath = path.join(tempDir, fileName);
        cmd = ['/bin/sh', '-c', `${compiler} /app/${fileName} -o /app/${outputName} && /app/${outputName}`];
        break;
      case 'java':
        dockerImage = 'devflow-java:latest';
        fileName = 'Main.java';
        filePath = path.join(tempDir, `${uniqueId}.java`);
        cmd = ['/bin/sh', '-c', `javac /app/Main.java && java -cp /app Main`];
        break;
      default:
        activeExecutions--;
        processQueue();
        return res.status(400).json({ output: `Error: Language '${extension}' is not supported.` });
    }

    // Write code to temp file
    fs.writeFileSync(filePath, code);
    
    console.log(`Running code in Docker container: ${dockerImage}`);

    // Create and start Docker container with resource limits
    const container = await docker.createContainer({
      Image: dockerImage,
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: DOCKER_MEMORY_LIMIT, // 256MB memory limit
        MemorySwap: DOCKER_MEMORY_LIMIT, // Disable swap
        CpuPeriod: DOCKER_CPU_PERIOD,
        CpuQuota: DOCKER_CPU_QUOTA, // 50% of one CPU core
        NetworkMode: 'none', // No network access for security
        AutoRemove: true, // Auto-remove container after execution
        Binds: [`${tempDir}:/app:ro`], // Mount temp dir as read-only
      },
    });

    // Start container with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Execution timeout (10s)')), DOCKER_TIMEOUT_MS)
    );

    const executionPromise = (async () => {
      await container.start();
      
      // Get logs
      const logs = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      let output = '';
      logs.on('data', (chunk) => {
        output += chunk.toString('utf8');
      });

      await container.wait();
      
      return output;
    })();

    try {
      const output = await Promise.race([executionPromise, timeoutPromise]);
      
      // Cleanup temp file
      fs.rmSync(filePath, { force: true });

      activeExecutions--;
      processQueue();

      // Clean output (remove Docker log headers)
      const cleanOutput = output.replace(/[\x00-\x08]/g, '').trim();
      return res.json({ output: cleanOutput || 'Program executed successfully with no output.' });

    } catch (timeoutError) {
      // Kill container on timeout
      try {
        await container.kill();
        await container.remove({ force: true });
      } catch (killError) {
        console.error('Error killing container:', killError.message);
      }

      fs.rmSync(filePath, { force: true });

      activeExecutions--;
      processQueue();

      return res.json({ output: `Error: ${timeoutError.message}` });
    }

  } catch (err) {
    console.error("Docker execution error:", err);
    activeExecutions--;
    processQueue();
    return res.status(500).json({ output: `Server error: ${err.message}`});
  }
}

app.listen(port, () => {
  console.log(`Node.js server listening at http://127.0.0.1:${port}`);
  console.log(`Max concurrent executions: ${MAX_CONCURRENT_EXECUTIONS}`);
});