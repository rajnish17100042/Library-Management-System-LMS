import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-list-issuedbooks',
  templateUrl: './list-issuedbooks.component.html',
  styleUrls: ['./list-issuedbooks.component.css']
})
export class ListIssuedbooksComponent implements OnInit {
  issuedBooks=[];
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(){
    const book_id = this.route.snapshot.params['book_id'];
    console.log(book_id);
    this.authService.listIssuedBooks(book_id).subscribe(data=>{
      if(data.success){
        this.issuedBooks=data.issuedBooks;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

}
