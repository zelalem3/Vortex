import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Terminal, Activity, CheckCircle, Cpu, Database, Zap, ShieldAlert } from 'lucide-react';

const socket = io('http://localhost:3001');

interface Task {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed';
  timestamp: string;
}

export default function VortexDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<string[]>(["[SYS] Initializing Vortex Engine...", "[SYS] Socket connection established."]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('task_update', (data) => {
      setTasks((prev) => 
        prev.map(t => t.id === data.taskId ? { ...t, status: data.status } : t)
      );
      addLog(`[QUEUE] Task ${data.taskId} status: ${data.status.toUpperCase()}`);
    });

    return () => { socket.off('task_update'); };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-15), `[${time}] ${msg}`]);
  };

  const createTestTask = async () => {
    const taskId = `VX-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const newTask: Task = {
      id: taskId,
      type: Math.random() > 0.5 ? 'ENCRYPT_AES' : 'NODE_COMPUTE',
      status: 'pending',
      timestamp: new Date().toLocaleTimeString()
    };

    setTasks(prev => [newTask, ...prev].slice(0, 10)); // Keep last 10
    addLog(`[API] Injecting ${newTask.type} into Vortex...`);

    await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-green-400 font-mono p-4 md:p-10 relative overflow-hidden">
      {/* Retro Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-green-900 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic">
            <Zap className="text-yellow-500 fill-yellow-500" /> VORTEX_CORE / v1.0.4
          </h1>
          <p className="text-xs text-green-800 font-bold">STATION: HP-ELITEBOOK-2570P // ADDIS_ABABA_NODE</p>
        </div>
        
        <div className="flex gap-4">
            <StatBox icon={<Cpu size={14}/>} label="CPU_LOAD" value="24%" color="text-green-500" />
            <StatBox icon={<Database size={14}/>} label="REDIS_SYNC" value="ACTIVE" color="text-blue-500" />
            <button 
              onClick={createTestTask}
              className="bg-green-500 text-black px-6 py-2 font-black hover:bg-white transition-all active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            >
              INJECT_PACKET
            </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
          {tasks.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-green-900 h-64 flex items-center justify-center opacity-30 text-xl italic">
              NO_ACTIVE_TASKS_IN_QUEUE
            </div>
          )}
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Live System Logs */}
        <aside className="border-2 border-green-900 bg-black p-4 h-[600px] flex flex-col relative shadow-[inset_0_0_20px_rgba(0,20,0,0.5)]">
           <div className="absolute top-0 right-4 bg-green-900 text-[10px] px-2 text-black font-bold">LIVE_FEED</div>
           <div className="flex-1 overflow-y-auto space-y-1 text-[11px] scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('QUEUE') ? 'text-yellow-500' : ''}`}>
                  <span className="opacity-40">{'>'}</span> {log}
                </div>
              ))}
              <div ref={logEndRef} />
           </div>
        </aside>
      </main>
    </div>
  );
}

// Sub-components for cleaner code
function StatBox({ icon, label, value, color }: any) {
    return (
        <div className="border border-green-900 p-2 bg-gray-900/20 min-w-[100px]">
            <div className="flex items-center gap-1 text-[10px] opacity-60 italic">{icon} {label}</div>
            <div className={`text-sm font-black ${color}`}>{value}</div>
        </div>
    )
}

function TaskCard({ task }: { task: Task }) {
    const isDone = task.status === 'completed';
    return (
        <div className={`border-2 transition-all p-4 ${isDone ? 'border-green-500 bg-green-500/5' : 'border-green-900 bg-black'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] opacity-40 leading-none">SEQUENCE_ID</span>
                    <span className="font-bold text-lg leading-tight tracking-widest">{task.id}</span>
                </div>
                <div className={`p-1 border ${isDone ? 'border-green-500' : 'border-yellow-500'}`}>
                    {isDone ? <CheckCircle size={16}/> : <Activity size={16} className="animate-spin" />}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] italic">
                    <span>TYPE: {task.type}</span>
                    <span>{task.timestamp}</span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 bg-green-950 w-full overflow-hidden border border-green-900">
                    <div className={`h-full bg-green-500 ${isDone ? 'w-full' : 'w-1/3 animate-pulse'}`} />
                </div>
            </div>
        </div>
    )
}