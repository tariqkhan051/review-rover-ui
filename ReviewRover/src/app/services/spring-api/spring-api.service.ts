import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {
  AddUpdateUser,
  GetUserDetailsResp,
  GetUsersResp,
  ScoreRequest,
  ScoreResponse,
  SpringApiRes,
  User
} from 'src/models/User';
import {
  GetAllDeptsYearlyScoresRes,
  GetAllTeamsOrDeptsYearlyScoresReq,
  GetAllTeamsYearlyScoresRes,
  GetPendingReviewsRes,
  GetTeamReviewsReq,
  GetTeamReviewsRes,
  UpdateReviewStatusReq
} from 'src/models/Review';
import { GetTeamsRes, Team } from 'src/models/Team';
import { RatingDate } from 'src/models/RatingDate';
import { GetJobsRes, Job } from 'src/models/Jobs';
import { ENDPOINTS, REVIEW_TYPES } from 'src/helpers/constants';
import { getErrorAlert } from 'src/helpers/utils';
import { Review } from 'src/models/Review';
import { Department, GetDepartmentsRes } from 'src/models/Department';

const defaultBaseResponse: SpringApiRes = {
  responseCode: '',
  execDt: '',
  message: '',
  response: []
};

@Injectable({
  providedIn: 'root'
})
export class SpringApiService {
  constructor(private httpClient: HttpClient) {}

  //#region USERS

  getUserDetails() {
    const defaultResponse = { ...defaultBaseResponse, response: null };

    return this.httpClient
      .get<GetUserDetailsResp>(ENDPOINTS.USER_DETAILS)
      .pipe(catchError(this.handleError<GetUserDetailsResp>(defaultResponse)));
  }

  getUsers(teamName?: string): Observable<GetUsersResp> {
    let queryParamsString;

    if (teamName) {
      const body = { team: teamName };
      queryParamsString = new HttpParams({
        fromObject: body as any
      }).toString();
    }

    const defaultResp: GetUsersResp = {
      ...defaultBaseResponse,
      response: []
    };
    const url = teamName
      ? ENDPOINTS.USER + `?${queryParamsString}`
      : ENDPOINTS.USER;

    return this.httpClient
      .get<GetUsersResp>(url)
      .pipe(catchError(this.handleError<GetUsersResp>(defaultResp)));
  }

  getUsersForRandomReviews(teamName: string): Observable<GetUsersResp> {
    const defaultResp: GetUsersResp = {
      ...defaultBaseResponse,
      response: []
    };

    return this.httpClient
      .get<GetUsersResp>(ENDPOINTS.USER + `/${teamName}`)
      .pipe(catchError(this.handleError<GetUsersResp>(defaultResp)));
  }

