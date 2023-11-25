import { SpringApiRes } from './User';

export interface GetJobsRes extends SpringApiRes {
  response: Job[];
}

export interface Job {
  id: number;
  name: string;
  isDeleting?: boolean;
}
