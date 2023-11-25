import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { SpringApiService } from 'src/app/services/spring-api/spring-api.service';
import { FONT_SIZE, FONT_FAMILY, MONTHS } from 'src/helpers/constants';
import { RatingDate } from 'src/models/RatingDate';

@Component({
  selector: 'app-department-yearly-perf-chart',
  templateUrl: './department-yearly-perf-chart.component.html',
  styleUrls: ['./department-yearly-perf-chart.component.css']
})
export class DepartmentYearlyPerfChartComponent {
  ratingChart: any;
  canvas: any;
  ctx: any;
  @ViewChild('deptYearlyChart') deptYearlyChart: ElementRef;
  @Input() selectedDate: RatingDate;
  @Input() reviewType: string;
  allDepts: string[];

  constructor(private apiService: SpringApiService) {}

  ngOnChanges() {
    this.getAllDeptScore();
  }

  getAllDeptScore() {
    this.apiService.getDepartments().subscribe((apiResponse) => {
      this.allDepts = apiResponse.response.map((dept) => {
        return dept.name;
      });

      this.apiService
        .getAllDepartmentsYearlyScores(this.selectedDate, this.reviewType)
        .subscribe((apiResponse) => {
          let dataSet = this.getDataSet(
            this.getDataObj(apiResponse.response.reviews ?? [])
          );

          this.createChart(dataSet);
        });
    });
  }

  getDataObj(reviewsResponse: any[]) {
    let allDeptsWithScores: any = {};

    for (const department of this.allDepts) {
      let scores = [];
      for (let i = 0; i < 12; i++) {
        scores.push(0);
      }

      allDeptsWithScores[department] = scores;
    }

    for (var review of reviewsResponse) {
      for (var department of review.departments) {
        if (Object.keys(allDeptsWithScores).includes(department.name)) {
          allDeptsWithScores[department.name][review.month - 1] = department.score;
        } else {
          allDeptsWithScores[department.name] = [department.score];
        }
      }
    }

    return allDeptsWithScores;
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
    this.canvas = this.deptYearlyChart?.nativeElement;
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
