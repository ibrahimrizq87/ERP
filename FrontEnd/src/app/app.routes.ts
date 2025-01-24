import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { UsersComponent } from './Components/users/users.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { UpdateUserComponent } from './Components/update-user/update-user.component';
import { ShowUserComponent } from './Components/show-user/show-user.component';
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
import { EquationHistoryComponent } from './Components/equation-history/equation-history.component';
import { ShowEquationHistoryComponent } from './Components/show-equation-history/show-equation-history.component';
import { HistoryOfEquationComponent } from './Components/history-of-equation/history-of-equation.component';
import { Report5Component } from './Components/report5/report5.component';
import { RoleGuard } from './shared/guards/role.guard';
import { DashboardRedirectComponent } from './Components/dashboard-redirect/dashboard-redirect.component';
import { UpdateShiftWorkerComponent } from './Components/update-shift-worker/update-shift-worker.component';
import { ShowShiftWorkerComponent } from './Components/show-shift-worker/show-shift-worker.component';
import { UpdateSettingComponent } from './Components/update-setting/update-setting.component';
import { SalesInvoicesComponent } from './Components/sales-invoices/sales-invoices.component';
import { AddSalesInvoiceComponent } from './Components/add-sales-invoice/add-sales-invoice.component';
import { UpdateSalesInvoiceComponent } from './Components/update-sales-invoice/update-sales-invoice.component';
import { ShowSalesInvoiceComponent } from './Components/show-sales-invoice/show-sales-invoice.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { ShowSupervisorShiftComponent } from './Components/show-supervisor-shift/show-supervisor-shift.component';
import { ProductReportsComponent } from './Components/product-reports/product-reports.component';
import { ShiftReportComponent } from './Components/shift-report/shift-report.component';
import { ExpensesReportComponent } from './Components/expenses-report/expenses-report.component';


export const routes: Routes = [
{path:"",component:LoginComponent},
{path:"login",component:LoginComponent},
{path:"dashboard",component:DashboardComponent,children:[
    // {path:"",component:UsersComponent,canActivate: [RoleGuard],
    //     data: { roles: ['accountant','worker','admin','supervisor'] }},
    {
        path: '',
        canActivate: [RoleGuard],
        data: {
          roles: ['admin', 'accountant', 'worker', 'supervisor'],
        },
        component: DashboardRedirectComponent, // Temporary redirect handler component
      },
  
    {path:"users",component:UsersComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }}, 
    {path:"addUser",component:AddUserComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"updateUser/:id",component:UpdateUserComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"showUser/:id",component:ShowUserComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},

    {path:"products",component:ProductsComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"addProduct",component:AddProductComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"updateProduct/:id",component:UpdateProductComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"showProduct/:id",component:ShowProductComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},

    {path:"accounting/:id",component:AccountingComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},



        {path:"product/reports",component:ProductReportsComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','accountant'] }},
        {path:"shift/reports",component:ShiftReportComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','accountant'] }},
        {path:"expenses/reports",component:ExpensesReportComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','accountant'] }},


    {path:"addAccount/:id",component:AddAccountComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"accounting/:id/showAccount/:accountId",component:ShowAccountComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"accounting/:id/updateAccount/:accountId",component:UpdateAccountComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},

    {path:"editTaxRate",component:EditTaxRateComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},

    {path:"updateSettings",component:UpdateSettingComponent,canActivate: [RoleGuard],
            data: { roles: ['admin'] }},
        
    {path:"paymentDocument/:type",component:PaymentDocumentComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"addPaymentDocument/:type",component:AddPaymentDocumentComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"paymentDocument/:type/showDocument/:id",component:ShowDocumentComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"paymentDocument/:type/updateDocument/:id",component:UpdateDocumentComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},

    {path:"machines",component:MachinesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }}, 
    {path:"addMachine",component:AddMachineComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"updateMachine/:id",component:UpdateMachineComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"showMachine/:id",component:ShowMachineComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},


    {path:"shifts",component:ShiftsComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker','supervisor'] }}, 
    {path:"addShift",component:AddShiftComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker','supervisor'] }},
    {path:"updateShift/:id",component:UpdateShiftComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker','supervisor'] }},
    {path:"showShift/:id",component:ShowShiftComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker','supervisor'] }},
    {path:"closeShift/:id",component:CloseShiftComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','worker','supervisor'] }},

        {path:"show-supervisor-shift/:id",component:ShowSupervisorShiftComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','supervisor'] }},
        
    
    {path:"updateShiftWorker",component:UpdateShiftWorkerComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','worker'] }}, 
    {path:"showShiftWorker",component:ShowShiftWorkerComponent,canActivate: [RoleGuard],
            data: { roles: ['admin','worker'] }},
  
    // {path:"recieptDocuments",component:RecieptDocumentsComponent},  
    // {path:"addReciept",component:AddRecieptComponent},
    // {path:"updateReciept/:id",component:UpdateRecieptComponent},
    // {path:"showReciept/:id",component:ShowRecieptComponent},


    {path:"purchaseInvoices",component:PurchaseInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant', 'supervisor'] }}, 
    {path:"addPurchaseInvoice",component:AddPurchaseInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant', 'supervisor'] }},
    {path:"updatePurchase/:id",component:UpdatePurchaseInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant', 'supervisor'] }},
    {path:"showPurchase/:id",component:ShowPurchaseInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant', 'supervisor'] }},

    {path:"expensesInvoices",component:ExpensesInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},  
    {path:"addExpensesInvoices",component:AddExpensesInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"updateExpensesInvoices/:id",component:UpdateExpensesInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"showExpensesInvoices/:id",component:ShowExpensesInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
     
    
    {path:"salesInvoices",component:SalesInvoicesComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker'] }},  
    {path:"addSalesInvoice",component:AddSalesInvoiceComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker'] }},
    {path:"updateSalesInvoice/:id",component:UpdateSalesInvoiceComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker'] }},
    {path:"showSalesInvoice/:id",component:ShowSalesInvoiceComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker'] }},
    {path:"invoice/:id",component:InvoiceComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant','worker'] }}, 

    {path:"equations",component:EquationsComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},  
    {path:"addEquation",component:AddEquationComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"updateEquation/:id",component:UpdateEquationComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"showEquation/:id",component:ShowEquationComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},


    {path:"equationHistory",component:EquationHistoryComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"showEquationHistory/:id",component:ShowEquationHistoryComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},
    {path:"historyOfEquation/:id",component:HistoryOfEquationComponent,canActivate: [RoleGuard],
        data: { roles: ['admin'] }},

    {path:"report1",component:TestComponent,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"report2",component:Test2Component,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"report3",component:Test3Component,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"report4",component:Test4Component,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
    {path:"report5",component:Report5Component,canActivate: [RoleGuard],
        data: { roles: ['admin','accountant'] }},
]}
];