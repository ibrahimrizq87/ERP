import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  userImageUrl: string | null = null;
  readonly maxImageSize = 2048 * 1024;
  userForm: FormGroup;;
    constructor(
    private fb: FormBuilder,
    private router: Router, 
    private _UserService:UserService ,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.userForm = new FormGroup({
      name: this.fb.control(null, [Validators.required,Validators.maxLength(255)]),
      username: this.fb.control(null, [Validators.required,Validators.maxLength(255)]),
      password: this.fb.control(null, [Validators.required,Validators.minLength(8)]),
      role: this.fb.control(null, [Validators.required]),
      image: this.fb.control(null, [this.validateImage.bind(this)]), 
      
    });
  }
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
    ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); 
    if (userId) {
      this.fetchUserData(userId);
    }
  }
  fetchUserData(userId: string): void {
    this._UserService.getUserById(userId).subscribe({
      next: (response) => {
        if (response) {
          const UserData = response.user ; 
          console.log(UserData)
          this.userForm.patchValue({
            name:UserData.name,
            username:UserData.username,
            password:UserData.password,
            role:UserData.role,
           
           
          });
          this.userImageUrl = UserData.image;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
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
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId){
      this._UserService.updateUser(userId,formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            this.toastr.success("Updated User Successfully")
            this.router.navigate(['/dashboard/users']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
        }
      });
    }
  }}
  onCancel(): void {
        this.userForm.reset();
       
        this.router.navigate(['/dashboard/users']); 
      }  
}
