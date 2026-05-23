import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueurDeleteDialogComponent } from './joueur-delete-dialog-component';

describe('JoueurDeleteDialogComponent', () => {
  let component: JoueurDeleteDialogComponent;
  let fixture: ComponentFixture<JoueurDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoueurDeleteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoueurDeleteDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
