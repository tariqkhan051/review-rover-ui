import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedWinnerComponent } from './animated-winner.component';

describe('AnimatedWinnerComponent', () => {
  let component: AnimatedWinnerComponent;
  let fixture: ComponentFixture<AnimatedWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedWinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
