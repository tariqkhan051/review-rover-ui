import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, catchError } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { getNoWhitespaceValidator, isSuccessResponse } from 'src/helpers/utils';
import { SpringApiService } from '../../services/spring-api/spring-api.service';
import {
  MESSAGES,
  RATING_TOOLTIPS,
  REVIEW_TYPES,
  SESSION_KEYS,
  SNACK_BAR_DURATION,
  SNACK_BAR_X_POSITION,
  SNACK_BAR_Y_POSITION,
  TEXT_FIELDS_MAX_LENGTH
} from 'src/helpers/constants';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.css']
})
export class RandomComponent {
  public stars: boolean[] = Array(5).fill(false);
  isLinear = false;
  formGroup: FormGroup;
  form: FormArray;
  fg: FormGroup;
  userRate: number = 0;
  ratingArr: number[] = [];
  users: any;
  userNames: string[] = [];
  selectedUser: string;
  selectedUserName: string;
  selectedTeam: string;
  text = RATING_TOOLTIPS;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  posCtrl = new FormControl('');
  negCtrl = new FormControl('');
  filteredPos: Observable<string[]>;
  filteredNeg: Observable<string[]>;
  positives: string[] = [];
  negatives: string[] = [];
  allPos: string[] = ['Punctual', 'Communicate effectively', 'Take initiative'];
  allNeg: string[] = ['Procrastinating', 'Attitude', 'Being Disorganized'];
  @ViewChild('posInput') posInput: ElementRef<HTMLInputElement>;
  @ViewChild('negInput') negInput: ElementRef<HTMLInputElement>;
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  maxLength = TEXT_FIELDS_MAX_LENGTH;
  descriptionMaxLength = 200;
  customErrors = {
    description: {
      maxlength: 'Description can not exceed 200 characters.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private service: SpringApiService
  ) {
    this.createForm();
  }

  ratingFor: string;
  setUserName(ratingFor: string) {
    this.ratingFor = ratingFor;
  }

  private _filter(value: string, behavior: string): string[] {
    const filterValue = value.trim().toLowerCase();
    const collection = behavior === 'good' ? this.allPos : this.allNeg;

    return collection.filter((item) => item.toLowerCase().includes(filterValue));
  }

  add(event: MatChipInputEvent, behavior: string): void {
    const value = event.value.trim();

    if (behavior === 'good') {
      if (value) {
        this.positives.push(value);
      }

      this.posCtrl.setValue(null);
    } else {
      if (value) {
        this.negatives.push(value);
      }

      this.negCtrl.setValue(null);
    }

    event.chipInput?.clear();
  }

  remove(quality: string, behavior: string): void {
    const collection = behavior === 'good' ? this.positives : this.negatives;
    const index = collection.indexOf(quality.trim());

    if (index >= 0) {
      collection.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, behavior: string): void {
    const value = event.option.viewValue.trim();

    if (behavior === 'good') {
      this.positives.push(value);
      this.posInput.nativeElement.value = '';
      this.posCtrl.setValue(null);
    } else {
      this.negatives.push(value);
      this.negInput.nativeElement.value = '';
      this.negCtrl.setValue(null);
    }
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.createRatingArray();
    this.fetchUsersForRandomReviews();
  }

  // Form initialization
  createForm() {
    const { USER_NAME, TEAM, USERNAME } = SESSION_KEYS;
    this.selectedUser = sessionStorage.getItem(USER_NAME) || '';
    this.selectedTeam = sessionStorage.getItem(TEAM) || '';
    this.selectedUserName = sessionStorage.getItem(USERNAME) || '';

    const titleValidators = [
      Validators.required,
      Validators.maxLength(TEXT_FIELDS_MAX_LENGTH),
      Validators.minLength(3),
      getNoWhitespaceValidator()
    ];
    const descriptionValidators = [
      Validators.required,
      Validators.maxLength(this.descriptionMaxLength),
      Validators.minLength(3),
      getNoWhitespaceValidator()
    ];

    this.fg = this.formBuilder.group({
      good: [null, Validators.maxLength(TEXT_FIELDS_MAX_LENGTH)],
      bad: [null, Validators.maxLength(TEXT_FIELDS_MAX_LENGTH)],
      title: ['', titleValidators],
      description: ['', descriptionValidators],
      name: ['']
    });

    this.filteredPos = this.posCtrl.valueChanges.pipe(
      startWith(null),
      map((pos: string | null) =>
        pos ? this._filter(pos.trim(), 'good') : this.allPos.slice()
      )
    );

    this.filteredNeg = this.negCtrl.valueChanges.pipe(
      startWith(null),
      map((neg: string | null) =>
        neg ? this._filter(neg.trim(), 'bad') : this.allNeg.slice()
      )
    );
  }

  // Reactive form initialization
  createFormGroup() {
    this.formGroup = this.formBuilder.group({
      form: this.formBuilder.array([this.initForm()])
    });
  }

  // Array initialization for ratings
  createRatingArray() {
    for (let i = 0; i < this.starCount; i++) {
      this.ratingArr.push(i);
    }
  }

  // Fetch users for random reviews
  fetchUsersForRandomReviews() {
    this.service
      .getUsersForRandomReviews(this.selectedTeam)
      .subscribe(({ response }) => {
        this.users = response
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(({ name }) => name !== this.selectedUser);
      });
  }

  // Form group initialization
  initForm() {
    return this.formBuilder.group({
      cont: ['', Validators.required]
    });
  }

  public rate(rating: number) {
    this.userRate = rating;
    this.stars = this.stars.map((_, i) => rating > i);
  }

  getControls() {
    return (this.formGroup.get('form') as FormArray).controls;
  }

  onSubmit(): void {
    if (this.hasEmptyFields()) {
      this.snackBar.open(MESSAGES.RATE_REQUIRED_FIELDS, 'Close', {
        duration: SNACK_BAR_DURATION,
        horizontalPosition: SNACK_BAR_X_POSITION,
        verticalPosition: SNACK_BAR_Y_POSITION,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.hasSelectedUser()) {
      this.snackBar.open(MESSAGES.USER_NOT_SELECTED, 'Close', {
        duration: SNACK_BAR_DURATION,
        horizontalPosition: SNACK_BAR_X_POSITION,
        verticalPosition: SNACK_BAR_Y_POSITION,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.fg.valid) {
      this.service
        .addReview(
          REVIEW_TYPES.RANDOM,
          this.getTrimmedFieldValue('title'),
          this.getTrimmedFieldValue('description'),
          this.ratingFor,
          this.userRate,
          this.fg.value
        )
        .pipe(
          catchError(({ error }) => this.handleReviewSubmissionError(error))
        )
        .subscribe((data) => {
          if (isSuccessResponse(data)) {
            // this.resetForm();
            this.positives = [];
            this.negatives = [];
            this.stars = this.stars.map((_, i) => 0 > i);
            this.showReviewSubmittedMessage();
            setTimeout(() => location.reload(), 1000);
          }
        });
    }
  }

  private hasEmptyFields(): boolean {
    return (
      this.userRate === 0 ||
      this.getTrimmedFieldValue('title') === '' ||
      this.getTrimmedFieldValue('description') === ''
    );
  }

  private hasSelectedUser(): boolean {
    return !!this.ratingFor;
  }

  private getTrimmedFieldValue(fieldName: string): string {
    return this.fg.value[fieldName].trim();
  }

  private handleReviewSubmissionError(error: any): Observable<string> {
    const errorMessage = error.message || 'Bad request';
    this.snackBar.open(errorMessage, 'Close', {
      duration: SNACK_BAR_DURATION,
      panelClass: ['error-snackbar']
    });
    return of('');
  }

  private resetForm(): void {
    this.fg.markAsPristine();
    this.fg.markAsUntouched();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.fg.reset();
    this.formGroup.reset();
  }

  private showReviewSubmittedMessage(): void {
    this.snackBar.open(MESSAGES.REVIEW_SUBMITTED, 'Close', {
      duration: SNACK_BAR_DURATION,
      horizontalPosition: SNACK_BAR_X_POSITION,
      verticalPosition: SNACK_BAR_Y_POSITION,
      panelClass: ['success-snackbar']
    });
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  suggestions = '';
  onClick(suggestions: string) {
    this.suggestions += suggestions.trim() + ',';
  }

  badsuggestions = '';
  onBadClick(badsuggestions: string) {
    this.badsuggestions += badsuggestions.trim() + ',';
  }

  //#region Form Controls

  get good() {
    return this.fg.controls['good'];
  }
  get bad() {
    return this.fg.controls['bad'];
  }
  get title() {
    return this.fg.controls['title'];
  }
  get description() {
    return this.fg.controls['description'];
  }
  get name() {
    return this.fg.controls['name'];
  }

  //#endregion
}
