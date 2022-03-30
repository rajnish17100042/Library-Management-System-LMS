import { Component, OnInit } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  book_id:String;
  bk_title:String;
  bk_name:String;
  publisher:String;
  author:String;
  bk_copies:String;
  bk_category:String;
  is_render:boolean = false;
  

  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router, 
  ) { }

  ngOnInit(){
     this.authService.getLibrarianData().subscribe(data=>{
      if(data.success){
        this.is_render=true;
       
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    });  
  
  }

    addBook(){
    // window.alert("Form is submitting");
    // console.log(this.name);
    const dataToSend={
      book_id:this.book_id,
      bk_title:this.bk_title,
      bk_name:this.bk_name,
      publisher:this.publisher,
      author:this.author,
      bk_copies:this.bk_copies,
      bk_category:this.bk_category
    };
   //reuired all the fields
    if(!this.validateService.validateBookDetails(dataToSend)){
      // window.alert("Please fill in all the fields");
      this.flashMessage.show("Please fill in all the fields ",{cssClass:'alert-danger',timeout:3000});
      return false;
    }
   

    //send book data to the server
    this.authService.addBook(dataToSend).subscribe(
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
