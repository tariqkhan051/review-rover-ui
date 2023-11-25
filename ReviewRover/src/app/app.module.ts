import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { ReviewComponent } from './user/review/review.component';
import { LoginComponent } from './shared/login/login.component';
import { RandomComponent } from './user/random/random.component';
import { JobListComponent } from './admin/job-list/job-list.component';
import { JobFormComponent } from './admin/job-form/job-form.component';
import { TeamListComponent } from './admin/team-list/team-list.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { TeamFormComponent } from './admin/team-form/team-form.component';
import { SelfReviewComponent } from './user/self-review/self-review.component';
import { FieldErrorComponent } from './shared/field-error/field-error.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { ManageReviewsComponent } from './shared/manage-reviews/manage-reviews.component';
import { UserRateChartComponent } from './admin/user-rate-chart/user-rate-chart.component';
import { AuthInterceptor } from './services/auth-interceptor/auth-interceptor.interceptor';
import { TeamRateChartComponent } from './admin/team-rate-chart/team-rate-chart.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserTeamReviewComponent } from './user/user-team-review/user-team-review.component';
import { MonthYearPickerComponent } from './shared/month-year-picker/month-year-picker.component';
import { AdminHomeScreenComponent } from './admin/admin-home-screen/admin-home-screen.component';
import { TopRankingUsersComponent } from './admin/top-ranking-users/top-ranking-users.component';
import { TeamYearlyPerfChartComponent } from './admin/team-yearly-perf-chart/team-yearly-perf-chart.component';
import { TeamMonthlyPerfChartComponent } from './admin/team-monthly-perf-chart/team-monthly-perf-chart.component';
import { MatSortModule } from '@angular/material/sort';
import { DepartmentListComponent } from './admin/department-list/department-list.component';
import { DepartmentFormComponent } from './admin/department-form/department-form.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { DepartmentYearlyPerfChartComponent } from './admin/department-yearly-perf-chart/department-yearly-perf-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReviewComponent,
    RandomComponent,
    SearchFilterPipe,
    JobFormComponent,
    JobListComponent,
    UserFormComponent,
    TeamFormComponent,
    UserListComponent,
    TeamListComponent,
    SelfReviewComponent,
    TeamRateChartComponent,
    UserDashboardComponent,
    UserRateChartComponent,
    ManageReviewsComponent,
    AdminDashboardComponent,
    UserTeamReviewComponent,
    MonthYearPickerComponent,
    AdminHomeScreenComponent,
    TopRankingUsersComponent,
    TeamMonthlyPerfChartComponent,
    TeamYearlyPerfChartComponent,
    FieldErrorComponent,
    DepartmentListComponent,
    DepartmentFormComponent,
    NotFoundComponent,
    DepartmentYearlyPerfChartComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatSortModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialExampleModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
