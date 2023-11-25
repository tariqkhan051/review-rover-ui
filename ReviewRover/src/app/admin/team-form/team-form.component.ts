import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from 'src/models/Team';
import {
  getNoWhitespaceValidator,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { SpringApiService } from '../../services/spring-api/spring-api.service';
import { Department } from 'src/models/Department';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  loading = false;
  submitted = false;
  selectedTeam: Team;
  isAddMode!: boolean;
  description: string;
  formGroup!: FormGroup;
  departments: Department[];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: SpringApiService,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: Team
  ) {
    this.selectedTeam = data;
    this.isAddMode = !this.selectedTeam?.name;
    this.description = this.isAddMode ? 'Add Team' : 'Update Team';
  }

  ngOnInit(): void {
    this.apiService
      .getDepartments()
      .subscribe(
        (apiResponse) =>
          (this.departments = apiResponse.response.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          ))
      );

    this.formGroup = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z\s]+$/),
          getNoWhitespaceValidator()
        ])
      ],
      department_id: [-1, [Validators.nullValidator]]
    });

    if (!this.isAddMode) {
      this.formGroup.patchValue({
        name: this.selectedTeam.name,
        department_id: this.selectedTeam.department?.id
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createTeam();
    } else {
      this.updateTeam();
    }
  }

  private createTeam() {
    this.apiService
      .addTeam(this.formGroup.value)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  private updateTeam() {
    let updatedTeam: Team = {
      id: this.selectedTeam.id,
      name: this.formGroup.value?.name,
      department_id: this.formGroup.value?.department_id
    };

    this.apiService
      .editTeam(updatedTeam)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  close() {
    this.dialogRef.close();
  }

  save(isAddMode: boolean) {
    getSuccessAlert(`Team ${isAddMode ? 'added' : 'updated'} successfully!`);
    this.dialogRef.close(true);
  }

  get name() {
    return this.formGroup.controls['name'];
  }
}
