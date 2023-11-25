import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MESSAGES, SESSION_KEYS } from 'src/helpers/constants';
import { AuthService } from 'src/app/services/auth-service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fg: FormGroup;
  hidePassword = true;
  errorMsg: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.clearError();
    sessionStorage.clear();
    this.fg = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  clearError() {
    this.errorMsg = '';
  }

  onSubmit() {
    if (this.fg.valid) {
      const values = this.fg.getRawValue();

      this.authService
        .login(values)
        .pipe(
          catchError((error) => {
            this.errorMsg =
              error.error.message === 'Bad credentials'
                ? MESSAGES.INVALID_USERNAME_PASSWORD
                : error.error.message ?? MESSAGES.ERROR_FROM_API;
            return '';
          })
        )
        .subscribe((res) => {
          if (res.accessToken) {
            this.authService.setSession(res);

            this.authService.getUserDetails().subscribe((res) => {
              this.authService.setUserDetails(res);
              this.errorMsg = '';
              const isAdmin =
                sessionStorage.getItem(SESSION_KEYS.IS_ADMIN) === 'true';

              if (isAdmin) {
                this.router.navigateByUrl('/admin/home');
              } else {
                this.router.navigateByUrl('/user/rating');
              }
            });
          }
        });
    }
  }
}
