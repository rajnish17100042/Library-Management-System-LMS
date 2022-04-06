import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
})
export class ViewTransactionsComponent implements OnInit {
  transactions:[];
  constructor(
     private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

    ngOnInit(){
    this.authService.getTransactions().subscribe(data=>{
      if(data.success){
        this.transactions=data.transactions;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }
}
