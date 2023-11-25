import { isMoment } from 'moment';
import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { RatingDate } from 'src/models/RatingDate';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY'
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-month-year-picker',
  templateUrl: './month-year-picker.component.html',
  styleUrls: ['./month-year-picker.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MonthYearPickerComponent implements OnInit {
  @Output() newDateEvent = new EventEmitter<RatingDate>();
  minDate: Date = new Date(2023, 0, 1);
  selectedDate: Date;
  startDate: Date;

  constructor() {
    const today = new Date();
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    this.selectedDate = previousMonth;
    this.startDate = previousMonth;
  }

  ngOnInit(): void {
    this.sendSelectedDate(
      this.selectedDate.getMonth(),
      this.selectedDate.getFullYear()
    );
  }

  dateChanged(datepickerValue: Date, datepicker: MatDatepicker<Date>) {
    datepicker.close();

    const value = isMoment(datepickerValue)
      ? datepickerValue.toDate()
      : datepickerValue.toDateString();

    this.selectedDate = new Date(value);

    if (this.selectedDate) {
      this.sendSelectedDate(
        this.selectedDate.getMonth(),
        this.selectedDate.getFullYear()
      );
    }
  }

  sendSelectedDate(selectedMonth?: number, selectedYear?: number) {
    const defaultDate = new Date();

    const ratingDate: RatingDate = {
      year: selectedYear || defaultDate.getFullYear(),
      month: (selectedMonth ?? defaultDate.getMonth()) + 1
    };
    this.newDateEvent.emit(ratingDate);
  }
}
