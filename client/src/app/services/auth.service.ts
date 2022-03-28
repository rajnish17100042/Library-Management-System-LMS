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
    return this.http.post<any>('http://localhost:5000/forgetPassword',user,{headers:headers,})
   }

//reset password to change the password after token verification is done
   getResetPassword(params){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('http://localhost:5000/resetPassword/'+params.role+'/'+params.email+'/'+params.token,{headers:headers,})
   }

  //reset password to change the password after token verification is done
   resetPassword(password,params){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.post<any>('http://localhost:5000/resetPassword/'+params.role+'/'+params.email+'/'+params.token,password,{headers:headers,})
   }

 //admin dashboard protection  
 authenticateRoute(route){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/'+route,{headers:headers,})
   }
   // logging out the user   
logout(){
    let headers=new HttpHeaders();
    headers.append('Content-Type','application/json');
    headers.append( "credentials", "include");
    return this.http.get<any>('/logout',{headers:headers,})
   }























}
