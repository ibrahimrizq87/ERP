import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-settings',
  templateUrl: './update-settings.component.html',
  styleUrls: ['./update-settings.component.css']
})
export class UpdateSettingComponent {
  // machineForm: FormGroup;
  // settings: any[] = [];
  // isLoading: boolean = false;
  // msgError: string[] = [];

  // constructor(private fb: FormBuilder, private settingsService: SettingsService) {
  //   this.machineForm = this.fb.group({});
  // }

  // ngOnInit(): void {
  //   this.fetchSettings();
  // }

  // fetchSettings(): void {
  //   this.settingsService.getSettings().subscribe(
  //     (data) => {
  //       this.settings = data;
  //       this.createFormControls();
  //     },
  //     (error) => {
  //       this.msgError.push('حدث خطأ أثناء تحميل الإعدادات');
  //     }
  //   );
  // }

  // createFormControls(): void {
  //   this.settings.forEach(setting => {
  //     this.machineForm.addControl(setting.key, this.fb.control(setting.value, Validators.required));
  //   });
  // }

  // handleForm(): void {
  //   if (this.machineForm.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   const updatedSettings = this.machineForm.value;

  //   this.settingsService.updateSettings(updatedSettings).subscribe(
  //     () => {
  //       this.isLoading = false;
  //       // Handle success response (e.g., show a success message)
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.msgError.push('حدث خطأ أثناء تحديث الإعدادات');
  //     }
  //   );
  // }
}
