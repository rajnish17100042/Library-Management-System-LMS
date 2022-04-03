import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  public password={
   currentPassword:'',
   newPassword:'',
   confirmNewPassword:'',
  };
  is_render:boolean = false;
  email:String;
  role:String;
  constructor(
     private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.params['email'];
    this.role = this.route.snapshot.params['role'];

    this.authService.protectUpdatePasswordRoute().subscribe(
      data => {
       if(data.success){
            this.is_render=true;
         }
       else{
        this.router.navigate(['/login']);
       }
      }
      
    );
   

  }

  updatePassword(){
    
    this.email= this.route.snapshot.params['email'];
    this.role= this.route.snapshot.params['role'];
   
    
  
    if(!this.validateService.validateUpdatePassword(this.password)){
      this.flashMessage.show("Please fill in all the fields",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
   

    //send  data to the server
    this.authService.updatePassword(this.password,this.email,this.role).subscribe(
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
