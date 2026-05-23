import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanifierMatch } from './planifier-match';

describe('PlanifierMatch', () => {
  let component: PlanifierMatch;
  let fixture: ComponentFixture<PlanifierMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanifierMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanifierMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
