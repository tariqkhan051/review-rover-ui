import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PendingReviews, UpdateReviewStatusReq } from 'src/models/Review';
import {
  MESSAGES,
  PAGINATION_SETTING,
  SESSION_KEYS
} from 'src/helpers/constants';
import {
  getErrorAlert,
  getSuccessAlert,
  isSuccessResponse
} from 'src/helpers/utils';
import { SpringApiService } from '../../services/spring-api/spring-api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.css']
})
export class ManageReviewsComponent implements OnInit {
  reviewRecords: PendingReviews[] | undefined;
  dataSource: MatTableDataSource<any>;
  hidePageSize = PAGINATION_SETTING.HIDE_PAGE_SIZE;
  defaultPageSize = PAGINATION_SETTING.DEFAULT_PAGE_SIZE;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<PendingReviews>(true, []);
  allColumns = [
    'checkbox',
    'user',
    'team_name',
    'month',
    'year',
    'created_on',
    'title',
    'description',
    'actions'
  ];
  displayedColumns = this.allColumns;
  displayedCol = [
    'user',
    'team_name',
    'month',
    'year',
    'created_on',
    'title',
    'description'
  ];
  loading = false;
  options = [{ name: 'Pending' }, { name: 'Approved' }, { name: 'Rejected' }];
  isAdmin: boolean;

  constructor(private service: SpringApiService) {}

  ngOnInit() {
    this.isAdmin = sessionStorage.getItem(SESSION_KEYS.IS_ADMIN) === 'true';
    if (this.isAdmin) {
      this.getReviewsForAdminApproval();
    } else {
      this.getReviewsForManagerApproval();
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getReviewsForAdminApproval() {
    this.service.getPendingApprovalsForAdmin().subscribe((apiResponse) => {
      const reviews = apiResponse.response;
      this.reviewRecords = reviews?.length === 0 ? undefined : reviews;
      this.displayedColumns = this.allColumns;
      this.setDataSource();
    });
  }

  getOtherReviewsForAdmin(status: string) {
    this.service.getOtherReviewsForAdmin(status).subscribe((apiResponse) => {
      const reviews = apiResponse.response;
      this.reviewRecords = reviews?.length === 0 ? undefined : reviews;
      this.displayedColumns = this.displayedCol;
      this.setDataSource();
    });
  }

  getReviewsForManagerApproval() {
    this.service.getPendingApprovalsForManager().subscribe((apiResponse) => {
      const reviews = apiResponse.response;
      this.reviewRecords = reviews?.length === 0 ? undefined : reviews;
      this.displayedColumns = this.allColumns;
      this.setDataSource();
    });
  }

  getOtherReviewsForManager(status: string) {
    this.service.getOtherReviewsForManager(status).subscribe((apiResponse) => {
      const reviews = apiResponse.response;
      this.reviewRecords = reviews?.length === 0 ? undefined : reviews;
      this.displayedColumns = this.displayedCol;
      this.setDataSource();
    });
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource(this.reviewRecords);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateReviewStatus(id: number, status: string) {
    const req: UpdateReviewStatusReq[] = [this.getUpdateRequest(id, status)];

    this.service
      .updateReviewStatus(
        req,
        sessionStorage.getItem(SESSION_KEYS.IS_MANAGER) === 'true'
      )
      .subscribe((apiResponse) => {
        if (isSuccessResponse(apiResponse)) {
          getSuccessAlert(MESSAGES.REVIEW_STATUS_UPDATED);
          this.ngOnInit();
        }
      });
  }

  updateSelectedRows(status: string) {
    if (this.selection.selected.length > 0) {
      this.loading = true;

      const req: UpdateReviewStatusReq[] = this.selection.selected.map(
        (review) => {
          return this.getUpdateRequest(review.id, status);
        }
      );

      this.service
        .updateReviewStatus(
          req,
          sessionStorage.getItem(SESSION_KEYS.IS_MANAGER) === 'true'
        )
        .subscribe((apiResponse) => {
          if (isSuccessResponse(apiResponse)) {
            this.loading = false;
            getSuccessAlert(MESSAGES.REVIEW_STATUS_UPDATED);
            this.selection.clear();
            this.ngOnInit();
          }
        });
    } else {
      getErrorAlert('Please select the records to update.');
    }
  }

  applyFilter(event: EventTarget | null) {
    const filterValue = (event as HTMLInputElement)?.value
      ?.trim()
      ?.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const selectedRowsCount = this.selection.selected.length;
    const totalRowCount = this.dataSource?.data?.length;
    return selectedRowsCount === totalRowCount;
  }

  toggleAllRows() {
    const selectedRowsCount = this.selection.selected.length;
    const filteredData = this.dataSource.filteredData;

    if (selectedRowsCount > 0) {
      this.selection.clear();
      return;
    } else {
      filteredData.length > 0
        ? this.selection.select(...filteredData)
        : this.selection.select(...this.dataSource.data);
    }

    return;
  }

  onStatusChange($event: MatTabChangeEvent) {
    const type = this.options[$event.index].name.toLowerCase();

    switch (type) {
      case 'approved':
      case 'rejected':
        this.isAdmin
          ? this.getOtherReviewsForAdmin(type)
          : this.getOtherReviewsForManager(type);
        return;
      default:
        this.ngOnInit();
        return;
    }
  }

  getUpdateRequest(id: number, status: string) {
    const req: UpdateReviewStatusReq = {
      id,
      status
    };

    return req;
  }
}
