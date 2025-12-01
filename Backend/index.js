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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});
app.use(limiter);

app.post('/run', (req, res) => {
  const { code, filename } = req.body;
  console.log(`\nReceived request for file: ${filename}`);

  if (!code || !filename) {
    return res.status(400).json({ error: 'Code or filename not provided.' });
  }

  try {
    const extension = path.extname(filename).substring(1);
    const uniqueId = uuidv4();
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    
    let command, filePath, cleanupPaths = [];
    switch (extension) {
      case 'js':
        filePath = path.join(tempDir, `${uniqueId}.js`);
        command = `node "${filePath}"`;
        cleanupPaths.push(filePath);
        break;
      case 'py':
        filePath = path.join(tempDir, `${uniqueId}.py`);
        command = `python3 "${filePath}"`;
        cleanupPaths.push(filePath);
        break;
      case 'c':
      case 'cpp':
        const compiler = extension === 'c' ? 'gcc' : 'g++';
        const sourcePath = path.join(tempDir, `${uniqueId}.${extension}`);
        const outputPath = path.join(tempDir, uniqueId);
        filePath = sourcePath;
        command = `"${compiler}" "${sourcePath}" -o "${outputPath}" && "${outputPath}"`;
        cleanupPaths.push(sourcePath, outputPath);
        break;
      case 'java':
        const javaDir = path.join(tempDir, uniqueId);
        fs.mkdirSync(javaDir);
        filePath = path.join(javaDir, `Main.java`);
        command = `javac "${filePath}" && java -cp "${javaDir}" Main`;
        cleanupPaths.push(javaDir);
        break;
      default:
        return res.status(400).json({ output: `Error: Language '${extension}' is not supported.` });
    }

    fs.writeFileSync(filePath, code);
    
    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      cleanupPaths.forEach(p => fs.rmSync(p, { recursive: true, force: true }));

      if (error) {
        console.error(`Execution Error: ${stderr || error.message}`);
        return res.json({ output: stderr || error.message });
      }
      return res.json({ output: stdout });
    });

  } catch (err) {
    console.error("A critical error occurred:", err);
    return res.status(500).json({ output: `Server error: ${err.message}`});
  }
});

app.listen(port, () => {
  console.log(`Node.js server listening at http://127.0.0.1:${port}`);
});