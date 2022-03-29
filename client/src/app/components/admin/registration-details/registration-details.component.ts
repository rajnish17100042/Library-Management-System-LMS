import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'flash-messages-angular';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.css']
})
export class RegistrationDetailsComponent implements OnInit {
  users=[];
  students=[];
  librarians=[];
  admins=[];
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(){
    this.authService.getRegistrationDetails().subscribe(data=>{
      if(data.success){
        this.users=data.message;
        for(let i=0;i<this.users.length;i++){
          if(this.users[i].role==='student'){
             this.students.push(this.users[i]);
          }else if(this.users[i].role==='librarian'){
             this.librarians.push(this.users[i]);
          }else{
            this.admins.push(this.users[i]);
          }
        }
       }else{
        this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});
         this.router.navigate(['/login']);
      }
    }); 
  }

deleteUser(role,id){
   
    let finaldelete = confirm("want to delete the user ??");

    if (finaldelete == true) {
        //  console.log(role,id);
      this.authService.deleteUser(role,id).subscribe(
        data => {
        if(data.success){
            this.flashMessage.show(data.message,{cssClass:'alert-success',timeout:3000});
          
        }
        else{
              this.flashMessage.show(data.message,{cssClass:'alert-danger',timeout:3000});

        }
        }
      
      );
    } 
      
  }
}
