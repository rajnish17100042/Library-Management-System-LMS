import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit {
  is_render:boolean = false;
  issuedBook:Object;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

   ngOnInit(){
    const book_id = this.route.snapshot.params['book_id'];
    const email = this.route.snapshot.params['email'];
    console.log(book_id,email);
    this.authService.getIssuedBook(book_id,email).subscribe(data=>{
      if(data.success){
        this.issuedBook=data.issuedBook;
        this.is_render=true;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

  returnBook(book_id,email,fine){
    console.log(book_id,email,fine);
     let finalreturn = confirm("want to return this book ??");

    if (finalreturn == true) {
      
      this.authService.returnBook({book_id,email,fine}).subscribe(
        data => {
        if(data.success){
            this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
            this.router.navigate(['/librarian/dashboard']);
        }
        else{
              this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});

        }
        }
      
      );
    }
  }

}
