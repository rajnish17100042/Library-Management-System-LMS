import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  route:String;
  adminData:Object;

  constructor(
     private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

   ngOnInit(){
    
    this.route='adminDashboard';
    //take the page from frotend and role from the backend cookie
    
     this.authService.authenticateRoute(this.route).subscribe(data=>{
      if(data.success){
        this.adminData=data.adminData;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    });  
  
  }

  logout(){
     //go to backend logout route
    this.authService.logout().subscribe(
      data => {
       if(data.success){
          this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
          this.router.navigate(['/login']);
       }
       else{
            this.flashMessage.show("Something went wrong, Please try again",{cssClass:'alert-danger',timeout:3000});

       }
      }
      
    );
  }

}
