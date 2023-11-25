import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';
import { PAGINATION_SETTING, MESSAGES } from 'src/helpers/constants';
import {
  getDeleteAlert,
  isSuccessResponse,
  getSuccessAlert
} from 'src/helpers/utils';
import { Department } from 'src/models/Department';
import { DepartmentFormComponent } from '../department-form/department-form.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent {
  departments: Department[] | undefined;
  dataSource: MatTableDataSource<Department>;
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
    this.getDepartments();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getDepartments() {
    this.apiService.getDepartments().subscribe((apiResponse) => {
      const departments = apiResponse.response;
      this.departments = departments?.length === 0 ? undefined : departments;
      this.dataSource = new MatTableDataSource(this.departments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteDepartment(dept: Department) {
    getDeleteAlert().then((result) => {
      if (result.isConfirmed) {
        const departmentToDelete = this.departments?.find(
          (x) => x.id === dept.id
        );
        if (!departmentToDelete) return;

        departmentToDelete.isDeleting = true;
        this.apiService
          .deleteDepartment(departmentToDelete)
          .subscribe((apiResponse) => {
            if (isSuccessResponse(apiResponse)) {
              getSuccessAlert(MESSAGES.DEPARTMENT_DELETED);
              this.ngOnInit();
            }
            departmentToDelete.isDeleting = false;
          });
      }
    });
  }

  openDepartmentModal(dept?: Department) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = dept;
    dialogConfig.width = '30%';

    const dialogRef = this.dialog.open(DepartmentFormComponent, dialogConfig);

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