  addUser(user: AddUpdateUser): Observable<SpringApiRes> {
    const req = {
      ...user,
      roles: ['ROLE_USER']
    };
    return this.httpClient
      .post<SpringApiRes>(ENDPOINTS.SIGN_UP, req)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  editUser(user: AddUpdateUser, oldUsername: string): Observable<SpringApiRes> {
    return this.httpClient
      .put<SpringApiRes>(ENDPOINTS.USER + `/${oldUsername}`, user)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  deleteUser(user: User): Observable<SpringApiRes> {
    return this.httpClient
      .delete<SpringApiRes>(ENDPOINTS.USER + `/${user.username}?force=true`)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  //#endregion

  //#region TEAMS

  getTeams(): Observable<GetTeamsRes> {
    return this.httpClient
      .get<GetTeamsRes>(ENDPOINTS.TEAM)
      .pipe(
        catchError(
          this.handleError<GetTeamsRes>(defaultBaseResponse as GetTeamsRes)
        )
      );
  }

  addTeam(team: Team): Observable<SpringApiRes> {
    return this.httpClient
      .post<SpringApiRes>(ENDPOINTS.TEAM, team)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  deleteTeam(team: Team): Observable<SpringApiRes> {
    return this.httpClient
      .delete<SpringApiRes>(`${ENDPOINTS.TEAM}/${team.id}`)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  editTeam(team: Team): Observable<SpringApiRes> {
    return this.httpClient
      .put<SpringApiRes>(`${ENDPOINTS.TEAM}/${team.id}`, team)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  //#endregion

  //#region REVIEWS

  getPendingApprovalsForManager(): Observable<GetPendingReviewsRes> {
    return this.httpClient
      .get<GetPendingReviewsRes>(ENDPOINTS.PENDING_REVIEWS_MANAGER)
      .pipe(
        catchError(this.handleError<GetPendingReviewsRes>(defaultBaseResponse))
      );
  }

  getOtherReviewsForManager(status: string): Observable<GetPendingReviewsRes> {
    return this.httpClient
      .get<GetPendingReviewsRes>(`${ENDPOINTS.REVIEWS}/${status}/manager`)
      .pipe(
        catchError(this.handleError<GetPendingReviewsRes>(defaultBaseResponse))
      );
  }

  getPendingApprovalsForAdmin(): Observable<GetPendingReviewsRes> {
    return this.httpClient
      .get<GetPendingReviewsRes>(ENDPOINTS.PENDING_REVIEWS)
      .pipe(
        catchError(this.handleError<GetPendingReviewsRes>(defaultBaseResponse))
      );
  }

  getOtherReviewsForAdmin(status: string): Observable<GetPendingReviewsRes> {
    return this.httpClient
      .get<GetPendingReviewsRes>(`${ENDPOINTS.REVIEWS}/${status}`)
      .pipe(
        catchError(this.handleError<GetPendingReviewsRes>(defaultBaseResponse))
      );
  }

  updateReviewStatus(
    reviewsArr: UpdateReviewStatusReq[],
    isManager: boolean = false
  ) {
    return this.httpClient
      .put<SpringApiRes>(
        ENDPOINTS.REVIEWS + `${isManager ? '/manager' : ''}`,
        reviewsArr
      )
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  addReview(
    reviewType: REVIEW_TYPES,
    title: string,
    description: string,
    reviewFor: string,
    score: number,
    reviews: any
  ): Observable<any> {
    const date = new Date();

    const body: Review = {
      reviewType: reviewType,
      reviewFor: reviewFor,
      month: date.getMonth(),
      year: date.getFullYear(),
      description: description,
      title: title,
      score: score,
      goodQuality: reviews?.good?.toString()?.replace(/\s+/g, ' ') || '',
      badQuality: reviews?.bad?.toString()?.replace(/\s+/g, ' ') || ''
    };
    debugger;
    return this.httpClient.post(ENDPOINTS.REVIEWS, body);
  }

  getTopRankingUsers(ratingDate: RatingDate, reviewType: string) {
    const req = {
      month: ratingDate.month,
      year: ratingDate.year,
      review_type: reviewType || null
    };

    return this.httpClient
      .post<SpringApiRes>(ENDPOINTS.RANKING, req)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  getPendingReviewsForUser(): Observable<any> {
    const date = new Date();

    const body = {
      year: date.getFullYear(),
      month: date.getMonth()
    };

    const defaultResp: any = {
      ...defaultBaseResponse,
      response: {
        users: []
      }
    };

    const queryParamsString = new HttpParams({
      fromObject: body as any
    }).toString();

    return this.httpClient
      .get<any>(ENDPOINTS.PENDING_REVIEWS_USER + `?${queryParamsString}`)
      .pipe(catchError(this.handleError<any>(defaultResp)));
  }

  getTeamScores(
    team: string,
    ratingDate: RatingDate,
    sendMonth: boolean = true,
    type: string = 'monthly'
  ): Observable<GetTeamReviewsRes> {
    const body: GetTeamReviewsReq = {
      team: team,
      year: ratingDate.year,
      type: REVIEW_TYPES.MONTHLY
    };

    if (type !== 'monthly') {
      body.type = type;
    }
    if (sendMonth) {
      body.month = ratingDate.month;
    }

    const defaultResp: GetTeamReviewsRes = {
      responseCode: '',
      execDt: '',
      message: '',
      response: { reviews: [], year: ratingDate.year }
    };

    const queryParamsString = new HttpParams({
      fromObject: body as any
    }).toString();

    return this.httpClient
      .get<GetTeamReviewsRes>(ENDPOINTS.REVIEWS + `?${queryParamsString}`)
      .pipe(catchError(this.handleError<GetTeamReviewsRes>(defaultResp)));
  }

  getAllTeamsYearlyScores(
    ratingDate: RatingDate,
    type: string
  ): Observable<GetAllTeamsYearlyScoresRes> {
    const body: GetAllTeamsOrDeptsYearlyScoresReq = {
      year: ratingDate.year,
      type: type
    };

    const defaultResp: GetAllTeamsYearlyScoresRes = {
      responseCode: '',
      execDt: '',
      message: '',
      response: { reviews: [], year: ratingDate.year }
    };

    const queryParamsString = new HttpParams({
      fromObject: body as any
    }).toString();

    return this.httpClient
      .get<GetAllTeamsYearlyScoresRes>(
        ENDPOINTS.REVIEWS + `?${queryParamsString}`
      )
      .pipe(
        catchError(this.handleError<GetAllTeamsYearlyScoresRes>(defaultResp))
      );
  }

  getUserScore(
    username: string,
    teamName: string,
    ratingDate: RatingDate,
    forSingleMonth: boolean = false,
    type: string = ''
  ): Observable<ScoreResponse> {
    const body: ScoreRequest = {
      user: username,
      team: teamName,
      year: ratingDate.year,
      type: type
    };

    if (forSingleMonth) {
      body.month = ratingDate.month;
    }

    const defaultResp: ScoreResponse = {
      ...defaultBaseResponse,
      response: {
        reviews: [
          {
            score: 0,
            good_quality: [],
            bad_quality: []
          }
        ]
      }
    };

    const queryParamsString = new HttpParams({
      fromObject: body as any
    }).toString();

    return this.httpClient
      .get<ScoreResponse>(ENDPOINTS.REVIEWS + `?${queryParamsString}`)
      .pipe(catchError(this.handleError<ScoreResponse>(defaultResp)));
  }

  getAllDepartmentsYearlyScores(
    ratingDate: RatingDate,
    type: string
  ): Observable<GetAllDeptsYearlyScoresRes> {
    const body: GetAllTeamsOrDeptsYearlyScoresReq = {
      year: ratingDate.year,
      type: type
    };

    const defaultResp: GetAllDeptsYearlyScoresRes = {
      responseCode: '',
      execDt: '',
      message: '',
      response: { reviews: [], year: ratingDate.year }
    };

    const queryParamsString = new HttpParams({
      fromObject: body as any
    }).toString();

    return this.httpClient
      .get<GetAllDeptsYearlyScoresRes>(
        ENDPOINTS.DEPT_REVIEWS + `?${queryParamsString}`
      )
      .pipe(
        catchError(this.handleError<GetAllDeptsYearlyScoresRes>(defaultResp))
      );
  }
  //#endregion

  //#region JOBS

  getJobs(): Observable<GetJobsRes> {
    const defaultResp: GetJobsRes = {
      ...defaultBaseResponse,
      response: []
    };

    return this.httpClient
      .get<GetJobsRes>(ENDPOINTS.JOBS)
      .pipe(catchError(this.handleError<GetJobsRes>(defaultResp)));
  }

  addJob(job: Job): Observable<SpringApiRes> {
    return this.httpClient
      .post<SpringApiRes>(ENDPOINTS.JOBS, job)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  deleteJob(job: Job): Observable<SpringApiRes> {
    return this.httpClient
      .delete<SpringApiRes>(ENDPOINTS.JOBS + `/${job.id}`, {
        body: job
      })
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  editJob(job: Job): Observable<SpringApiRes> {
    return this.httpClient
      .put<SpringApiRes>(ENDPOINTS.JOBS + `/${job.id}`, job)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  //#endregion

  //#region DEPARTMENTS

  getDepartments(): Observable<GetDepartmentsRes> {
    const defaultResp: GetJobsRes = {
      ...defaultBaseResponse,
      response: []
    };

    return this.httpClient
      .get<GetJobsRes>(ENDPOINTS.DEPARTMENT)
      .pipe(catchError(this.handleError<GetDepartmentsRes>(defaultResp)));
  }

  addDepartment(dept: Department): Observable<SpringApiRes> {
    return this.httpClient
      .post<SpringApiRes>(ENDPOINTS.DEPARTMENT, dept)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  deleteDepartment(dept: Department): Observable<SpringApiRes> {
    return this.httpClient
      .delete<SpringApiRes>(ENDPOINTS.DEPARTMENT + `/${dept.id}`, {
        body: dept
      })
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  editDepartment(dept: Department): Observable<SpringApiRes> {
    return this.httpClient
      .put<SpringApiRes>(ENDPOINTS.DEPARTMENT + `/${dept.id}`, dept)
      .pipe(catchError(this.handleError<SpringApiRes>(defaultBaseResponse)));
  }

  //#endregion

  private handleError<T>(errorResp?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 400) getErrorAlert(error.error.message);
      return of(errorResp as T);
    };
  }
}
