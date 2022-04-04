import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router,ActivatedRoute} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';
@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
    public book={
   bk_name:'',
   bk_title:'',
   publisher:'',
   author:'',
   bk_copies:'',
   bk_category:'',
  };
  is_render:boolean = false;
  book_id:String;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute,
  ) { }

   ngOnInit() {
    this.book_id = this.route.snapshot.params['book_id'];
  
   
    
     this.authService.getSingleBookDetails(this.book_id).subscribe(
      data => {
       if(data.success){
          this.flashMessage.show("Page Loading...",{cssClass:'alert-success',timeout:3000});
          this.book=data.book;
          this.is_render=true;
         
       }
       else{
            this.flashMessage.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});
            this.router.navigate(['/login']);
       }
      }
      
    );
   

  }

   updateBook(){
  
   //reuired all the fields
    if(!this.validateService.validateUpdateBookDetails(this.book)){
      // window.alert("Please fill in all the fields");
      this.flashMessage.show("Please fill in all the fields ",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
   

    //send book data to the server
    this.authService.updateBook(this.book,this.book_id).subscribe(
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
