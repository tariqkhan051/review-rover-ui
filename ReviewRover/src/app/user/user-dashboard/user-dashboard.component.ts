import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth-service.service';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';
import { APP_TITLE, SESSION_KEYS } from 'src/helpers/constants';
import { getInitials } from 'src/helpers/utils';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  title = APP_TITLE;
  isManager = false;
  showFiller = false;
  selectedUser: string | null;
  selectedTeam: string | null;
  selectedUserName: string | null;
  initials: string | undefined;
  userState: any;
  pendingReviewsCount = 0;
  pendingApprovalCount = 0;

  constructor(
    private authService: AuthService,
    private apiService: SpringApiService
  ) {
    this.setValues();
    if (this.isManager) {
      this.apiService
        .getPendingApprovalsForManager()
        .subscribe(
          (apiResponse) =>
            (this.pendingApprovalCount = apiResponse.response.length)
        );
    }
    this.apiService
      .getPendingReviewsForUser()
      .subscribe(
        (apiResponse) =>
          (this.pendingReviewsCount = apiResponse.response?.reviews.length)
      );
  }

  setValues() {
    this.selectedUser = sessionStorage.getItem(SESSION_KEYS.USER_NAME);
    this.selectedTeam = sessionStorage.getItem(SESSION_KEYS.TEAM);
    this.selectedUserName = sessionStorage.getItem(SESSION_KEYS.USERNAME);
    this.isManager =
      sessionStorage.getItem(SESSION_KEYS.IS_MANAGER)?.toLowerCase() === 'true';
    this.initials = getInitials(this.selectedUser);
  }

  openLink(link: string) {
    sessionStorage.clear();
    window.open(link, '_self');
  }

  logout() {
    this.authService.logout();
  }
}
