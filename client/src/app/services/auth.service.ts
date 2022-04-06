import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken:any;
  user:any;
  constructor(private http:HttpClient) { }
  

 // sending data to login route in the backend to authenticate the user and to generate the JWT access token
    login(user){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/login',user,{headers:headers,})
   }

   //check if user is already logged in if so the redirect to the dashboard 
 checkAlreadyLogin(){
   let headers=new HttpHeaders();
   headers.append('Content-Type','application/json');
   headers.append( "credentials", "include");
   return this.http.get<any>('/checkAlreadyLogin',{headers:headers,})
}

   //forget password 
   forgetPassword(user){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/forgetPassword',user,{headers:headers,})
   }

//reset password to change the password after token verification is done
   getResetPassword(params){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/resetPassword/'+params.role+'/'+params.email+'/'+params.token,{headers:headers,})
   }

  //reset password to change the password after token verification is done
   resetPassword(password,params){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/resetPassword/'+params.role+'/'+params.email+'/'+params.token,password,{headers:headers,})
   }

 //secured page protection
 authenticateRoute(route){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/'+route,{headers:headers,})
   }

   //   sending the registration data of patients, doctors and admins
  registerUser(dataToSend){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post<any>('/register',dataToSend,{headers:headers})

  }

  //calling backend routes to display all the registration details of students, librarians  and admin on the admin dashboard
 getRegistrationDetails(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/registrationDetails',{headers:headers,})
   }


//librarian dashboard data 
 getLibrarianData(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/librarianDashboard',{headers:headers,})
   }

//student dashboard data 
 getStudentData(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/studentDashboard',{headers:headers,})
   }

  //add book
 addBook(data){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/addBook',data,{headers:headers,})
   } 

 //update book
 updateBook(data,book_id){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/updateBook/'+book_id,data,{headers:headers,})
   } 

 //get book details
 getBookDetails(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getBooks',{headers:headers,})
   } 

    //get single  book details for updation 
 getSingleBookDetails(book_id){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getBook/'+book_id,{headers:headers,})
   } 

 //issue a book
 issueBook(book_id){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/issueBook',book_id,{headers:headers,})
   } 

    // get issued book details
 getIssuedBooks(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getIssuedBooks',{headers:headers,})
   } 

   // list issued book users for a particular book
 listIssuedBooks(book_id){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/listIssuedBooks/'+book_id,{headers:headers,})
   } 

     // display a single book on librarian dashboard after the return button is clicked
 getIssuedBook(book_id,email){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getIssuedBook/'+book_id+'/'+email,{headers:headers,})
   } 

   // returning a book  
   returnBook(data){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/returnBook/',data,{headers:headers,})
   }

//data sending to the backend to delete a user
 deleteUser(role,email){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.delete<any>('/deleteUser/'+role+'/'+email,{headers:headers,})
   }


   //routes to get the  details from the database to display on the update page
   getUpdationDetails(email,role){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/updateUser/'+email+'/'+role,{headers:headers,})
   }

//data sending to the backend for updation of general details excluding password 
 updateRegistrationDetails(data,role){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/updateUser/'+role,data,{headers:headers,})
   }

  //rprotectind update password route 
   protectUpdatePasswordRoute(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/updatePassword/',{headers:headers,})
   }
 //rprotectind update password route 
   updatePassword(password,email,role){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/updatePassword/'+email+'/'+role,password,{headers:headers,})
   }

   //get fine details to display on librarian dashboard during fine payment 
   getFineDetails(email){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getFineDetails/'+email,{headers:headers,})
   }

    //pay fine  
   payFine(data){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('/payFine',data,{headers:headers,})
   }

    //get transaction details of an user  
   getTransactions(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/getTransactions',{headers:headers,})
   }
   // logging out the user   
logout(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/logout',{headers:headers,})
   }























}
