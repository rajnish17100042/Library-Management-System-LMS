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
    return this.http.post<any>('http://localhost:5000/login',user,{headers:headers,})
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

//data sending to the backend to delete a user
 deleteUser(role,email){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.delete<any>('/deleteUser/'+role+'/'+email,{headers:headers,})
   }

   // logging out the user   
logout(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/logout',{headers:headers,})
   }























}
