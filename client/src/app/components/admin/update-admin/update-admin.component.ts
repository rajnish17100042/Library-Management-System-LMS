import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrls: ['./update-admin.component.css']
})
export class UpdateAdminComponent implements OnInit {
    public admin={
   name:'',
   email:'',
   phone:'',
   address:'',
   city:'',
   state:'',
   pincode:'',
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
   
    
     this.authService.getUpdationDetails(this.email,this.role).subscribe(
      data => {
       if(data.success){
          this.flashMessage.show("Displaying the updation details",{cssClass:'alert-success',timeout:3000});
          this.admin=data.user;
          this.is_render=true;
         
       }
       else{
            this.flashMessage.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});
            this.router.navigate(['/login']);
       }
      }
      
    );
   

  }

   updateAdmin(){
    const role='admin';
    
    //required all the fields
    if(!this.validateService.validateUpdationDetails(this.admin)){
      // window.alert("Please fill in all the fields");
    
      this.flashMessage.show("Please fill in all the fields",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
    //validate email
    if(!this.validateService.validateEmail(this.admin.email)){
      // window.alert("Please enter the correct email");
      this.flashMessage.show("Please enter the correct email",{cssClass:'alert-danger',timeout:3000});
      return false;
    }

    //send admin data to the server
    this.authService.updateRegistrationDetails(this.admin,role).subscribe(
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
