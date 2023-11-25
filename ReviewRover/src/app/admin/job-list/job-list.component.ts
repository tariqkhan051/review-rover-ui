import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Job } from 'src/models/Jobs';
import {
  getDeleteAlert,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { MESSAGES, PAGINATION_SETTING } from 'src/helpers/constants';
import { JobFormComponent } from '../job-form/job-form.component';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] | undefined;
  dataSource: MatTableDataSource<Job>;
  hidePageSize = PAGINATION_SETTING.HIDE_PAGE_SIZE;
  defaultPageSize = PAGINATION_SETTING.DEFAULT_PAGE_SIZE;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['name', 'actions'];

  constructor(
    private dialog: MatDialog,
    private apiService: SpringApiService
  ) {}

  ngOnInit(): void {
    this.getJobs();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getJobs() {
    this.apiService.getJobs().subscribe((apiResponse) => {
      const jobs = apiResponse.response;
      this.jobs = jobs?.length === 0 ? undefined : jobs;
      this.dataSource = new MatTableDataSource(this.jobs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteJob(job: Job) {
    getDeleteAlert().then((result) => {
      if (result.isConfirmed) {
        const jobToDelete = this.jobs?.find((x) => x.id === job.id);
        if (!jobToDelete) return;

        jobToDelete.isDeleting = true;
        this.apiService.deleteJob(jobToDelete).subscribe((apiResponse) => {
          if (isSuccessResponse(apiResponse)) {
            getSuccessAlert(MESSAGES.DESIGNATION_DELETED);
            this.ngOnInit();
          }
          jobToDelete.isDeleting = false;
        });
      }
    });
  }

  openJobModal(job?: Job) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = job;
    dialogConfig.width = '30%';

    const dialogRef = this.dialog.open(JobFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.ngOnInit();
      }
    });
  }

  applyFilter(event: EventTarget | null) {
    const filterValue =
      (event as HTMLInputElement)?.value || ''?.trim()?.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
