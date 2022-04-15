import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-fine-history',
  templateUrl: './fine-history.component.html',
  styleUrls: ['./fine-history.component.css']
})
export class FineHistoryComponent implements OnInit {
 finehistory=[];
  constructor(
     private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

    ngOnInit(){
    this.authService.getFineHistory().subscribe(data=>{
      if(data.success){
        this.finehistory=data.finehistory;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

}
