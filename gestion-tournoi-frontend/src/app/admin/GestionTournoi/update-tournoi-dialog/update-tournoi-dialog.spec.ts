import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTournoiDialog } from './update-tournoi-dialog';

describe('UpdateTournoiDialog', () => {
  let component: UpdateTournoiDialog;
  let fixture: ComponentFixture<UpdateTournoiDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTournoiDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTournoiDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
