import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';
import { MachineService } from '../../shared/services/machine.service';

@Component({
  selector: 'app-update-shift-worker',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-shift-worker.component.html',
  styleUrl: './update-shift-worker.component.css',
})
export class UpdateShiftWorkerComponent implements OnInit {
  selectedProducts: any[] = [];
  msgError: any[] = [];
  isLoading: boolean = false;
  shiftForm: FormGroup;
  selectedImages: { [key: string]: File | null } = {}; 
  products: any;
  machines: any;
  old_machines:any;
  total_online_value:any;
  totalAmount: number = 0;
  totalCash: number = 0;
  readonly maxImageSize = 2048 * 1024;
  total_client: any;
  totalLiters: number = 0;
  totalOnlineLimitExceeded: boolean = false;
  totalLiterForEachProduct: any;
  shift_id: any;
  constructor(
    private _MachineService:MachineService,
    private fb: FormBuilder,
    private router: Router,
    private _ShiftService: ShiftService,
    private route: ActivatedRoute,
    private toastr:ToastrService,
    private _ProductService:ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.shiftForm = this.fb.group({
     
      online_image: this.fb.control(null, [this.validateImage.bind(this)]),
      online_payments: this.fb.array([]),  
      total_online:this.fb.control(this.total_online_value,[Validators.required,Validators.min(0)])  
      
    });
    
  }

  ngOnInit(): void {
   
    this.loadProducts()
    this.loadMyShift()
    this.shiftForm.get('total_online')?.valueChanges.subscribe(() => {
      this.calculateTotalCash();
    });
    
  }
  selectedFile: File | null = null;

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.shiftForm.patchValue({ online_image: file });
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
  
