import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementMatch } from './evenement-match';

describe('EvenementMatch', () => {
  let component: EvenementMatch;
  let fixture: ComponentFixture<EvenementMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenementMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(EvenementMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
