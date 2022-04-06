import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-pay-fine',
  templateUrl: './pay-fine.component.html',
  styleUrls: ['./pay-fine.component.css']
})
export class PayFineComponent implements OnInit {
  fineData:Object;
  fineAmount:Number;
  finePurpose:String;
  is_render:boolean = false;
  email:String;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
     private route: ActivatedRoute,
  ) { }

  ngOnInit(){
    this.email = this.route.snapshot.params['email'];
     this.authService.getFineDetails(this.email).subscribe(
      data => {
       if(data.success){
          this.flashMessage.show("Page Loading...",{cssClass:'alert-success',timeout:3000});
          console.log(data.fineData);
          this.fineData=data.fineData;
          this.is_render=true;
         
       }
       else{
            this.flashMessage.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});
            this.router.navigate(['/login']);
       }
      }
      
    );
  }

  payFine(){
    const data={
      email:this.email,
      amount:this.fineAmount,
      purpose:this.finePurpose,
    }

    console.log(data);
 
      this.authService.payFine(data).subscribe(
      data => {
       if(data.success){
          this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
        this.router.navigate(['/librarian/dashboard']);
         
       }
       else{
            this.flashMessage.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});
            
       }
      }
      
    );


  }

}
