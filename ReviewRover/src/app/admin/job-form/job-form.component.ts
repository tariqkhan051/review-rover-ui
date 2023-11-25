import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Job } from 'src/models/Jobs';
import {
  getNoWhitespaceValidator,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { TEXT_FIELDS_MAX_LENGTH } from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  id: number;
  loading = false;
  isAddMode = true;
  submitted = false;
  selectedJob: Job;
  description: string;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: SpringApiService,
    private dialogRef: MatDialogRef<JobFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: Job
  ) {
    this.selectedJob = data;
    this.id = this.selectedJob?.id;
    this.isAddMode = !this.id;
    this.description = this.isAddMode ? 'Add Designation' : 'Update Designation';
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
      this.formGroup.patchValue({ name: this.selectedJob.name });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.formGroup.invalid) {
      return;
    }

    this.loading = true;

    if (this.isAddMode) {
      this.addJob();
    } else {
      this.updateJob();
    }
  }

  private addJob() {
    this.apiService
      .addJob(this.formGroup.value)
      .subscribe((data) => {
        if (isSuccessResponse(data)) this.save(this.isAddMode);
      })
      .add(() => (this.loading = false));
  }

  private updateJob() {
    let updatedJob: Job = {
      id: this.id,
      name: this.formGroup.value?.name
    };

    this.apiService
      .editJob(updatedJob)
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
      `Designation ${isAddMode ? 'added' : 'updated'} successfully!`
    );
    this.dialogRef.close(true);
  }

  get name() {
    return this.formGroup.controls['name'];
  }
}
