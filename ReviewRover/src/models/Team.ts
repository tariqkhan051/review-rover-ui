import { Department } from './Department';
import { SpringApiRes } from './User';

export interface Team {
  id: number;
  name: string;
  isDeleting?: boolean;
  department?: Department;
  department_id?: number;
}

export interface TeamDisplay extends Team {
  department_name?: string;
}

export interface GetTeamsRes extends SpringApiRes {
  response: Team[];
}
