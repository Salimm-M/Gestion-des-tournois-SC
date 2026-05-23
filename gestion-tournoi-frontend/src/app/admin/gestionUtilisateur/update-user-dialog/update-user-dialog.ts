import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../service/user-service';
import { UserCreate } from '../../../interface/user/user-create';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.html',
  styleUrls: ['./update-user-dialog.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class UpdateUserDialog {

  loading = false;
  emailExists = false;

  roles = [
    { value: Role.Admin,   label: 'Admin'   },
    { value: Role.Responsable,   label: 'Responsable'   },
 
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UpdateUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserCreate
  ) {
    this.form = this.fb.group({
      id:       [data.id],
      nom:      [data.nom,    Validators.required],
      prenom:   [data.prenom, Validators.required],
      email:    [data.email,  [Validators.required, Validators.email]],
      password: [data.password],
      role:     [data.role,   Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.emailExists = false;

    const updated: UserCreate = {
      ...this.data,
      ...this.form.value,
    };

    if (!this.form.value.password) {
      updated.password = this.data.password;
    }

    this.userService.updateUser(updated).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(updated);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409 || err.status === 400) {
          this.emailExists = true;
          this.form.get('email')?.setErrors({ exists: true });
        }
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}