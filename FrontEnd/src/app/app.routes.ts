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

export const routes: Routes = [
{path:"",component:LoginComponent},
{path:"login",component:LoginComponent},
{path:"dashboard",component:DashboardComponent,children:[
    {path:"users",component:UsersComponent},  
    {path:"addUser",component:AddUserComponent},
    {path:"updateUser/:id",component:UpdateUserComponent},
    {path:"showUser/:id",component:ShowUserComponent},

    {path:"recieptDocuments",component:RecieptDocumentsComponent},  
    {path:"addReciept",component:AddRecieptComponent},
    {path:"updateReciept/:id",component:UpdateRecieptComponent},
    {path:"showReciept/:id",component:ShowRecieptComponent},

]}
];