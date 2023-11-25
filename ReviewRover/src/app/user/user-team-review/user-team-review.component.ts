import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { User } from 'src/models/User';
import { Team } from 'src/models/Team';
import { UserReview } from 'src/models/Review';
import { RatingDate } from 'src/models/RatingDate';
import {
  FONT_FAMILY,
  FONT_SIZE,
  MONTHS,
  REVIEW_TYPE_MAPPING,
  REVIEW_TYPES,
  SESSION_KEYS
} from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-user-team-review',
  templateUrl: './user-team-review.component.html',
  styleUrls: ['./user-team-review.component.css']
})
export class UserTeamReviewComponent {
  ratingChart: any;
  @Input() teamSelected: string;
  @Input() selectedDate: RatingDate;
  teams!: Team[];
  teamMembers: User[];
  userGoodQualities: string[];
  userBadQualities: string[];
  positivesArr: string[] = [];
  negativesArr: string[] = [];
  userScore: number = 0;
  totalScore: number = 0;
  positives: any = {};
  negatives: any = {};
  selectedUser: string;
  selectedUserName: string;
  selectedTeam: string;
  reviewTypesMapping = REVIEW_TYPE_MAPPING;
  reviewTypes = Object.values(REVIEW_TYPES);
  selectedType: string;

  constructor(private apiService: SpringApiService) {
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
  }

  ngOnChanges() {
    if (this.teamSelected) {
      this.getTeamScores(this.selectedDate, true, this.selectedType);
    }
  }

  onTypeSelect(selection: string) {
    this.selectedType = selection;
    this.getTeamScores(this.selectedDate, true, selection);
  }

  getTeamScores(date: RatingDate, month: boolean, type: string) {
    this.apiService
      .getTeamScores(this.selectedTeam, date, month, type)
      .subscribe((apiResponse) => {
        let dataSet = this.getDataSet(
          this.getDataObj(apiResponse.response.reviews ?? [])
        );

        this.createChart(dataSet);
      });
  }

  getScore(ratingDate: RatingDate) {
    this.selectedDate = ratingDate;
    this.getTeamScores(this.selectedDate, true, this.selectedType);
  }

  getQualityCount(responseObj: any, arr: string[]) {
    for (var str of arr) {
      str = str.trim();
      responseObj[str] = responseObj[str] ? responseObj[str] + 1 : 1;
    }
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
      });
    }

    return dataArray;
  }

  createChart(dataSet: any) {
    this.ratingChart?.destroy();

    Chart.defaults.font.size = FONT_SIZE;
    Chart.defaults.font.family = FONT_FAMILY;
    this.ratingChart = new Chart('teamMonthlyChart', {
      type: 'bar',
      data: {
        labels: MONTHS.slice(
          this.selectedDate.month - 1,
          this.selectedDate.month
        ),
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
