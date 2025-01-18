
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

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.machineForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.fetchSettings();
  }

  fetchSettings(): void {
    this.settingsService.getSettings().subscribe(
      (response) => {
        this.settings = response.data;
        this.createFormControls();
      },
      (error) => {
        this.msgError.push('حدث خطأ أثناء تحميل الإعدادات');
      }
    );
  }

  createFormControls(): void {
    this.settings.forEach(setting => {
      this.machineForm.addControl(setting.key, this.fb.control(setting.value, Validators.required));
    });
  }

  handleForm(): void {
    if (this.machineForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedSettings = this.machineForm.value;

    this.settingsService.updateSettings(updatedSettings).subscribe(
      () => {
        this.isLoading = false;
        // Handle success response (e.g., show a success message)
      },
      (error) => {
        this.isLoading = false;
        this.msgError.push('حدث خطأ أثناء تحديث الإعدادات');
      }
    );
  }
}
