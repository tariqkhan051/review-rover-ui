import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import * as confetti from 'canvas-confetti';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MONTHS,
  MESSAGES,
  RATING_TOOLTIPS,
  SNACK_BAR_DURATION,
  SNACK_BAR_X_POSITION,
  SNACK_BAR_Y_POSITION,
  TEXT_FIELDS_MAX_LENGTH,
  REVIEW_TYPES,
  SESSION_KEYS
} from 'src/helpers/constants';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpringApiService } from '../../services/spring-api/spring-api.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { getSuccessAlert, isSuccessResponse } from 'src/helpers/utils';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
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
  visible: boolean = false;
  text = RATING_TOOLTIPS;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  posCtrl = new FormControl('');
  negCtrl = new FormControl('');
  filteredPos: Observable<string[]>;
  filteredNeg: Observable<string[]>;
  positives: string[] = [];
  negatives: string[] = [];
  ValuesGiven: boolean = false;
  month: string;
  allPos: string[] = ['Punctual', 'Communicate effectively', 'Take initiative'];
  allNeg: string[] = ['Procrastinating', 'Attitude', 'Being Disorganized'];
  @ViewChild('posInput') posInput: ElementRef<HTMLInputElement>;
  @ViewChild('negInput') negInput: ElementRef<HTMLInputElement>;
  @ViewChild('stepper') stepper: MatStepper;
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  public clicked = false;
  editable: boolean[] = [];
  completed: boolean[] = [];
  state: string[] = [];
  maxLength = TEXT_FIELDS_MAX_LENGTH;

  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private service: SpringApiService,
    private router: Router
  ) {
    this.fg = this._formBuilder.group({
      good: [
        '',
        Validators.compose([Validators.maxLength(TEXT_FIELDS_MAX_LENGTH)])
      ],
      bad: [
        '',
        Validators.compose([Validators.maxLength(TEXT_FIELDS_MAX_LENGTH)])
      ]
    });

    this.selectedUser = sessionStorage.getItem(SESSION_KEYS.USER_NAME) ?? '';
    this.selectedUserName = sessionStorage.getItem(SESSION_KEYS.USERNAME) ?? '';
    this.selectedTeam = sessionStorage.getItem(SESSION_KEYS.TEAM) ?? '';

    const currentDate = new Date();
    this.month =
      MONTHS[currentDate.getMonth() - 1] + '-' + currentDate.getFullYear();

    this.filteredPos = this.posCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filter(value.trim(), 'good') : this.allPos.slice()
      )
    );

    this.filteredNeg = this.negCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filter(value.trim(), 'bad') : this.allNeg.slice()
      )
    );
  }

  public surprise(): void {
    var myCanvas = document.getElementById('p-4') as HTMLCanvasElement;

    var myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true
    });
    var end = Date.now() + 15 * 1000;

    //Animation
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
      myConfetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      myConfetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // myConfetti({
    //   particleCount: 300,
    //   spread: 300,
    //   // any other options from the global
    //   // confetti function
    // });
  }

  private _filter(value: string, behavior: string): string[] {
    const filterValue = value.trim().toLowerCase();
    const list = behavior === 'good' ? this.allPos : this.allNeg;

    return list.filter((item) => item.toLowerCase().includes(filterValue));
  }

  add(event: MatChipInputEvent, behavior: string): void {
    const list = behavior === 'good' ? this.positives : this.negatives;
    const value = event.value.trim();

    if (value) {
      list.push(value);
    }

    event.chipInput!.clear();

    const control = behavior === 'good' ? this.posCtrl : this.negCtrl;
    control.setValue(null);
  }

  remove(quality: string, behavior: string): void {
    const list = behavior === 'good' ? this.positives : this.negatives;
    const index = list.indexOf(quality.trim());

    if (index >= 0) {
      list.splice(index, 1);
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

  ngOnInit() {
    this.service.getPendingReviewsForUser().subscribe({
      next: (response: any) => {
        this.users = response.response?.reviews || [];
        if (this.users?.length === 0) {
          this.visible = true;
          // this.surprise();
        } else {
          setTimeout(() => {
            this.addItem();
          }, 500);

          this.formGroup = this._formBuilder.group({
            form: this._formBuilder.array([this.init()]),
          });

          this.ratingArr = Array.from({ length: this.starCount }, (_, i) => i);
        }
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  init() {
    return this._formBuilder.group({
      cont: new FormControl('', [Validators.required])
    });
  }

  public rate(rating: number) {
    this.userRate = rating;
    this.stars = this.stars.map((_, i) => rating > i);
  }

  getControls() {
    return (this.formGroup?.get('form') as FormArray)?.controls;
  }

  onSubmit(ratingFor: string, stepper: MatStepper, matStep: number) {
    if (!this.fg.valid) {
      return;
    }

    if (this.userRate === 0) {
      this.snackBar.open(MESSAGES.RATE_REQUIRED, 'Close', {
        duration: SNACK_BAR_DURATION,
        horizontalPosition: SNACK_BAR_X_POSITION,
        verticalPosition: SNACK_BAR_Y_POSITION,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.service
      .addReview(
        REVIEW_TYPES.MONTHLY,
        '',
        '',
        ratingFor,
        this.userRate,
        this.fg.value
      )
      .subscribe({
        next: (data) => {
          if (isSuccessResponse(data)) {
            const steps = stepper.steps;
            let IsCompleted: boolean[] = [];
            steps.forEach((step) => {
              if (step.state !== 'done') {
                IsCompleted.push(false);
              }
            });
            if (IsCompleted.length === 1) {
              this.surprise();
              getSuccessAlert('You have completed your monthly review.').then(
                (result) => {
                  location.reload();
                  this.router.navigate(['dashboard']);
                }
              );
            }

            this.completed[matStep] = true;
            this.state[matStep] = 'done';
            this.editable[matStep] = false;
            this.ValuesGiven = true;
            this.userRate = 0;
            this.stars.fill(false);
            this.positives = [];
            this.negatives = [];
            this.snackBar.open(MESSAGES.REVIEW_SUBMITTED, 'Close', {
              duration: SNACK_BAR_DURATION,
              horizontalPosition: SNACK_BAR_X_POSITION,
              verticalPosition: SNACK_BAR_Y_POSITION,
              panelClass: ['success-snackbar']
            });
            stepper.next();
          }
        },
        error: (err) => {
          this.snackBar.open(err.error.message || 'Bad Request', 'Close', {
            duration: SNACK_BAR_DURATION,
            horizontalPosition: SNACK_BAR_X_POSITION,
            verticalPosition: SNACK_BAR_Y_POSITION,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  addItem(): void {
    const formArray = this.formGroup.get('form') as FormArray;

    if (this.users?.length > 0) {
      for (const user of this.users) {
        this.userNames.push(user.user);
        formArray.push(this.init());
        this.completed.push(false);
        this.editable.push(true);
        this.state.push('pending');
      }

      formArray.removeAt(this.users?.length - 1);
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

  selectionChange(event: StepperSelectionEvent) {
    this.userRate = 0;
    if (event.selectedStep.state === 'done') {
      this.stepper.selectedIndex = event.selectedIndex + 1;
    }
    this.stars = this.stars.map((_, i) => 0 > i);
    this.positives = [];
    this.negatives = [];
  }

  //#region Form Controls

  get good() {
    return this.fg.controls['good'];
  }
  get bad() {
    return this.fg.controls['bad'];
  }
  //#endregion
}
