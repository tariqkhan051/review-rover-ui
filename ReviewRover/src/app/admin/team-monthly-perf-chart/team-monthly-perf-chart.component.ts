import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { FONT_FAMILY, FONT_SIZE, MONTHS } from 'src/helpers/constants';
import { RatingDate } from 'src/models/RatingDate';
import { UserReview } from 'src/models/Review';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-team-monthly-perf-chart',
  templateUrl: './team-monthly-perf-chart.component.html',
  styleUrls: ['./team-monthly-perf-chart.component.css']
})
export class TeamMonthlyPerfChartComponent {
  ratingChart: any;
  canvas: any;
  ctx: any;
  @ViewChild('teamMonthlyChart') teamMonthlyChart: ElementRef;
  @Input() teamSelected: string;
  @Input() selectedDate: RatingDate;
  @Input() reviewType: string;
  allUsers: string[];

  constructor(private apiService: SpringApiService) {}

  ngOnChanges() {
    if (this.teamSelected || this.reviewType || this.selectedDate) {
      this.allUsers = [];
      this.getTeamScores();
    }
  }

  getTeamScores() {
    if (this.teamSelected?.trim()?.length > 0) {
      this.apiService.getUsers(this.teamSelected).subscribe((apiResponse) => {
        this.allUsers = apiResponse.response?.map((user) => {
          return user.name;
        });
        this.apiService
          .getTeamScores(
            this.teamSelected,
            this.selectedDate,
            false,
            this.reviewType
          )
          .subscribe((apiResponse) => {
            let dataSet = this.getDataSet(
              this.getDataObj(apiResponse.response.reviews ?? [])
            );
            this.createChart(dataSet);
          });
      });
    }
  }

  getDataObj(reviewsResponse: UserReview[]) {
    let allUsersWithScores: any = {};

    if (this.allUsers) {
      for (const user of this.allUsers) {
        let scores = [];
        for (let i = 0; i < 12; i++) {
          scores.push(0);
        }

        allUsersWithScores[user] = scores;
      }

      for (var review of reviewsResponse) {
        for (var user of review.users) {
          if (Object.keys(allUsersWithScores).includes(user.name)) {
            allUsersWithScores[user.name][review.month - 1] = user.score;
          } else {
            allUsersWithScores[user.name] = [user.score];
          }
        }
      }
    }
    return allUsersWithScores;
  }

  getDataSet(dataSet: any) {
    let dataArray = [];
    if (dataSet) {
      for (var [key, val] of Object.entries(dataSet)) {
        dataArray.push({
          label: key,
          data: val
          //to use hardcoded colors in case of more than 7 users
          // backgroundColor: CHART_COLORS[dataArray.length].DARK,
          // borderColor: CHART_COLORS[dataArray.length].DARK
        });
      }
    }

    return dataArray;
  }

  createChart(dataSet: any) {
    this.ratingChart?.destroy();
    this.canvas = this.teamMonthlyChart?.nativeElement;
    this.ctx = this.canvas?.getContext('2d');

    if (this.ctx) {
      Chart.defaults.font.size = FONT_SIZE;
      Chart.defaults.font.family = FONT_FAMILY;

      this.ratingChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: MONTHS,
          datasets: dataSet
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
  }
}
