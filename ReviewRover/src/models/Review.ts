import { REVIEW_TYPES } from 'src/helpers/constants';
import { SpringApiRes, User } from './User';

export interface Review {
  reviewFor: string;
  reviewType: REVIEW_TYPES;
  month: number;
  year: number;
  score: number;
  title?: string;
  description?: string;
  goodQuality?: string;
  badQuality?: string;
}

export interface GetTeamReviewsReq {
  team: string;
  month?: number;
  year?: number;
  type?: string;
}

export interface GetTeamReviewsRes extends SpringApiRes {
  response: {
    year: number;
    reviews?: UserReview[];
  };
}

export interface GetAllTeamsOrDeptsYearlyScoresReq {
  year: number;
  type: string;
}

export interface GetAllTeamsYearlyScoresRes extends SpringApiRes {
  response: {
    year: number;
    reviews?: TeamReview[];
  };
}

export interface GetAllDeptsYearlyScoresRes extends SpringApiRes {
  response: {
    year: number;
    reviews?: DeptReview[];
  };
}

export interface UserReview {
  month: number;
  users: ReviewObj[];
}

export interface TeamReview {
  month: number;
  teams: ReviewObj[];
}

export interface DeptReview {
  month: number;
  department: ReviewObj[];
}

export interface ReviewObj {
  name: string;
  score: number;
}

export interface TeamMemberScore {
  submitted_by?: string;
  review_for: User;
  score: number;
  month: number;
  year: number;
  maxScore: number;
}

export interface GetPendingReviewsRes extends SpringApiRes {
  response: PendingReviews[];
}

export interface PendingReviews {
  id: number;
  user: string;
  team_name: string;
  title: string;
  description: string;
  month: number;
  year: number;
  created_on: string;
}

export interface UpdateReviewStatusReq {
  id: number;
  status: string;
}
