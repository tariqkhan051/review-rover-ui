import { Chart } from 'chart.js';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RatingDate } from 'src/models/RatingDate';
import { FONT_FAMILY, FONT_SIZE, MONTHS } from 'src/helpers/constants';
import { SpringApiService } from '../../services/spring-api/spring-api.service';

@Component({
  selector: 'app-team-yearly-perf-chart',
  templateUrl: './team-yearly-perf-chart.component.html',
  styleUrls: ['./team-yearly-perf-chart.component.css']
})
export class TeamYearlyPerfChartComponent {
  ratingChart: any;
  canvas: any;
  ctx: any;
  @ViewChild('teamYearlyChart') teamYearlyChart: ElementRef;
  @Input() selectedDate: RatingDate;
  @Input() reviewType: string;
  allTeams: string[];

  constructor(private apiService: SpringApiService) {}

  ngOnChanges() {
    this.getAllTeamsScore();
  }

  getAllTeamsScore() {
    this.apiService.getTeams().subscribe((apiResponse) => {
      this.allTeams = apiResponse.response.map((team) => {
        return team.name;
      });

      this.apiService
        .getAllTeamsYearlyScores(this.selectedDate, this.reviewType)
        .subscribe((apiResponse) => {
          let dataSet = this.getDataSet(
            this.getDataObj(apiResponse.response.reviews ?? [])
          );

          this.createChart(dataSet);
        });
    });
  }

  getDataObj(reviewsResponse: any[]) {
    let allTeamsWithScores: any = {};

    for (const team of this.allTeams) {
      let scores = [];
      for (let i = 0; i < 12; i++) {
        scores.push(0);
      }

      allTeamsWithScores[team] = scores;
    }

    for (var review of reviewsResponse) {
      for (var team of review.teams) {
        if (Object.keys(allTeamsWithScores).includes(team.name)) {
          allTeamsWithScores[team.name][review.month - 1] = team.score;
        } else {
          allTeamsWithScores[team.name] = [team.score];
        }
      }
    }

    return allTeamsWithScores;
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

  createChart(dataSet: any) {
    this.ratingChart?.destroy();
    this.canvas = this.teamYearlyChart?.nativeElement;
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
