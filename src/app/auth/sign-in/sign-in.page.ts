import { Component, OnInit } from '@angular/core';

import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { ErrorHandlingComponent } from '../../utils/toast/error-handling/error-handling.component';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  providers: [ErrorHandlingComponent]
})
export class SignInPage implements OnInit {
  

  constructor(private  authService:  AuthService, private  router:  Router, private errorToast: ErrorHandlingComponent) { }

  ngOnInit() {
  }

  async login(formData: any){
    try {
      this.authService.login(formData.value).subscribe((res)=>{
        this.router.navigateByUrl('home');
      }, error => {
          this.errorToast.presentToast({message: "Credenciales inválidas", duration: 1000})
      });
    } catch(error) {
      console.log("Error [login]: ", error.message)
    }
  }


}
