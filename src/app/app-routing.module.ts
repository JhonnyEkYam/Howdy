import { NgModule } from '@angular/core';
import { PreloadAllModules, Router, RouterModule, Routes, } from '@angular/router';
import { httpInterceptorProviders } from './interceptors/auth.interceptor';
// Guards
import { AuthGuardGuard } from './guards/auth-guard.guard'
import { IsAuthGuard } from './guards/is-auth.guard'
import { StorageService } from './storage/storage.service';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canLoad: [AuthGuardGuard],
  },
  {
    path: 'conversation-page',
    loadChildren: () => import('./conversation-page/conversation-page.module').then(m => m.ConversationPagePageModule)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./auth/sign-in/sign-in.module').then(m => m.SignInPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ],
    canActivateChild: [IsAuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule, AuthGuardGuard, IsAuthGuard],
  providers: [
    httpInterceptorProviders,
    AuthGuardGuard,
    IsAuthGuard
  ]
})
export class AppRoutingModule {
  private storage: Storage;
  constructor(private router: Router) {
    (async () => {
      try {
        let __ACCESS_TOKEN = await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN)
        if (__ACCESS_TOKEN === null) this.router.navigateByUrl('auth/login');
      } catch (error) {
        this.router.navigateByUrl('auth/login')
      }
    })()
  }
}

