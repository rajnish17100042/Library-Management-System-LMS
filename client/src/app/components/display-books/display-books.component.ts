import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-display-books',
  templateUrl: './display-books.component.html',
  styleUrls: ['./display-books.component.css']
})
export class DisplayBooksComponent implements OnInit {
  books:Object;
  role:boolean = false;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(){
    this.authService.getBookDetails().subscribe(data=>{
      if(data.success){
        this.books=data.books;
        console.log(data.role);
        if(data.role==='librarian'){
          this.role=true;
        }
       
        console.log(this.role);
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

  issueBook(id){
    
    // console.log(id);
    let finaldelete = confirm("want to issue this book ??");

    if (finaldelete == true) {
      
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

  viewBook(book_id){
    console.log(book_id);
    this.router.navigate([`${book_id}`],{relativeTo:this.route})
  }
  updateBook(book_id){
   this.router.navigate([`/librarian/update-book/${book_id}`]);

  }
 
}
