import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';
import { TEXT_FIELDS_MAX_LENGTH } from 'src/helpers/constants';
import {
  getNoWhitespaceValidator,
  isSuccessResponse,
  getSuccessAlert
} from 'src/helpers/utils';
import { Department } from 'src/models/Department';
import { JobFormComponent } from '../job-form/job-form.component';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent {
  id: number;
  loading = false;
  isAddMode = true;
  submitted = false;
  selectedDepartment: Department;
  description: string;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: SpringApiService,
    private dialogRef: MatDialogRef<JobFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: Department
  ) {
    this.selectedDepartment = data;
    this.id = this.selectedDepartment?.id;
    this.isAddMode = !this.id;
    this.description = this.isAddMode ? 'Add Department' : 'Update Department';
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
          Validators.pattern(/^[A-Za-z\s.]+$/),
          getNoWhitespaceValidator()
        ])
      ]
    });

    if (!this.isAddMode) {
      this.formGroup.patchValue({ name: this.selectedDepartment.name });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.formGroup.invalid) {
      return;
    }

    this.loading = true;

    if (this.isAddMode) {
      this.addDepartment();
    } else {
      this.updateDepartment();
    }
  }

  private addDepartment() {
    this.apiService
      .addDepartment(this.formGroup.value)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  private updateDepartment() {
    let updatedJob: Department = {
      id: this.id,
      name: this.formGroup.value?.name
    };

    this.apiService
      .editDepartment(updatedJob)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  close() {
    this.dialogRef.close();
  }

  save(isAddMode: boolean) {
    getSuccessAlert(
      `Department ${isAddMode ? 'added' : 'updated'} successfully!`
    );
    this.dialogRef.close(true);
  }

  get name() {
    return this.formGroup.controls['name'];
  }
}
