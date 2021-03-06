import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UpdateAdminComponent } from './components/admin/update-admin/update-admin.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { LibrarianDashboardComponent } from './components/librarian/librarian-dashboard/librarian-dashboard.component';
import { PayFineComponent } from './components/librarian/pay-fine/pay-fine.component';
import { UpdateBookComponent } from './components/librarian/update-book/update-book.component';
import { ReturnBookComponent } from './components/librarian/return-book/return-book.component';
import { ListIssuedbooksComponent } from './components/librarian/list-issuedbooks/list-issuedbooks.component';
import { StudentDashboardComponent } from './components/student/student-dashboard/student-dashboard.component';
import { AddBookComponent } from './components/librarian/add-book/add-book.component';
import { DisplayBooksComponent } from './components/display-books/display-books.component';
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
   // routing for Librarian Dashboard
  {
   path:'librarian/dashboard',
   component: LibrarianDashboardComponent,
  },
    // routing for student Dashboard
  {
   path:'student/dashboard',
   component: StudentDashboardComponent,
  },
   // routing for user Registration 
  {
   path:'admin/user-registration',
   component: UserRegistrationComponent,
  },
    // routing for librarian to add book
  {
   path:'librarian/add-book',
   component: AddBookComponent,
  },
    // display books
  {
   path:'student/display-books',
   component: DisplayBooksComponent,
  },
   {
   path:'librarian/display-books',
   component: DisplayBooksComponent,
   children:[
     {
       path:':book_id',
       component:ListIssuedbooksComponent,
      }
   ]
  },
     // update user details
  {
   path:'admin/update-user/:email/:role',
   component: UpdateAdminComponent,
  },
     // update password
  {
   path:'update-password/:email/:role',
   component: UpdatePasswordComponent,
  },
     // update book details
  {
   path:'librarian/update-book/:book_id',
   component: UpdateBookComponent,
  },

  //return book
  {
    path:'librarian/return-book/:book_id/:email',
    component:ReturnBookComponent,
  },

   //pay fine
  {
    path:'librarian/pay-fine/:email',
    component:PayFineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents=[LoginComponent,ForgetPasswordComponent,ResetPasswordComponent, AdminDashboardComponent,UserRegistrationComponent,LibrarianDashboardComponent,StudentDashboardComponent,DisplayBooksComponent,ListIssuedbooksComponent,UpdateAdminComponent,UpdatePasswordComponent,UpdateBookComponent,ReturnBookComponent,PayFineComponent]