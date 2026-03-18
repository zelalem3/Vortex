export interface VortexTask {
  id: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  createdAt: number;
}

export interface ServerToClientEvents {
  task_updated: (task: VortexTask) => void;
  vortex_status: (msg: string) => void;
}

export interface ClientToServerEvents {
  submit_task: (task: Partial<VortexTask>) => void;
}