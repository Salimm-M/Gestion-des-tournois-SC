import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stade } from './stade';

describe('Stade', () => {
  let component: Stade;
  let fixture: ComponentFixture<Stade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stade],
    }).compileComponents();

    fixture = TestBed.createComponent(Stade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
