import {Component, inject} from '@angular/core'; 
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
 import {MatInputModule} from '@angular/material/input'; 
 import {MatFormFieldModule} from '@angular/material/form-field';
  import {MatStepper, MatStepperModule} from '@angular/material/stepper';
   import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../service/user-service';
import { EquipeService } from '../service/equipe-service';
import { UserCreate } from '../interface/user/user-create';
import { Role } from '../models/role';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registre',
  imports: [
    MatStepper,MatButtonModule, RouterLink,MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './registre.html',
  styleUrls: ['./registre.css'],
})
export class Registre {

  isLinear = true;
  emailExists: boolean = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  logoPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,private userService: UserService, private equipeService: EquipeService) { 

    this.firstFormGroup = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.secondFormGroup = this.fb.group({
      abbreviation: ['', Validators.required],
      nom: ['', Validators.required],
     nomEcole: ['', Validators.required],
      logo: [null]
    });
  }

  nextStep(stepper: MatStepper) {
    if (this.firstFormGroup.invalid) {
      this.firstFormGroup.markAllAsTouched();
      return;
    }
    stepper.next();
  }

  nextStep2(stepper: MatStepper) {
    if (this.secondFormGroup.invalid) {
      this.secondFormGroup.markAllAsTouched();
      return;
    }
    stepper.next();
  }

  // 📌 logo upload
  onLogoChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.secondFormGroup.patchValue({
        logo: file
      });

      this.secondFormGroup.get('logo')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  submitAll(stepper: MatStepper) {

  
  if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
    this.firstFormGroup.markAllAsTouched();
    this.secondFormGroup.markAllAsTouched();
    return;
  }
  
  
  const user:UserCreate = {
    nom: this.firstFormGroup.value.nom,
    prenom: this.firstFormGroup.value.prenom,
    email: this.firstFormGroup.value.email,
    password: this.firstFormGroup.value.password,
    role: Role.Responsable
  };

 
  const formData = new FormData();
  formData.append('abbreviation', this.secondFormGroup.value.abbreviation);
  formData.append('nom', this.secondFormGroup.value.nom);
  formData.append('pays', this.secondFormGroup.value.pays);
  formData.append('nomEcole', this.secondFormGroup.value.nomEcole);
 const file: File = this.secondFormGroup.get('logo')?.value;

if (file) {
  formData.append('logo', file);
}
 

  
  this.userService.createUser(user).subscribe({
    next: (resUser) => {
      if (!resUser || !resUser.id) {
        console.error('User creation failed: No ID returned');
        return;
      }
      formData.append('idResponsable', resUser.id.toString());

      this.equipeService.createEquipe(formData).subscribe({
        next: (resEquipe) => {
          console.log('User + Equipe created ✔');

          stepper.next();

        },
        error: err => console.error('Equipe error', err)
      });

    },
     error: (err) => {
        if (err.status === 409||err.status === 403||err.status === 400) {
          stepper.previous();
          this.emailExists = true;
        }
      }
  });
}
}