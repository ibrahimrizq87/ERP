import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../shared/services/shift.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { MachineService } from '../../shared/services/machine.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-shift',
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  machines:any[]=[];
  users:any[]=[];
  readonly maxImageSize = 2048 * 1024
  constructor(private _ShiftService:ShiftService , private _Router: Router,private _UserService:UserService,private _MachineService:MachineService ,private toastr:ToastrService) {
   
  }
  // 'user_id' => 'required|exists:users,id',
  // 'opening_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
  // 'opening_amount' => 'required|numeric|min:0',
  // // 'ending_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
  // // 'ending_amount' => 'nullable|numeric|min:0',
  // 'shift' => 'required|in:1,2',
  // 'machine_id'=>'required|exists:machines,id',
  // // 'status' => 'required|in:open,closed',
  // // 'amount' => 'required|numeric|min:0',
  // // 'total_money' => 'required|numeric|min:0',
  // // 'total_cash' => 'required|numeric|min:0',
  // // 'total_payed_online' => 'required|numeric|min:0',
  // // 'total_client_deposit' => 'required|numeric|min:0',
  // 'date' => 'required|date',
  shiftForm: FormGroup = new FormGroup({
    
    image: new FormControl(null, [this.validateImage.bind(this)]),
    opening_amount:new FormControl(null, [Validators.required,Validators.min(0)]),
    shift:new FormControl(null, [Validators.required]),
    machine_id: new FormControl(null, [Validators.required]),
    date: new FormControl(this.getTodayDate()),
  });
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.shiftForm.patchValue({ image: file });
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
    this.loadUsers(); 
    this.loadMachines();
  }

  loadUsers(): void {
    this._UserService.viewAllUsers().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.users = response.data; 
          // this.filteredCities = this.users;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  loadMachines(): void {
    this._MachineService.viewAllMachines().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.machines = response.data; 
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  handleForm() {
   
    if (this.shiftForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('opening_amount', this.shiftForm.get('opening_amount')?.value);
      formData.append('user_id', this.shiftForm.get('user_id')?.value);
      if (this.selectedFile) {
        formData.append('opening_image', this.selectedFile);
      }
      formData.append('shift', this.shiftForm.get('shift')?.value);
      formData.append('machine_id', this.shiftForm.get('machine_id')?.value);
      formData.append('date', this.shiftForm.get('date')?.value);


      this._ShiftService.addShift(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم إنشاء التحول بنجاح")

            this.isLoading = false;
            this._Router.navigate(['/dashboard/shifts']);
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
          this.toastr.error('فشل في إنشاء التحول. تحقق من البيانات المدخلة.');
      },
      });
    }
  }


}

