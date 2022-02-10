import { Component, OnInit } from '@angular/core';

import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router) { }

  ngOnInit() {
  }

  login(formData: any){
    try {
      this.authService.login(formData.value).subscribe((res)=>{
        this.router.navigateByUrl('home');
      });
    } catch(error) {
      console.log("Error [login]: ", error.message)
    }
  }


}
