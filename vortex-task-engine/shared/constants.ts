const VORTEX_QUEUE_NAME = 'vortex-tasks';
export { VORTEX_QUEUE_NAME };

 interface TaskData {
  id: string;
  type: 'COMPUTE' | 'NETWORK_SCAN' | 'ENCRYPT';
  payload: any;
}
export type { TaskData };