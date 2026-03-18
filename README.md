# 🌪️ PROJECT_VORTEX
**High-Performance Real-Time Task Orchestration Engine**

Vortex is a distributed task processing system built for speed, reliability, and real-time visibility. It leverages a producer-consumer architecture to handle heavy computational workloads (like AES-256 encryption) without blocking the user interface.

---

## 🛠️ Tech Stack
* **Runtime:** Node.js v22 (ESM)
* **Frontend:** React + Tailwind CSS + Lucide Icons
* **Backend:** Express.js + Socket.io
* **Queue Management:** BullMQ (Redis-backed)
* **Processing:** TypeScript + `tsx` for high-speed execution
* **Security Logic:** Node.js Crypto (AES-256-CBC)

---

## 🏗️ Architecture
The system is divided into three core services:

1.  **Vortex API (`/api`):** The entry point. It accepts task requests via REST and acts as a WebSocket gateway to broadcast live updates from the hardware layer to the client.
2.  **Vortex Worker (`/worker`):** The heavy lifter. It pulls jobs from the Redis queue, performs intensive CPU tasks (AES Encryption), and publishes status updates via Redis Pub/Sub.
3.  **Vortex Dashboard (`/dashboard`):** A high-contrast, terminal-style monitoring interface. It provides a real-time "heartbeat" of the system, visualizing task lifecycles from `PENDING` to `COMPLETED` or `FAILED`.

---

## 🚀 Getting Started

### Prerequisites
* **Redis Server:** Running on `localhost:6379`
* **Node.js:** v20.x or higher (Tested on v22.20.0)
* **OS:** Linux (Optimized for Lubuntu / Intel Core i5/i7 3rd Gen)

### Installation
```bash
# Clone the repository
git clone [https://github.com/ZelalemGetnet/vortex-task-engine.git](https://github.com/ZelalemGetnet/Vortex.git)

# Navigate to the project
cd Vortex

# Navigate to the project root
cd vortex-task-engine

# Install dependencies
npm install
```

Running the Engine
The project uses concurrently to boot the entire ecosystem with a single command:

```Bash

# Start API, Worker, and Dashboard simultaneously
npm run dev
```




## 📊 System Features
Real-Time Feedback: Zero-latency updates via Socket.io/WebSockets.

Fault Tolerance: Automatic task retries and error state visualization for "Corrupted" packets.

Resource Efficient: Low-overhead processing optimized for older hardware (HP EliteBook 2570p).

Cyberpunk UI: High-contrast, dark-mode terminal aesthetic with live system logs.

## 🧠 Challenges Overcome
Module Interop: Resolved ESM vs CommonJS conflicts in Node v22 by implementing the tsx loader and --import flags.

Decoupled Architecture: Utilized Redis Pub/Sub to allow the Worker to communicate with the Socket server without direct dependencies.

Concurrency Control: Configured BullMQ to manage CPU-intensive tasks without hanging the event loop.

## 📜 License
Distributed under the MIT License. See LICENSE for more information.

Maintained by Zelalem Getnet






