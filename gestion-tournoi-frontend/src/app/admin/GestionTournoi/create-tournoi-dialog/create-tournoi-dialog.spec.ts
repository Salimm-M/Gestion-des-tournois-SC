import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTournoiDialog } from './create-tournoi-dialog';

describe('CreateTournoiDialog', () => {
  let component: CreateTournoiDialog;
  let fixture: ComponentFixture<CreateTournoiDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTournoiDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTournoiDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
