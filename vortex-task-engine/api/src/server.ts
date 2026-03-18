import express from 'express';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import { Redis } from 'ioredis';
import { vortexQueue } from './queue.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());


const httpServer = createServer(app);


const io = new Server(httpServer, { 
  cors: { origin: "*" } 
});

const redisSubscriber = new Redis({
  host: 'localhost',
  port: 6379
});


redisSubscriber.subscribe('vortex-updates');

redisSubscriber.on('message', (channel, message) => {
  if (channel === 'vortex-updates') {
    const data = JSON.parse(message);
    console.log(`📢 Broadcasting update for ${data.taskId}`);
    io.emit('task_update', data); 
  }
});

io.on('connection', (socket) => {
  console.log('Dashboard Connected:', socket.id);
});

// Routes
app.post('/tasks', async (req, res) => {
  const taskData = req.body;
  try {
    await vortexQueue.add('vortex-job', taskData);
    res.status(202).json({ 
      status: 'Accepted', 
      taskId: taskData.id 
    });
  } catch (err) {
    res.status(500).json({ error: 'Vortex Queue is down' });
  }
});


const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Vortex API & Socket Server running on http://localhost:${PORT}`);
});