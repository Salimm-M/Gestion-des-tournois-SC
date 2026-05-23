import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTournoi } from './gestion-tournoi';

describe('GestionTournoi', () => {
  let component: GestionTournoi;
  let fixture: ComponentFixture<GestionTournoi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTournoi],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionTournoi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
