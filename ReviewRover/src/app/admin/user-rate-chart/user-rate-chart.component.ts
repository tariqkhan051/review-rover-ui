import { Chart, registerables } from 'chart.js';
import { Component, Input } from '@angular/core';
import { RatingDate } from 'src/models/RatingDate';
import { User } from 'src/models/User';
import {
  CHART_THEME_COLOR_DARK,
  CHART_THEME_COLOR_LIGHT,
  FONT_FAMILY,
  FONT_SIZE
} from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

Chart.register(...registerables);

@Component({
  selector: 'app-user-rate-chart',
  templateUrl: './user-rate-chart.component.html',
  styleUrls: ['./user-rate-chart.component.css']
})
export class UserRateChartComponent {
  @Input() reviewType: string;
  @Input() selectedUser: User;
  @Input() selectedDate: RatingDate;
  @Input() selectedTeam: string;
  positivesArr: string[] = [];
  negativesArr: string[] = [];
  userGoodQualities: string[];
  userBadQualities: string[];
  userScore: number = 0;
  totalScore: number = 100;
  ratingChart: any;
  positives: any = {};
  negatives: any = {};

  constructor(private service: SpringApiService) {}

  ngOnChanges() {
    if (this.selectedTeam || this.selectedUser || this.reviewType) {
      this.getScore(this.selectedDate);
    }
  }

  getScore(ratingDate: RatingDate) {
    this.service
      .getUserScore(
        this.selectedUser?.username,
        this.selectedTeam,
        ratingDate,
        true,
        this.reviewType
      )
      .subscribe((apiResponse) => {
        this.positives = {};
        this.negatives = {};

        const selectedMonthsReview = apiResponse.response.reviews[0];
        this.userScore = Number(selectedMonthsReview?.score) || 0;
        this.userGoodQualities = selectedMonthsReview?.good_quality || [];
        this.userBadQualities = selectedMonthsReview?.bad_quality || [];

        this.getQualityCount(this.negatives, this.userBadQualities);
        this.getQualityCount(this.positives, this.userGoodQualities);
        this.positivesArr = Object.keys(this.positives);
        this.negativesArr = Object.keys(this.negatives);

        this.createUserScoreChart(
          this.userScore,
          this.totalScore - this.userScore,
          this.selectedUser?.name || ''
        );
      });
  }

  createUserScoreChart(score: number, difference: number, userName: string) {
    this.ratingChart?.destroy();

    Chart.defaults.font.size = FONT_SIZE;
    Chart.defaults.font.family = FONT_FAMILY;

    this.ratingChart = new Chart('userRateChart', {
      type: 'pie',
      data: {
        labels: [`${userName}'s Score`, 'Difference'],
        datasets: [
          {
            data: [score, difference],
            borderColor: [CHART_THEME_COLOR_DARK, CHART_THEME_COLOR_LIGHT],
            backgroundColor: ['rgba(4, 51, 109, 0.6)', 'rgba(4, 51, 109, 0.2)'],
            hoverOffset: 4
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            onClick: function (e) {}
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  getQualityCount(responseObj: any, arr: string[]) {
    for (var str of arr) {
      const key = str.trim();
      if (key.length > 0) {
        responseObj[key] = responseObj[key] ? responseObj[key] + 1 : 1;
      }
    }
  }
}
