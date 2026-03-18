import axios from 'axios';
import { send } from 'node:process';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:3001';

// 1. Connect to the Socket Server
const socket = io(API_URL);

socket.on('connect', () => {
  console.log(`🔌 Connected to Vortex Socket: ${socket.id}`);
  
  // 2. Once connected, send the Task via HTTP
  sendTask();
  sendTask2();
});

// 3. Listen for the "Shout" from the Worker (via the API)
socket.on('task_update', (data) => {
  console.log(`🎯 Real-time Update Received:`, data);
  if (data.status === 'completed') {
    console.log('✅ Task finished! Closing connection...');
    socket.disconnect();
    process.exit(0);
  }
});

async function sendTask() {
  const task = {
  id: `vortex_${Math.random().toString(36).substr(2, 9)}`,
  type: 'ENCRYPT',
  payload: { secret: "EliteBook-2570p-Power" },
  

  };

  try {
    console.log(`🚀 Sending task ${task.id}...`);
    await axios.post(`${API_URL}/tasks`, task);
  } catch (error) {
    console.error(`❌ API Error:`, error.message);
    process.exit(1);
  }
}

  async function sendTask2() {
  const task = {
  id: `vortex_${Math.random().toString(36).substr(2, 9)}`,
  type: 'COMPUTE',
  payload: { iterations: 5000 },
  

  };

  try {
    console.log(`🚀 Sending task ${task.id}...`);
    await axios.post(`${API_URL}/tasks`, task);
  } catch (error) {
    console.error(`❌ API Error:`, error.message);
    process.exit(1);
  }
}
