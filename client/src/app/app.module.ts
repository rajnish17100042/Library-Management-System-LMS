import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule,RoutingComponents } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import {ValidateService}from './services/validate.service';
import {AuthService}from './services/auth.service';
import { FlashMessagesModule } from 'flash-messages-angular';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UserRegistrationComponent } from './components/admin/user-registration/user-registration.component';
import { RegistrationDetailsComponent } from './components/admin/registration-details/registration-details.component';
import { LibrarianDashboardComponent } from './components/librarian/librarian-dashboard/librarian-dashboard.component';
import { AddBookComponent } from './components/librarian/add-book/add-book.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { DisplayBooksComponent } from './components/display-books/display-books.component';
import { DisplayIssuedbooksComponent } from './components/student/display-issuedbooks/display-issuedbooks.component';
import { ListIssuedbooksComponent } from './components/librarian/list-issuedbooks/list-issuedbooks.component';
import { UpdateAdminComponent } from './components/admin/update-admin/update-admin.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { UpdateBookComponent } from './components/librarian/update-book/update-book.component';
import { ReturnBookComponent } from './components/librarian/return-book/return-book.component';
import { PayFineComponent } from './components/librarian/pay-fine/pay-fine.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    NavbarComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AdminDashboardComponent,
    UserRegistrationComponent,
    RegistrationDetailsComponent,
    LibrarianDashboardComponent,
    AddBookComponent,
    StudentDashboardComponent,
    DisplayBooksComponent,
    DisplayIssuedbooksComponent,
    ListIssuedbooksComponent,
    UpdateAdminComponent,
    UpdatePasswordComponent,
    UpdateBookComponent,
    ReturnBookComponent,
    PayFineComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    HttpClientModule,
  ],
  providers: [ValidateService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
