import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/user-auth/auth.guard';
import { ReviewComponent } from './user/review/review.component';
import { RandomComponent } from './user/random/random.component';
import { LoginComponent } from './shared/login/login.component';
import { JobListComponent } from './admin/job-list/job-list.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { TeamListComponent } from './admin/team-list/team-list.component';
import { AdminAuthGuard } from './services/admin-auth/admin-auth.guard';
import { SelfReviewComponent } from './user/self-review/self-review.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { ManageReviewsComponent } from './shared/manage-reviews/manage-reviews.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserTeamReviewComponent } from './user/user-team-review/user-team-review.component';
import { AdminHomeScreenComponent } from './admin/admin-home-screen/admin-home-screen.component';
import { DepartmentListComponent } from './admin/department-list/department-list.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    children: [
      { path: '', redirectTo: 'review', pathMatch: 'full' },
      {
        path: 'review',
        component: ReviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'random',
        component: RandomComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rating',
        component: UserTeamReviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'self-rating',
        component: SelfReviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manageReviews',
        component: ManageReviewsComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: AdminHomeScreenComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'teams',
        component: TeamListComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'manageReviews',
        component: ManageReviewsComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'jobs',
        component: JobListComponent,
        canActivate: [AdminAuthGuard]
      },
      {
        path: 'departments',
        component: DepartmentListComponent,
        canActivate: [AdminAuthGuard]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
