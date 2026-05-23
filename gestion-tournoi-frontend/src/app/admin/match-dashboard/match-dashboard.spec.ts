import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDashboard } from './match-dashboard';

describe('MatchDashboard', () => {
  let component: MatchDashboard;
  let fixture: ComponentFixture<MatchDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
