import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UserRegistrationComponent } from './components/admin/user-registration/user-registration.component';
const routes: Routes = [
  // routing for the common login page 
  {
   path:'login',
   component:LoginComponent,
  },
   // routing for forget password
  {
   path:'forget-password',
   component:ForgetPasswordComponent,
  },
   // routing for reset password
  {
   path:'reset-password/:role/:email/:token',
   component:ResetPasswordComponent,
  },
   // routing for Admin Dashboard
  {
   path:'admin/dashboard',
   component: AdminDashboardComponent,
  },
   // routing for user Registration 
  {
   path:'admin/user-registration',
   component: UserRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents=[LoginComponent,ForgetPasswordComponent,ResetPasswordComponent, AdminDashboardComponent,UserRegistrationComponent]