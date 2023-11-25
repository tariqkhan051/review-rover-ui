import { Chart } from 'chart.js';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/User';
import { Team } from 'src/models/Team';
import { UserReview } from 'src/models/Review';
import { RatingDate } from 'src/models/RatingDate';
import {
  MONTHS,
  REVIEW_TYPE_MAPPING,
  REVIEW_TYPES,
  SESSION_KEYS
} from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-self-review',
  templateUrl: './self-review.component.html',
  styleUrls: ['./self-review.component.css']
})
export class SelfReviewComponent {
  ratingChart: any;
  @Input() teamSelected: string;
  @Input() selectedDate: RatingDate;
  teams!: Team[];
  teamMembers: User[];
  positivesArr: string[] = [];
  negativesArr: string[] = [];
  userGoodQualities: string[] = [];
  userBadQualities: string[] = [];
  positives: any = {};
  negatives: any = {};
  months: number[] = [];
  monthNames: string[] = [];
  userScore: number[] = [];
  totalScore: number = 0;
  selectedUser: string;
  selectedUserName: string;
  selectedTeam: string;
  selectedType: string;
  reviewTypesMapping = REVIEW_TYPE_MAPPING;
  reviewTypes = Object.values(REVIEW_TYPES);

  constructor(
    private apiService: SpringApiService,
    private route: ActivatedRoute
  ) {
    this.selectedUser = sessionStorage.getItem(SESSION_KEYS.USER_NAME) ?? '';
    this.selectedUserName = sessionStorage.getItem(SESSION_KEYS.USERNAME) ?? '';
    this.selectedTeam = sessionStorage.getItem(SESSION_KEYS.TEAM) ?? '';
    this.selectedType = REVIEW_TYPES.MONTHLY;
  }

  ngOnInit(): void {
    this.selectedDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth()
    };

    if (this.selectedTeam && this.selectedUser) {
      this.getScore(this.selectedDate, 'MONTHLY');
    }
  }

  onTypeSelect(selection: string) {
    this.selectedType = selection;
    this.getScore(this.selectedDate, selection);
  }

  ngOnChanges() {
    if (!this.selectedUser) {
      this.selectedUser = this.route.snapshot.paramMap.get('name') || '';
    }
    if (this.selectedTeam && this.selectedUser) {
      this.getScore(this.selectedDate);
    }
  }

  getScore(ratingDate: RatingDate, type?: string) {
    this.apiService
      .getUserScore(
        this.selectedUserName,
        this.selectedTeam,
        ratingDate,
        false,
        type
      )
      .subscribe((apiResponse) => {
        this.positives = {};
        this.negatives = {};
        this.months = [];
        this.userGoodQualities = [];
        this.userBadQualities = [];
        apiResponse.response.reviews.forEach((x) => {
          const score = Number(x.score) || 0;
          if (score) {
            this.userScore.push(score);
          }
          const goodQualities = x.good_quality || [];
          const badQualities = x.bad_quality || [];
          this.userGoodQualities = this.userGoodQualities.concat(goodQualities);
          this.userBadQualities = this.userBadQualities.concat(badQualities);
          const month = Number(x.month) || 0;
          if (month) {
            this.months.push(month);
          }
        });
        if (this.months.length) {
          this.monthNames = this.months.map((index) => {
            return MONTHS[index - 1];
          });
        }
        if (this.userBadQualities.length) {
          this.getQualityCount(this.negatives, this.userBadQualities);
        }
        if (this.userGoodQualities.length) {
          this.getQualityCount(this.positives, this.userGoodQualities);
        }
        this.positivesArr = Object.keys(this.positives).filter((str) => str.trim().length > 0);
        this.negativesArr = Object.keys(this.negatives).filter((str) => str.trim().length > 0);
        debugger;
        this.createUserScoreChart();
      });
  }

  createUserScoreChart(): void {
    this.ratingChart?.destroy();
    this.ratingChart = new Chart('ratingChart', {
      type: 'line',
      data: {
        labels: this.monthNames,
        datasets: [
          {
            type: 'line',
            label: `${this.selectedUser}'s Score`,
            data: this.userScore,
            borderColor: '#04336d',
            fill: 'start'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
    this.ratingChart.update();
  }

  getDataObj(reviewsResponse: { month: number; users: { name: string; score: number }[] }[]): { [key: string]: number[] } {
    const allUsersWithScores: { [key: string]: number[] } = {};

    for (const review of reviewsResponse) {
      for (const user of review.users) {
        if (user.name in allUsersWithScores) {
          allUsersWithScores[user.name][review.month - 1] = user.score;
        } else {
          allUsersWithScores[user.name] = [user.score];
        }
      }
      for (const addedUser in allUsersWithScores) {
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
        data: val
      });
    }

    return dataArray;
  }

  getQualityCount(responseObj: any, arr: string[]) {
    for (var str of arr) {
      str = str.trim();
      responseObj[str] = responseObj[str] ? responseObj[str] + 1 : 1;
    }
  }
}
