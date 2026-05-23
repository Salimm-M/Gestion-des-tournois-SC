import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournoisDisponible } from './tournois-disponible';

describe('TournoisDisponible', () => {
  let component: TournoisDisponible;
  let fixture: ComponentFixture<TournoisDisponible>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournoisDisponible],
    }).compileComponents();

    fixture = TestBed.createComponent(TournoisDisponible);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
