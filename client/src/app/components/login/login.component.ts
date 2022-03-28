import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:String;
  password:String;
  role:String;

   constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    ) { }

  ngOnInit(){
    //check if already logged In
  }

login(){
  // console.log(this.email);
  const user={
    email:this.email,
    password:this.password,
    role:this.role,
  }
  
     //required all the fields
    if(!this.validateService.validateLoginData(user)){
      // window.alert("Please fill in all the fields");
      this.flashMessage.show("Please fill in all the fields correctly",{cssClass:'alert-danger',timeout:3000});
      // console.log("inside login validation");
      return false;
    }
    //validate email
    if(!this.validateService.validateEmail(user.email)){
      // window.alert("Please enter the correct email");
      this.flashMessage.show("Please enter the correct email",{cssClass:'alert-danger',timeout:3000});
            // console.log("inside Email validation");

      return false;
    }

  this.authService.login(user).subscribe(data=>{
      if(data.success){
        // console.log(data.token);
        this.flashMessage.show("Successfully Logged In",{cssClass:'alert-success',timeout:3000});
        // console.log("logged In");

        // console.log(data.role);
        if(data.role==='admin'){
        this.router.navigate(['/admin/dashboard']);
        // this.flashMessage.show("Admin Login",{cssClass:'alert-success',timeout:3000});
        // console.log("Admin");


        }
        else if(data.role==='librarian'){
        //  this.router.navigate(['/librarian/dashboard']);
        this.flashMessage.show("Librarian Login",{cssClass:'alert-success',timeout:3000});
        // console.log("Librarian");


        }else if(data.role==='student'){
        //  this.router.navigate(['/student/dashboard']);
        this.flashMessage.show("Student Login",{cssClass:'alert-success',timeout:3000});
        // console.log("Student");


        }
        
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
        // console.log(data.message);

      }
  });

  }



}
