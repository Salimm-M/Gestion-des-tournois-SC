import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueurFormDialogComponent } from './joueur-form-dialog-component';

describe('JoueurFormDialogComponent', () => {
  let component: JoueurFormDialogComponent;
  let fixture: ComponentFixture<JoueurFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoueurFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoueurFormDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
