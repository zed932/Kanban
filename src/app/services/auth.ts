import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {



  signInApplication(login:string, password:string){
    console.log(login, password);
  }
}
