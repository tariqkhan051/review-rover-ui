import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth-service.service';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';
import { APP_TITLE, SESSION_KEYS } from 'src/helpers/constants';
import { getInitials } from 'src/helpers/utils';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  title = APP_TITLE;
  username: string | null;
  initials: string | undefined;
  pendingApprovalCount = 0;

  constructor(
    private authService: AuthService,
    private apiService: SpringApiService
  ) {
    this.username = sessionStorage.getItem(SESSION_KEYS.USER_NAME) || 'Admin';
    this.initials = getInitials(this.username);
    this.apiService
      .getPendingApprovalsForAdmin()
      .subscribe(
        (apiResponse) =>
          (this.pendingApprovalCount = apiResponse.response.length)
      );
  }

  logout() {
    this.authService.logout();
  }
}
