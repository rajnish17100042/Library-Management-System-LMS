import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateLoginData(user){
     if(!user.password||!user.role){
      // console.log("user checking");
      return false;
    }
  
    else{ 
      // console.log("else part");
      return true;
    }
  }
  validateEmail(email){
     const re =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     return re.test(email);
  }

   validateRegistration(dataToSend){

      if(!dataToSend.name||!dataToSend.email||!dataToSend.phone||!dataToSend.address||!dataToSend.city||!dataToSend.state||!dataToSend.pincode||!dataToSend.role){
            // console.log("normal checking");
            return false;
          }
   else{ 
      // console.log("else part");
      return true;
    }
  }

  validateBookDetails(data){

      if(!data.book_id||!data.bk_title||!data.bk_name||!data.publisher||!data.author||!data.bk_copies||!data.category){
            
            return false;
          }
   else{ 
      // console.log("else part");
      return true;
    }
  }
}
