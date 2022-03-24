import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  render:boolean = false;
  password:String;
  cpassword:String;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(){
    const params=this.route.snapshot.params;
    this.authService.getResetPassword(params).subscribe(data=>{
      if(data.success){
       this.render=true;
      //  this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
        
       }else{
          this.router.navigate(['/login']);
       }
    }); 
  }

resetPassword(){
  // console.log(this.email);
  const password={
    password:this.password,
    cpassword:this.cpassword
   
  }
  
     //required all the fields
    if((!this.password||!this.cpassword) || this.password!==this.cpassword){
      // window.alert("Please fill in all the fields");
      this.flashMessage.show("Please fill in all the fields correctly",{cssClass:'alert-danger',timeout:3000});
      // console.log("inside login validation");
      return false;
    }
   
   const params=this.route.snapshot.params;
   //print out the parameters  
  //  console.log(this.route.snapshot.params);

  this.authService.resetPassword(password,params).subscribe(data=>{
      if(data.success){
        // console.log(data.token);
        this.flashMessage.show("Password Reset Successfully",{cssClass:'alert-success',timeout:3000});
        this.router.navigate(['/login']);

       
        
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
        // console.log(data.message);

      }
  });

  }

}
