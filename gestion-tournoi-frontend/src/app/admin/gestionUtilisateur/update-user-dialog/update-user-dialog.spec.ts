import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserDialog } from './update-user-dialog';

describe('UpdateUserDialog', () => {
  let component: UpdateUserDialog;
  let fixture: ComponentFixture<UpdateUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateUserDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
