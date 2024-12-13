import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  msgError: string = '';
  isLoading: boolean = false;

  constructor(private _UserService:UserService , private _Router: Router) {}

  loginForm: FormGroup = new FormGroup({
    user_name: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  handleForm() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('username', this.loginForm.get('user_name')?.value);
      formData.append('password', this.loginForm.get('password')?.value);

      this._UserService.setLogin(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.isLoading = false;

          
            localStorage.setItem('Gtoken', response.token);

            // Call saveUserData() to decode and store the access_token
            // this._UserService.saveUserData();

          
            this._Router.navigate(['/dashboard']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
           this.msgError = err.error.error;
          console.log(err);
        }
      });
    }
  }
}
