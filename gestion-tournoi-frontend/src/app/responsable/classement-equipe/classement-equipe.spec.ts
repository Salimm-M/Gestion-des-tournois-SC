import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassementEquipe } from './classement-equipe';

describe('ClassementEquipe', () => {
  let component: ClassementEquipe;
  let fixture: ComponentFixture<ClassementEquipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassementEquipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassementEquipe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
