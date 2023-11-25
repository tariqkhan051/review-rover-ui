import { Observable, of } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { ENDPOINTS, SESSION_KEYS } from 'src/helpers/constants';
import {
  AuthResponse,
  DecodedToken,
  GetUserDetailsResp,
  UserAuth
} from 'src/models/User';
import { SpringApiService } from '../spring-api/spring-api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private apiService: SpringApiService
  ) {}

  login(user: UserAuth): Observable<any> {
    return this.httpClient
      .post<AuthResponse>(ENDPOINTS.LOGIN, user)
      .pipe(shareReplay());
  }

  logout() {
    this.httpClient.post<AuthResponse>(ENDPOINTS.LOGOUT, {});

    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  setSession(authResult: AuthResponse) {
    const accessToken = authResult.accessToken;
    const decodedToken: DecodedToken = jwt_decode(accessToken);
    const isAdmin = authResult.roles?.includes('ROLE_ADMIN');

    sessionStorage.setItem(SESSION_KEYS.EMAIL, authResult.email);
    sessionStorage.setItem(SESSION_KEYS.USERNAME, authResult.username);
    sessionStorage.setItem(SESSION_KEYS.IS_ADMIN, `${isAdmin}`);
    sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, authResult.refreshToken);
    sessionStorage.setItem(SESSION_KEYS.TOKEN_TYPE, authResult.tokenType);
    sessionStorage.setItem(
      SESSION_KEYS.EXPIRES_AT,
      decodedToken.exp.toString()
    );
  }

  getUserDetails() {
    return this.apiService.getUserDetails();
  }

  setUserDetails(apiResponse: GetUserDetailsResp) {
    const userDetails = apiResponse.response;

    sessionStorage.setItem(SESSION_KEYS.TEAM, userDetails?.team_name || '');
    sessionStorage.setItem(SESSION_KEYS.USER_NAME, userDetails?.name || 'User');
    sessionStorage.setItem(
      SESSION_KEYS.IS_MANAGER,
      `${userDetails?.is_manager || false}`
    );
  }

  getExpirationTime() {
    const expiration = sessionStorage.getItem(SESSION_KEYS.EXPIRES_AT) || 0;
    return Number(expiration) * 1000;
  }

  refreshToken() {
    const refreshToken = sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);
    const request = {
      refreshToken: refreshToken
    };
    const obs = this.httpClient.post<any>(ENDPOINTS.REFRESH_TOKEN, request);

    obs.subscribe((response) => {
      this.setSession(response);
    });

    return obs;
  }

  public isTokenExpired() {
    const currentTimestamp = Date.parse(new Date().toString());
    return this.getExpirationTime() <= currentTimestamp;
  }

  public isLoggedIn(): boolean {
    const accessToken = sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN);

    return accessToken ? true : false;
  }
}
