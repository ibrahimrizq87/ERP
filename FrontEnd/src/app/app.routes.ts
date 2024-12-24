import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { UsersComponent } from './Components/users/users.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { UpdateUserComponent } from './Components/update-user/update-user.component';
import { ShowUserComponent } from './Components/show-user/show-user.component';
import { RecieptDocumentsComponent } from './Components/reciept-documents/reciept-documents.component';
import { AddRecieptComponent } from './Components/add-reciept/add-reciept.component';
import { UpdateRecieptComponent } from './Components/update-reciept/update-reciept.component';
import { ShowRecieptComponent } from './Components/show-reciept/show-reciept.component';
import { ProductsComponent } from './Components/products/products.component';
import { AddProductComponent } from './Components/add-product/add-product.component';
import { UpdateProductComponent } from './Components/update-product/update-product.component';
import { ShowProductComponent } from './Components/show-product/show-product.component';

import { MachinesComponent } from './Components/machines/machines.component';
import { AddMachineComponent } from './Components/add-machine/add-machine.component';
import { UpdateMachineComponent } from './Components/update-machine/update-machine.component';
import { ShowMachineComponent } from './Components/show-machine/show-machine.component';
import { ShiftsComponent } from './Components/shifts/shifts.component';
import { AddShiftComponent } from './Components/add-shift/add-shift.component';
import { UpdateShiftComponent } from './Components/update-shift/update-shift.component';
import { ShowShiftComponent } from './Components/show-shift/show-shift.component';
import { AccountingComponent } from './Components/accounting/accounting.component';
import { AddAccountComponent } from './Components/add-account/add-account.component';
import { PaymentDocumentComponent } from './Components/payment-document/payment-document.component';
import { AddPaymentDocumentComponent } from './Components/add-payment-document/add-payment-document.component';
import { CloseShiftComponent } from './Components/close-shift/close-shift.component';
import { ShowAccountComponent } from './Components/show-account/show-account.component';
import { UpdateAccountComponent } from './Components/update-account/update-account.component';
import { ShowDocumentComponent } from './Components/show-document/show-document.component';
import { UpdateDocumentComponent } from './Components/update-document/update-document.component';
import { EditTaxRateComponent } from './Components/edit-tax-rate/edit-tax-rate.component';

export const routes: Routes = [
{path:"",component:LoginComponent},
{path:"login",component:LoginComponent},
{path:"dashboard",component:DashboardComponent,children:[
    {path:"",component:UsersComponent},
    {path:"users",component:UsersComponent},  
    {path:"addUser",component:AddUserComponent},
    {path:"updateUser/:id",component:UpdateUserComponent},
    {path:"showUser/:id",component:ShowUserComponent},

    {path:"products",component:ProductsComponent},  
    {path:"addProduct",component:AddProductComponent},
    {path:"updateProduct/:id",component:UpdateProductComponent},
    {path:"showProduct/:id",component:ShowProductComponent},

    {path:"accounting/:id",component:AccountingComponent},
    {path:"addAccount/:id",component:AddAccountComponent},
    {path:"accounting/:id/showAccount/:accountId",component:ShowAccountComponent},
    {path:"accounting/:id/updateAccount/:accountId",component:UpdateAccountComponent},

    {path:"editTaxRate",component:EditTaxRateComponent},

    {path:"paymentDocument/:type",component:PaymentDocumentComponent},
    {path:"addPaymentDocument/:type",component:AddPaymentDocumentComponent},
    {path:"paymentDocument/:type/showDocument/:id",component:ShowDocumentComponent},
    {path:"paymentDocument/:type/updateDocument/:id",component:UpdateDocumentComponent},

    {path:"machines",component:MachinesComponent},  
    {path:"addMachine",component:AddMachineComponent},
    {path:"updateMachine/:id",component:UpdateMachineComponent},
    {path:"showMachine/:id",component:ShowMachineComponent},


    {path:"shifts",component:ShiftsComponent},  
    {path:"addShift",component:AddShiftComponent},
    {path:"updateShift/:id",component:UpdateShiftComponent},
    {path:"showShift/:id",component:ShowShiftComponent},
    {path:"closeShift/:id",component:CloseShiftComponent},

    {path:"recieptDocuments",component:RecieptDocumentsComponent},  
    {path:"addReciept",component:AddRecieptComponent},
    {path:"updateReciept/:id",component:UpdateRecieptComponent},
    {path:"showReciept/:id",component:ShowRecieptComponent},

]}
];