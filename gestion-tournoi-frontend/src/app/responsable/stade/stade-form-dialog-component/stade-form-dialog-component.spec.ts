import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadeFormDialogComponent } from './stade-form-dialog-component';

describe('StadeFormDialogComponent', () => {
  let component: StadeFormDialogComponent;
  let fixture: ComponentFixture<StadeFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadeFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StadeFormDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
