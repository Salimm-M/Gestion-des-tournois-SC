import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadeDeleteDialogComponent } from './stade-delete-dialog-component';

describe('StadeDeleteDialogComponent', () => {
  let component: StadeDeleteDialogComponent;
  let fixture: ComponentFixture<StadeDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadeDeleteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StadeDeleteDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
