import { Component, OnInit } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  name:String;
  email:String;
  phone:String;
  address:String;
  city:String;
  state:String;
  pincode:String;
  role:String;
  is_render:boolean =false;

  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

 ngOnInit() {
  const route='adminDashboard';
  
  this.authService.authenticateRoute(route).subscribe(data=>{
      if(data.success){
        this.is_render=true;
       this.flashMessage.show("Rendering Page Please wait",{cssClass:'alert-success',timeout:3000});
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
  }); 
  }

  registerUser(){
    // window.alert("Form is submitting");
    // console.log(this.name);
    const dataToSend={
      name:this.name,
      email:this.email,
      phone:this.phone,
      address:this.address,
      city:this.city,
      state:this.state,
      pincode:this.pincode,
      role:this.role,
      
    };
    
    

    
      //required all the fields
    if(!this.validateService.validateRegistration(dataToSend)){
      // window.alert("Please fill in all the fields");
      this.flashMessage.show("Please fill in all the fields ",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
    //validate email
    if(!this.validateService.validateEmail(dataToSend.email)){
      
      this.flashMessage.show("Please enter the correct email",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
    
     //validate mobile number   
    if(!this.validateService.validateMobileNumber(dataToSend.phone)){
     this.flashMessage.show("Please enter the correct mobile number",{cssClass:'alert-danger',timeout:3000});
      return false;
    }

    //validate pincode  
    if(!this.validateService.validatePincode(dataToSend.pincode)){
     this.flashMessage.show("Please enter the correct Pincode",{cssClass:'alert-danger',timeout:3000});
      return false;
    }

    //send admin data to the server
    this.authService.registerUser(dataToSend).subscribe(
      data => {
       if(data.success){
          this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
          this.router.navigate(['/login']);
       }
       else{
            this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});

       }
      }
      
    );
  }
  

}
