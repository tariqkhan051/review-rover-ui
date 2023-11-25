import { Component } from '@angular/core';
import { Team } from 'src/models/Team';
import { User } from 'src/models/User';
import { RatingDate } from 'src/models/RatingDate';
import {
  REVIEW_TYPE_MAPPING,
  REVIEW_TYPES,
  MONTHS_FULL
} from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-admin-home-screen',
  templateUrl: './admin-home-screen.component.html',
  styleUrls: ['./admin-home-screen.component.css']
})
export class AdminHomeScreenComponent {
  teamSelected: string = '';
  memberSelected: User;
  teams!: Team[];
  teamMembers: User[];
  reviewTypesMapping = REVIEW_TYPE_MAPPING;
  reviewTypes = Object.values(REVIEW_TYPES);
  selectedReviewType: string;
  selectedDate: RatingDate;
  months = MONTHS_FULL;

  constructor(private apiService: SpringApiService) {
    this.selectedReviewType = REVIEW_TYPES.MONTHLY;
  }

  ngOnInit() {
    this.apiService.getTeams().subscribe((apiResponse) => {
      this.teams = apiResponse.response?.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      this.teamSelected = this.teams?.[0]?.name || '';
      if (this.teamSelected) {
        this.getUsers(this.teamSelected);
      }
    });
  }

  getUsers(team: string) {
    this.apiService.getUsers(team).subscribe((response) => {
      this.teamMembers = response.response?.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      this.memberSelected = this.teamMembers?.[0];
    });
  }

  onTeamSelect(selection: string) {
    this.teamSelected = selection;
    this.getUsers(this.teamSelected);
  }

  onMemberSelect(selection: User) {
    this.memberSelected = selection;
  }

  onTypeSelect(selection: string) {
    this.selectedReviewType = selection;
  }

  getScore(ratingDate: RatingDate) {
    this.selectedDate = ratingDate;
  }
}
