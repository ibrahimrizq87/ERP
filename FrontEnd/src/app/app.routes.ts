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
import { PurchaseInvoicesComponent } from './Components/purchase-invoices/purchase-invoices.component';
import { AddPurchaseInvoicesComponent } from './Components/add-purchase-invoices/add-purchase-invoices.component';
import { UpdatePurchaseInvoicesComponent } from './Components/update-purchase-invoices/update-purchase-invoices.component';
import { ShowPurchaseInvoicesComponent } from './Components/show-purchase-invoices/show-purchase-invoices.component';
import { ExpensesInvoicesComponent } from './Components/expenses-invoices/expenses-invoices.component';
import { AddExpensesInvoicesComponent } from './Components/add-expenses-invoices/add-expenses-invoices.component';
import { UpdateExpensesInvoicesComponent } from './Components/update-expenses-invoices/update-expenses-invoices.component';
import { ShowExpensesInvoicesComponent } from './Components/show-expenses-invoices/show-expenses-invoices.component';
import { TestComponent } from './Components/test/test.component';
import { Test2Component } from './Components/test2/test2.component';
import { Test3Component } from './Components/test3/test3.component';
import { Test4Component } from './Components/test4/test4.component';
import { EquationsComponent } from './Components/equations/equations.component';
import { AddEquationComponent } from './Components/add-equation/add-equation.component';
import { UpdateEquationComponent } from './Components/update-equation/update-equation.component';
import { ShowEquationComponent } from './Components/show-equation/show-equation.component';

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


    {path:"purchaseInvoices",component:PurchaseInvoicesComponent},  
    {path:"addPurchaseInvoice",component:AddPurchaseInvoicesComponent},
    {path:"updatePurchase/:id",component:UpdatePurchaseInvoicesComponent},
    {path:"showPurchase/:id",component:ShowPurchaseInvoicesComponent},

    {path:"expensesInvoices",component:ExpensesInvoicesComponent},  
    {path:"addExpensesInvoices",component:AddExpensesInvoicesComponent},
    {path:"updateExpensesInvoices/:id",component:UpdateExpensesInvoicesComponent},
    {path:"showExpensesInvoices/:id",component:ShowExpensesInvoicesComponent},
     


    {path:"equations",component:EquationsComponent},  
    {path:"addEquation",component:AddEquationComponent},
    {path:"updateEquation/:id",component:UpdateEquationComponent},
    {path:"showEquation/:id",component:ShowEquationComponent},

    {path:"test",component:TestComponent},
    {path:"test2",component:Test2Component},
    {path:"test3",component:Test3Component},
    {path:"test4",component:Test4Component},
    
]}
];