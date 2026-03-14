export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobPayload {
  id: string;
  type: 'EMAIL_SEND' | 'IMAGE_RESIZE' | 'GENERATE_REPORT';
  data: any;
  createdAt: number;
}
