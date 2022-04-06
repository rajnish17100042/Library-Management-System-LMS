import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-librarian-dashboard',
  templateUrl: './librarian-dashboard.component.html',
  styleUrls: ['./librarian-dashboard.component.css']
})
export class LibrarianDashboardComponent implements OnInit {
  librarianData:Object;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

   ngOnInit(){
    
    // this.role='doctor';
    //take the page from frotend and role from the backend cookie
    
     this.authService.getLibrarianData().subscribe(data=>{
      if(data.success){
        
        this.librarianData=data.librarianData;
      }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    });  
  
  }

//function to return a book 
  returnBook(){
   const book_id=window.prompt("Please Enter Book Id");
   const email=window.prompt("Please Enter User Email Id");
   console.log(book_id,email);
   if(!book_id||!email){
     return 0;
   }

   this.router.navigate([`/librarian/return-book/${book_id}/${email}`]);

  }

//function to pay fine  
payFine(){
   
   const email=window.prompt("Please Enter User Email Id");
   console.log(email);
   if(!email){
     return 0;
   }

   this.router.navigate([`/librarian/pay-fine/${email}`]);
}

  logout(){
     //go to backend logout route
    this.authService.logout().subscribe(
      data => {
       if(data.success){
          this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
          this.router.navigate(['/login']);
       }
       else{
            this.flashMessage.show("Something went wrong",{cssClass:'alert-danger',timeout:3000});

       }
      }
      
    );
  }
}
