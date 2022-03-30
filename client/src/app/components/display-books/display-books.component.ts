import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-display-books',
  templateUrl: './display-books.component.html',
  styleUrls: ['./display-books.component.css']
})
export class DisplayBooksComponent implements OnInit {
  books:Object;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(){
    this.authService.getBookDetails().subscribe(data=>{
      if(data.success){
        this.books=data.books;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

  issueBook(id){
    
    console.log(id);
    let finaldelete = confirm("want to issue this book ??");

    if (finaldelete == true) {
         console.log(id);
      this.authService.issueBook({book_id:id}).subscribe(
        data => {
        if(data.success){
            this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
            this.router.navigate(['/student/dashboard']);
        }
        else{
              this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});

        }
        }
      
      );
    }
  }

}
