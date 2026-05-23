import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMatchs } from './liste-matchs';

describe('ListeMatchs', () => {
  let component: ListeMatchs;
  let fixture: ComponentFixture<ListeMatchs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMatchs],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeMatchs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
