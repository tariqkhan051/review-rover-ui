import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Team, TeamDisplay } from 'src/models/Team';
import {
  getDeleteAlert,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { MESSAGES, PAGINATION_SETTING } from 'src/helpers/constants';
import { TeamFormComponent } from '../team-form/team-form.component';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  teams: Team[] | undefined;
  dataSource: MatTableDataSource<TeamDisplay>;
  hidePageSize = PAGINATION_SETTING.HIDE_PAGE_SIZE;
  defaultPageSize = PAGINATION_SETTING.DEFAULT_PAGE_SIZE;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['name', 'department_name', 'actions'];

  constructor(
    private dialog: MatDialog,
    private apiService: SpringApiService
  ) {}

  ngOnInit() {
    this.getTeams();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getTeams() {
    this.apiService.getTeams().subscribe((apiResponse) => {
      const teams = apiResponse.response;
      this.teams = teams?.length === 0 ? undefined : teams;
      const displayData: TeamDisplay[] | undefined = this.teams?.map((team) => {
        return {
          id: team.id,
          name: team.name,
          department_name: team.department?.name || ''
        };
      });
      
      this.dataSource = new MatTableDataSource(displayData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteTeam(displayTeam: TeamDisplay) {
    getDeleteAlert().then((result) => {
      if (result.isConfirmed) {
        const teamToDelete = this.teams?.find((x) => x.id === displayTeam.id);
        if (!teamToDelete) return;

        displayTeam.isDeleting = true;
        this.apiService.deleteTeam(teamToDelete).subscribe((apiResponse) => {
          if (isSuccessResponse(apiResponse)) {
            getSuccessAlert(MESSAGES.TEAM_DELETED);
            this.ngOnInit();
          }
          displayTeam.isDeleting = false;
        });
      }
    });
  }

  openTeamModal(team?: TeamDisplay) {
    const dialogConfig = new MatDialogConfig();
    const teamToUpdate = this.teams?.find((x) => x.id === team?.id);

    dialogConfig.autoFocus = true;
    dialogConfig.data = teamToUpdate;
    dialogConfig.width = '30%';

    const dialogRef = this.dialog.open(TeamFormComponent, dialogConfig);

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
