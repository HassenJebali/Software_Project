export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedUserId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