  loadProducts(): void {
    this._ProductService.viewAllProducts().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.products = response; 
        
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  loadMyShift(): void {
    this._ShiftService.getMyshift().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.total_client = response.data.total_money_client; 
          this.old_machines =response.data.shiftMachines;
          // this.total_online_value=response.data.total_money_online;
          // this.shiftForm.get('total_online')?.setValue(response.data.total_money_online || 0);
          const shitMachiens :Machine[]= this.old_machines ;
          shitMachiens.forEach((ele)=>{
          this.addOnlinePayment(ele);
          })
          this.calculateTotalCash(); 
          this.shift_id=response.data.id
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  onMachineChange( index: number , machine_id:string): void{
    const paymentControl = this.onlinePayments.at(index) as FormGroup;
    this._MachineService.getMachineById(machine_id).subscribe({
      next: (response) => {
        console.log(response);
        paymentControl.get('start_amount')?.setValue(response.start_amount || 0);

      },
      error: (err) => {
        console.error('Error fetching machines:', err);
      },
    });

  //   const machines2 =         paymentControl.get('machines');

  //   const selectedMachine = machines2.find((machine: any) => machine.id === parseInt(machine_id));
  //   if (selectedMachine) {
  // console.log("testeregrefv" ,selectedMachine.start_amount );
  //   }
  
  
   
  }
  onProductChange(product_id: string, index: number): void {
    if (!product_id) return;
  
    // Find the selected product by ID
    const selectedProduct = this.products.find((product: any) => product.id === parseInt(product_id));
    if (selectedProduct) {
      // Set the start_amount in the form
      const paymentControl = this.onlinePayments.at(index) as FormGroup;
      // paymentControl.get('start_amount')?.setValue(selectedProduct.start_amount || 0);
      paymentControl.get('price')?.setValue(selectedProduct.price || 0);
    }
  
    // Fetch machines related to the product (if applicable)
    this._ShiftService.getMachineByProduct(product_id).subscribe({
      next: (response) => {
        console.log(response);
        // Store machines for this specific row
        const machines = response.data || [];
        const paymentControl = this.onlinePayments.at(index) as FormGroup;
  
        // Update the machines control for this specific payment row
        paymentControl.get('machines')?.setValue(machines);
      },
      error: (err) => {
        console.error('Error fetching machines:', err);
      },
    });
  }
  
  
  addOnlinePayment(payment:any|null): void {
  if (payment == null){
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    const newPaymentGroup = this.fb.group({
      product_id: [null, [Validators.required]],
      machine_id: [null, [Validators.required]],
      start_amount: [0], 
      total_money: [0],
      price: [0], 
      close_amount: [null, [Validators.required]],
      total_liters: [0], 
      image: [null],
      id: [-1],
      machines: [[]], // Initialize machines as an empty array
    });
  
    // newPaymentGroup.get('close_amount')?.valueChanges.subscribe(() => {
    //   this.updateTotalLiters(newPaymentGroup);
    // });
    newPaymentGroup.get('close_amount')?.valueChanges.subscribe(() => {
      const index = this.onlinePayments.controls.indexOf(newPaymentGroup);
      if (index !== -1) {
        this.updateTotalLiters(newPaymentGroup, index);
      } else {
        console.error('Payment group not found in the form array.');
      }
    });
    onlinePaymentsFormArray.push(newPaymentGroup);
    this.calculateTotalAmount();
  }else{
    // const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
   
    // const newPaymentGroup = this.fb.group({
    //   product_id: [payment.product_id, [Validators.required]],
    //   machine_id: [payment.machine_id, [Validators.required]],
    //   start_amount: [payment.open_amount], 
    //   total_money: [payment.total_money],
    //   price: [payment.product.price], 
    //   close_amount: [payment.close_amount, [Validators.required]],
    //   total_liters: [payment.total_liters_amount], 
    //   id: [payment.id],

    //   image: [null],
    //   machines: [[]], // Initialize machines as an empty array
    // });
    // this._ShiftService.getMachineByProduct(payment.product_id).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     // Store machines for this specific row
    //     const machines = response.data || [];
    //     newPaymentGroup.get('machines')?.setValue(machines)
        
    //   },
    //   error: (err) => {
    //     console.error('Error fetching machines:', err);
    //   },
    // });
  
    // // newPaymentGroup.get('close_amount')?.valueChanges.subscribe(() => {
    // //   this.updateTotalLiters(newPaymentGroup);
    // // });
    // newPaymentGroup.get('close_amount')?.valueChanges.subscribe(() => {
    //   const index = this.onlinePayments.controls.indexOf(newPaymentGroup);
    //   if (index !== -1) {
    //     this.updateTotalLiters(newPaymentGroup, index);
    //   } else {
    //     console.error('Payment group not found in the form array.');
    //   }
    // });
    // onlinePaymentsFormArray.push(newPaymentGroup);
    // this.calculateTotalAmount();
  }
  }
  
  calculateTotalAmount(): void {
    this.totalAmount = this.onlinePayments.controls.reduce((sum, paymentGroup) => {
      const totalMoney = paymentGroup.get('total_money')?.value || 0;
      return sum + totalMoney;
    }, 0);
    this.calculateTotalCash();
  }
  
  calculateTotalCash(): void {
    const totalOnline = this.shiftForm.get('total_online')?.value || 0;
    console.log(this.totalAmount)
    console.log(totalOnline)
    console.log(this.total_client)
    this.totalCash = +this.totalAmount-(+this.total_client+totalOnline );

    const maxAllowedTotalOnline = this.totalAmount - this.total_client;
    if (totalOnline > maxAllowedTotalOnline) {
      this.totalOnlineLimitExceeded = true;
    } else {
      this.totalOnlineLimitExceeded = false;
    }
  }
 
  
 
  updateTotalLiters(paymentGroup: FormGroup, index: number): void {
  const startAmount = paymentGroup.get('start_amount')?.value || 0;
  const closeAmount = paymentGroup.get('close_amount')?.value || 0;
  const price = paymentGroup.get('price')?.value || 0;
  const totalLiters = closeAmount - startAmount;
  const totalMoney = totalLiters * price;

  // Update total liters and money in the form group
  paymentGroup.get('total_liters')?.setValue(totalLiters, { emitEvent: false });
  paymentGroup.get('total_money')?.setValue(totalMoney, { emitEvent: false });

  console.log(`Total liters calculated: ${totalLiters}`);
  this.calculateTotalAmount();

  // Retrieve the product ID
  const productId = paymentGroup.get('product_id')?.value;

  if (!productId) {
    console.error('Product ID is missing.');
    return;
  }

  // Initialize or update selectedProducts array
  this.aggregateProducts();
}

aggregateProducts(): void {
  const productTotals: { [key: string]: { totalLiters: number, productName: string } } = {};

  // Loop through all form groups to calculate total liters per product
  this.onlinePayments.controls.forEach((group: AbstractControl) => {
    const formGroup = group as FormGroup;
    const productId = formGroup.get('product_id')?.value;
    const totalLiters = formGroup.get('total_liters')?.value || 0;
  
    if (productId) {
      const product = this.products.find((p: any) => p.id === parseInt(productId, 10));
      if (product) {
        if (!productTotals[productId]) {
          productTotals[productId] = {
            totalLiters: 0,
            productName: product.name,
          };
        }
        productTotals[productId].totalLiters += totalLiters;
      }
    }
  });
  

  // Update the selectedProducts array with aggregated values
  this.selectedProducts = Object.keys(productTotals).map(productId => ({
    product_id: parseInt(productId, 10),
    product_name: productTotals[productId].productName,
    total_liters: productTotals[productId].totalLiters,
  }));

  console.log('Aggregated products:', this.selectedProducts);
}

  
  removeOnlinePayment(index: number): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.removeAt(index);
    this.calculateTotalAmount();
   
  }
  


  handleForm(): void {
    if (this.shiftForm.invalid) {
      this.toastr.error('يرجى ادخال جميع المعلومات لإتمام العملية');
      console.log('Form validation failed:', this.shiftForm.errors);
      this.shiftForm.markAllAsTouched(); // Highlight errors in form
      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
  
  
    this.onlinePayments.controls.forEach((paymentControl, index) => {
      formData.append(`machines[${index}][product_id]`, paymentControl.get('product_id')?.value || '');
      formData.append(`machines[${index}][machine_id]`, paymentControl.get('machine_id')?.value || '');
      formData.append(`machines[${index}][close_amount]`, paymentControl.get('close_amount')?.value || '');
      formData.append(`machines[${index}][total_liters]`, paymentControl.get('total_liters')?.value || '');
      formData.append(`machines[${index}][total_money]`, paymentControl.get('total_money')?.value || '');
      const image = this.selectedImages[`online_payment_${index}`];
      console.log("image", image);
      if (image) {
        formData.append(`machines[${index}][close_image]`, image);
      }
      
    });
  
    if (this.selectedFile) {
      console.log("online_image",this.selectedFile)
      formData.append('online_image', this.selectedFile);
    }
    formData.append('total_online', this.shiftForm.get('total_online')?.value || '');
    formData.append('total_money',this.totalAmount.toString());
    formData.append('total_client',this.total_client.toString());
    formData.append('total_cash',this.totalCash.toString());
    
    // Debugging: Log the FormData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
   
  
    // const shiftId = this.route.snapshot.paramMap.get('id');
    // if (shiftId) {
      this._ShiftService.updateShiftWorker(formData,this.shift_id).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            this.toastr.success('تم تحديث الوردية بنجاح');

            this.router.navigate(['/dashboard/showShiftWorker']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
          if(err.status == 422){
            this.toastr.error('يرجى ادخال جميع المعلومات لإتمام العملية');

          }else{
            this.toastr.error('حدث خطأ، يرجى المحاولة مرة أخرى');

          }

        }
      });
    // }
    console.log('Form values before submitting:', this.shiftForm.value);
  }
  

  onCancel(): void {
    this.shiftForm.reset();
    this.router.navigate(['/dashboard/shifts']);
  }

  get onlinePayments(): FormArray {
    return this.shiftForm.get('online_payments') as FormArray;
  }


  onFileSelected(event: any, formName: string, index: number): void {
    const file = event.target.files[0];
    if (file) {
      // Store the file with a consistent key format
      this.selectedImages[`${formName}_${index}`] = file;
      // console.log(`Selected image for ${formName}_${index}:`, file);
    }
  }
  
}
interface Machine {
  id: number;
  product_id: number;
  machine_id: number;

  // Other properties...
}