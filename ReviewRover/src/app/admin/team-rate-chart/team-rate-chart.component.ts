import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { User } from 'src/models/User';
import { RatingDate } from 'src/models/RatingDate';
import { FONT_FAMILY, FONT_SIZE, MONTHS } from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';
import { UserReview } from 'src/models/Review';

Chart.register(...registerables);

@Component({
  selector: 'app-team-rate-chart',
  templateUrl: './team-rate-chart.component.html',
  styleUrls: ['./team-rate-chart.component.css']
})
export class TeamRateChartComponent {
  ratingChart: any;
  canvas: any;
  ctx: any;
  @ViewChild('teamMonthChart') teamMonthChart: ElementRef;
  teamMembers: User[] = [];
  selectedYear: number;
  @Input() reviewType: string;
  @Input() selectedTeam: string;
  @Input() selectedDate: RatingDate;

  constructor(private service: SpringApiService) {}

  ngOnChanges() {
    if (this.selectedTeam) {
      this.getTeamScores(this.selectedDate);
    }
  }

  getTeamScores(ratingDate: RatingDate) {
    this.selectedYear = ratingDate.year;

    this.service
      .getTeamScores(this.selectedTeam, ratingDate, true, this.reviewType)
      .subscribe((apiResponse) => {
        let dataSet = this.getDataSet(
          this.getDataObj(apiResponse.response.reviews ?? [])
        );
        this.createChart(dataSet);
      });
  }

  getDataObj(reviewsResponse: UserReview[]) {
    let allUsersWithScores: any = {};

    for (var review of reviewsResponse) {
      for (var user of review.users) {
        if (Object.keys(allUsersWithScores).includes(user.name)) {
          allUsersWithScores[user.name][review.month - 1] = user.score;
        } else {
          allUsersWithScores[user.name] = [user.score];
        }
      }
      for (var addedUser in allUsersWithScores) {
        if (allUsersWithScores[addedUser].length < review.month) {
          allUsersWithScores[addedUser][review.month - 1] = 0;
        }
      }
    }

    return allUsersWithScores;
  }

  getDataSet(dataSet: any) {
    let dataArray = [];
    for (var [key, val] of Object.entries(dataSet)) {
      dataArray.push({
        label: key,
        data: val,
        maxBarThickness: 25
        //to use hardcoded colors in case of more than 7 teams
        // backgroundColor: CHART_COLORS[dataArray.length].DARK,
        // borderColor: CHART_COLORS[dataArray.length].DARK
      });
    }

    return dataArray;
  }

  createChart(dataset: any) {
    this.ratingChart?.destroy();
    this.canvas = this.teamMonthChart?.nativeElement;
    this.ctx = this.canvas?.getContext('2d');

    if (this.ctx) {
      Chart.defaults.font.size = FONT_SIZE;
      Chart.defaults.font.family = FONT_FAMILY;

      this.ratingChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: MONTHS.slice(
            this.selectedDate.month - 1,
            this.selectedDate.month
          ),
          datasets: dataset
        },
        options: {
          plugins: {
            legend: {
              // onClick: function (e) {}
            }
          },
          responsive: true,
          scales: {
            y: {
              max: 100,
              display: true,
              beginAtZero: true
            },
            x: {
              display: true,
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
