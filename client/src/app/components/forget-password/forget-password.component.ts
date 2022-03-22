import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  email:String;
  role:String;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
  }

forgetPassword(){
  // console.log(this.email);
  const user={
    email:this.email,
    role:this.role,
  }
  
     //required all the fields
    if(!user.role){
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

  this.authService.forgetPassword(user).subscribe(data=>{
      if(data.success){
        // console.log(data.token);
        this.flashMessage.show("Please check Your Mail",{cssClass:'alert-success',timeout:3000});
       }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
        // console.log(data.message);

      }
  });

  }


}
