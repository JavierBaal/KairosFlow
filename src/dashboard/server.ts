import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs-extra';
import open from 'open';
import chalk from 'chalk';

export const startDashboard = async (port: number = 3000) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    const artifactsDir = path.join(process.cwd(), 'artifacts');

    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));

    // API to get all artifacts
    app.get('/api/artifacts', async (req, res) => {
        try {
            if (!fs.existsSync(artifactsDir)) {
                return res.json([]);
            }
            const files = await fs.readdir(artifactsDir);
            const artifacts = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readJSON(path.join(artifactsDir, file));
                    artifacts.push({ filename: file, content });
                }
            }

            // Sort by timestamp if available, or filename
            artifacts.sort((a, b) => {
                const timeA = a.content.metadata?.timestamp ? new Date(a.content.metadata.timestamp).getTime() : 0;
                const timeB = b.content.metadata?.timestamp ? new Date(b.content.metadata.timestamp).getTime() : 0;
                return timeA - timeB;
            });

            res.json(artifacts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to read artifacts' });
        }
    });

    // Socket.io connection
    io.on('connection', (socket) => {
        console.log('Client connected to dashboard');

        // Send initial data
        // (Client will fetch via API, but we can push updates)
    });

    // Watch for changes in artifacts
    if (fs.existsSync(artifactsDir)) {
        fs.watch(artifactsDir, async (eventType, filename) => {
            if (filename && filename.endsWith('.json')) {
                io.emit('update', { eventType, filename });
            }
        });
    }

    server.listen(port, async () => {
        const url = `http://localhost:${port}`;
        console.log(chalk.green(`\n🚀 Dashboard running at ${url}`));
        await open(url);
    });
};
