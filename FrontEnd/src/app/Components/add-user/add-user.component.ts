import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {  ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-user',
  imports: [FormsModule ,ReactiveFormsModule ,CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  msgError: any[] = [];
  isLoading: boolean = false;
  readonly maxImageSize = 2048 * 1024;
  constructor(private _UserService:UserService , private _Router: Router,private toastr: ToastrService) {
   
  }
 
 
  userForm: FormGroup = new FormGroup({
    name:new FormControl(null, [Validators.required,Validators.maxLength(255)]),
    username: new FormControl(null, [Validators.required,Validators.maxLength(255)]),
    password: new FormControl(null, [Validators.required,Validators.minLength(8)]),
    role: new FormControl(null, [Validators.required]),
    image: new FormControl(null, [this.validateImage.bind(this)]),
  });
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userForm.patchValue({ image: file });
    }
  }

  validateImage(control: AbstractControl): ValidationErrors | null {
    const file = this.selectedFile;
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }
      if (fileSize > this.maxImageSize) {
        return { fileTooLarge: true };
      }
    }
    return null;
  }
  handleForm() {
   
    if (this.userForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('name', this.userForm.get('name')?.value);
      formData.append('username', this.userForm.get('username')?.value);
      formData.append('password', this.userForm.get('password')?.value);
      formData.append('role', this.userForm.get('role')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      this._UserService.addUser(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم إنشاء المستخدم بنجاح");

            this.isLoading = false;
            
            this._Router.navigate(['/dashboard/users']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = [];
      
          if (err.error && err.error.errors) {
             
              for (const key in err.error.errors) {
                  if (err.error.errors[key] instanceof Array) {
                      this.msgError.push(...err.error.errors[key]);
                  } else {
                      this.msgError.push(err.error.errors[key]);
                  }
              }
          }
      
          console.error(this.msgError); 
      },
      });
    }
  }
}
