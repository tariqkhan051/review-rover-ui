import { Job } from './Jobs';
import { RatingDate } from './RatingDate';
import { ReviewObj } from './Review';
import { Team } from './Team';

export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  password?: string;
  team: Team;
  manager?: Manager;
  job?: Job;
  isLive?: boolean;
  isDeleting?: boolean;
}

export interface AddUpdateUser {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
  team_name?: string;
  manager_name?: string;
  job_name?: string;
  is_live?: boolean;
}

export interface UserDisplay extends AddUpdateUser {
  id: number;
  isDeleting?: boolean;
}

interface Manager extends User {}

export class UserAuth {
  username: string;
  password: string;
}

export interface ValidateUserReq {
  name: string;
  password: string;
}

export interface GetUsersReq {
  name: string;
}

export interface GetUsersResp extends SpringApiRes {
  response: User[];
}

export interface GetUserDetailsResp extends SpringApiRes {
  response: UserDetails | null;
}

interface UserDetails {
  name: string;
  team_name: string;
  is_manager: boolean;
}

export interface DeleteUserReq {
  name: string;
  team_name: string;
}

export interface SpringApiRes {
  responseCode: string;
  execDt: string;
  message: string;
  response: any[] | any;
}

export interface ScoreRequest {
  type?: string;
  team: string;
  user: string;
  month?: number;
  year: number;
}

export interface ScoreResponse extends SpringApiRes {
  response: {
    reviews: [
      {
        name?: string;
        month?: number;
        year?: number;
        review_type?: string;
        score?: number;
        good_quality?: string[];
        bad_quality?: string[];
      }
    ];
  };
}

export interface RankObj extends ReviewObj {
  rank: number;
  team_name: string;
}

export interface RankReq extends RatingDate {
  review_type: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  roles: string[];
  username: string;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
}
