import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesParticipations } from './mes-participations';

describe('MesParticipations', () => {
  let component: MesParticipations;
  let fixture: ComponentFixture<MesParticipations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesParticipations],
    }).compileComponents();

    fixture = TestBed.createComponent(MesParticipations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
