import { SpringApiRes } from './User';

export interface GetDepartmentsRes extends SpringApiRes {
  response: Department[];
}

export interface Department {
  id: number;
  name: string;
  isDeleting?: boolean;
}
