
import { SettingsService } from '../../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-update-setting',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-setting.component.html',
  styleUrl: './update-setting.component.css'
})

export class UpdateSettingComponent {
  machineForm: FormGroup;
  settings: any[] = [];
  isLoading: boolean = false;
  msgError: string[] = [];
  logo:string ='';
  constructor(
    private toastr:ToastrService,
    private fb: FormBuilder, private settingsService: SettingsService) {

    this.machineForm = this.fb.group({
      logo: [''],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      tax_number: ['', Validators.required],
      tax_name: ['', Validators.required],
      invoice_message: ['' ,Validators.required],
      company_name:['',Validators.required]
         
    });
  }

  ngOnInit(): void {
    this.fetchSettings();
  }
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.machineForm.patchValue({ logo: file });
    }
  }

  fetchSettings(): void {
    this.settingsService.getSettings().subscribe(
      (response) => {
        this.settings = response.data;
        const productData = response.data; 

          this.machineForm.patchValue({
            phone:productData.phone,
            address:productData.address ,
            tax_number:productData.tax_number,
            tax_name:productData.tax_name,
            invoice_message:productData.invoice_message,
            company_name:productData.company_name
          });

          if(productData.logo != 'none'){
            this.logo = productData.logo ;
          }
       
       
      },
      (error) => {
        this.msgError.push('حدث خطأ أثناء تحميل الإعدادات');
      }
    );
  }
  getLableByKey(key:string){
if (key == 'logo'){
  return 'شعار الشركة' ;
}else if (key == 'address'){
  return 'عنوان الشركة' ;
}else if (key == 'phone'){
  return " رقم الهاتف ";
}else if (key == 'tax_number'){
  return ' الرقم الضريبى' ;
}else if (key == 'tax_name)'){
  return ' السجل التجارى' ;
}else if (key == 'invoice_message'){
  return ' الرسالة المكتوبه آخر الفاتورة' ;
}else if (key == 'company_name'){
  return 'اسم الشركة' ;
}else {
  return "ادخل المعلومات" ;
}
  }

 
  handleForm(): void {
    if (this.machineForm.invalid) {
      this.isLoading = false;
      this.toastr.error('تأكد من ادخال جميع المعلومات');

      return;
    }
    const formData = new FormData();

    formData.append('phone', this.machineForm.get('phone')?.value || 'herer');
    formData.append('address', this.machineForm.get('address')?.value );
    formData.append('tax_number', this.machineForm.get('tax_number')?.value );
    formData.append('tax_name', this.machineForm.get('tax_name')?.value );
    formData.append('invoice_message', this.machineForm.get('invoice_message')?.value );
    formData.append('company_name', this.machineForm.get('company_name')?.value );
   

    // this.settings.forEach( (setting, index) => {

    //   if (this.selectedFile && setting.key ==) {
    //     formData.append('image', );
    //   }
    //   formData.append(`settings[${index}][id]`, setting.id);
    //   formData.append(`settings[${index}][value]`, this.machineForm.get(setting.key)?.value || '');
    // });
    

      if (this.selectedFile ) {

        formData.append('logo', this.selectedFile);
         
            }


    this.isLoading = true;

    this.settingsService.updateSettings(formData).subscribe(
      () => {
        this.isLoading = false;
        this.toastr.success('تم تحديث الاعدادات بنجاح');
        this.fetchSettings();
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('حدث خطأ أثناء تحديث الإعدادات');

      }
    );
  }
}
