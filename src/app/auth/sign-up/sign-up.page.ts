import { Component, OnInit } from '@angular/core';

import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router) { }

  ngOnInit() {
  }

  signUp(userData: any) {
    this.authService.signUp(userData).subscribe((res: any) => {
      this.router.navigateByUrl('sign-in');
    });
  }


}
