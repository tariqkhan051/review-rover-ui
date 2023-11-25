import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from 'src/models/Jobs';
import { Team } from 'src/models/Team';
import { User } from 'src/models/User';
import {
  getNoWhitespaceValidator,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { MESSAGES, TEXT_FIELDS_MAX_LENGTH } from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  jobs: Job[];
  users: User[];
  teams!: Team[];
  loading = false;
  isActive = true;
  isAddMode = true;
  submitted = false;
  selectedUser: User;
  hidePassword = true;
  description: string;
  formGroup: FormGroup;
  passwordTooltip = MESSAGES.PASSWORD_TOOLTIP;

  constructor(
    private fb: FormBuilder,
    private apiService: SpringApiService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: User
  ) {
    this.selectedUser = data;
    this.isAddMode = !this.selectedUser;
    this.description = this.isAddMode ? 'Add User' : 'Update User';
  }

  ngOnInit() {
    this.apiService.getTeams().subscribe((apiResponse) => {
      this.teams = apiResponse.response.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      this.apiService.getUsers().subscribe((apiResponse) => {
        this.users = apiResponse.response.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

        if (!this.isAddMode) {
          this.users = this.users.filter(
            (u) => u.username !== this.selectedUser.username
          );
        }
      });

      this.apiService
        .getJobs()
        .subscribe(
          (apiResponse) =>
            (this.jobs = apiResponse.response.sort((a, b) =>
              a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            ))
        );
    });

    const validators = [
      Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
      Validators.pattern(/^[A-Za-z\s]+$/)
    ];

    const requiredValidator = validators.concat(
      Validators.required,
      getNoWhitespaceValidator()
    );

    this.formGroup = this.fb.group({
      name: ['', this.isAddMode ? requiredValidator : validators],
      job_name: [
        '',
        this.isAddMode
          ? [
              Validators.required,
              Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
              Validators.pattern(/^[A-Za-z\s.]+$/)
            ]
          : [
              Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
              Validators.pattern(/^[A-Za-z\s.]+$/)
            ]
      ],
      team_name: ['', this.isAddMode ? requiredValidator : validators],
      manager_name: [
        '',
        [
          Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
          Validators.pattern(/^[A-Za-z\s]+$/)
        ]
      ],
      email: [
        '',
        this.isAddMode
          ? [Validators.nullValidator, Validators.required, Validators.email]
          : [Validators.nullValidator, Validators.email]
      ],
      username: [
        '',
        this.isAddMode
          ? [
              Validators.nullValidator,
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
              Validators.pattern(/^[A-Za-z0-9_]+$/)
            ]
          : [
              Validators.nullValidator,
              Validators.minLength(3),
              Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
              Validators.pattern(/^[A-Za-z0-9_]+$/)
            ]
      ],
      password: [
        '',
        this.isAddMode
          ? [
              Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
              Validators.required
            ]
          : [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]
      ]
    });

    if (!this.isAddMode) {
      this.isActive = this.selectedUser.isLive || false;
      this.formGroup.patchValue(this.selectedUser);
      this.formGroup.patchValue({ team_name: this.selectedUser.team?.name });
      this.formGroup.patchValue({
        manager_name: this.selectedUser.manager?.username
      });
      this.formGroup.patchValue({
        job_name: this.selectedUser.job?.name
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    this.loading = true;
    this.formGroup.value.is_live = this.isActive;

    if (this.isAddMode) {
      this.addUser();
    } else {
      this.updateUser();
    }
  }

  private addUser() {
    this.apiService
      .addUser(this.formGroup.value)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  private updateUser() {
    const req = this.formGroup.value;
    req.manager_name = req.manager_name ? req.manager_name : null;

    this.apiService
      .editUser(req, this.selectedUser.username)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  close() {
    this.dialogRef.close();
  }

  save(isAddMode: boolean) {
    getSuccessAlert(`User ${isAddMode ? 'added' : 'updated'} successfully!`);
    this.dialogRef.close(true);
  }

  //#region FORM FIELD GETTERS
  get name() {
    return this.getFormControl('name');
  }

  get email() {
    return this.getFormControl('email');
  }

  get job_name() {
    return this.getFormControl('job_name');
  }

  get team_name() {
    return this.getFormControl('team_name');
  }

  get manager_name() {
    return this.getFormControl('manager_name');
  }

  get username() {
    return this.getFormControl('username');
  }

  get password() {
    return this.getFormControl('password');
  }

  getFormControl(key: string) {
    return this.formGroup.controls[key];
  }
  //#endregion
}
