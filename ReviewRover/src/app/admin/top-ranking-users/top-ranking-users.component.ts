import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { isSuccessResponse } from 'src/helpers/utils';
import { PAGINATION_SETTING } from 'src/helpers/constants';
import { RankObj } from 'src/models/User';
import { RatingDate } from 'src/models/RatingDate';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';

@Component({
  selector: 'app-top-ranking-users',
  templateUrl: './top-ranking-users.component.html',
  styleUrls: ['./top-ranking-users.component.css']
})
export class TopRankingUsersComponent {
  topRankedUsers: RankObj[] | undefined;
  @Input() reviewType: string;
  @Input() selectedDate: RatingDate;
  dataSource: MatTableDataSource<RankObj>;
  hidePageSize = PAGINATION_SETTING.HIDE_PAGE_SIZE;
  defaultPageSize = PAGINATION_SETTING.DEFAULT_PAGE_SIZE;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['rank', 'name', 'team_name', 'score'];

  constructor(private apiService: SpringApiService) {}

  ngOnInit(): void {
    this.getTopRankedUsers();
  }

  ngOnChanges() {
    this.getTopRankedUsers();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getTopRankedUsers() {
    this.apiService
      .getTopRankingUsers(this.selectedDate, this.reviewType)
      .subscribe((response) => {
        if (isSuccessResponse(response)) {
          this.topRankedUsers = response.response || undefined;
          this.setDataSource();
        }
      });
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource(this.topRankedUsers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: EventTarget | null) {
    const filterValue = (event as HTMLInputElement)?.value
      ?.trim()
      ?.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
