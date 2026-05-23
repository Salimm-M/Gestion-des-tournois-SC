import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUtilisateur } from './gestion-utilisateur';

describe('GestionUtilisateur', () => {
  let component: GestionUtilisateur;
  let fixture: ComponentFixture<GestionUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUtilisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionUtilisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
