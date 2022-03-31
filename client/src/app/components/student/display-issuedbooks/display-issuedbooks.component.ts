import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-display-issuedbooks',
  templateUrl: './display-issuedbooks.component.html',
  styleUrls: ['./display-issuedbooks.component.css']
})
export class DisplayIssuedbooksComponent implements OnInit {
  issuedBooks:Object;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

   ngOnInit(){
    this.authService.getIssuedBooks().subscribe(data=>{
      if(data.success){
        this.issuedBooks=data.books;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

}
