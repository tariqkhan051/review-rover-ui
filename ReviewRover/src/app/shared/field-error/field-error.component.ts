import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MESSAGES } from 'src/helpers/constants';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.css']
})
export class FieldErrorComponent {
  @Input() control: AbstractControl;
  @Input() controlName: string;
  @Input() customErrorMessage?: CustomError;
  lowercaseControlName: string;
  errorMsgs = MESSAGES;

  ERROR_KEYS = {
    REQUIRED: 'required',
    MAX_LENGTH: 'maxlength',
    MIN_LENGTH: 'minlength',
    PATTERN: 'pattern',
    RESTRICTED_WORDS: 'restrictedWords',
    EMAIL: 'email',
    WHITE_SPACES: 'whitespace'
  };

  ngOnInit() {
    this.lowercaseControlName = this.controlName.toLowerCase();
  }
}

interface CustomError {
  [key: string]: string; //the key must be same as control.errors[key]
}
