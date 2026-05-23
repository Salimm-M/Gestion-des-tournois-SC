import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeMatch } from './equipe-match';

describe('EquipeMatch', () => {
  let component: EquipeMatch;
  let fixture: ComponentFixture<EquipeMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipeMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipeMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
