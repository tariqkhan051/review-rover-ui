import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User, UserDisplay } from 'src/models/User';
import {
  getDeleteAlert,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { MESSAGES, PAGINATION_SETTING } from 'src/helpers/constants';
import { UserFormComponent } from '../user-form/user-form.component';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] | undefined;
  dataSource: MatTableDataSource<UserDisplay>; //not using User model due to issue in sorting
  hidePageSize = PAGINATION_SETTING.HIDE_PAGE_SIZE;
  defaultPageSize = PAGINATION_SETTING.DEFAULT_PAGE_SIZE;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'name',
    'username',
    'job_name',
    'manager_name',
    'team_name',
    'is_live',
    'actions'
  ];

  constructor(public dialog: MatDialog, private apiService: SpringApiService) {}

  ngOnInit() {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getAllUsers() {
    this.apiService.getUsers().subscribe((apiResponse) => {
      const users = apiResponse.response;
      this.users = users?.length === 0 ? undefined : users;
      const displayData: UserDisplay[] | undefined = this.users?.map((user) => {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          team_name: user.team.name,
          manager_name: user.manager?.name || '',
          job_name: user.job?.name || '',
          is_live: user.isLive || false
        };
      });

      this.dataSource = new MatTableDataSource(displayData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteUser(displayUser: UserDisplay) {
    getDeleteAlert(MESSAGES.DELETE_USER_MESSAGE).then((result) => {
      if (result.isConfirmed) {
        const userToDelete = this.users?.find((x) => x.id === displayUser.id);
        if (!userToDelete) return;

        displayUser.isDeleting = true;
        this.apiService.deleteUser(userToDelete).subscribe((apiResponse) => {
          if (isSuccessResponse(apiResponse)) {
            getSuccessAlert(MESSAGES.USER_DELETED);
            this.ngOnInit();
          }
          displayUser.isDeleting = false;
        });
      }
    });
  }

  openUserModal(user?: UserDisplay) {
    const dialogConfig = new MatDialogConfig();
    const userToUpdate = this.users?.find((x) => x.id === user?.id);

    dialogConfig.autoFocus = true;
    dialogConfig.data = userToUpdate;
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(UserFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.ngOnInit();
      }
    });
  }

  applyFilter(event: EventTarget | null) {
    const filterValue = (event as HTMLInputElement)?.value
      ?.trim()
      ?.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
