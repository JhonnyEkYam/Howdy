import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, Router, RouterModule, Routes, UrlSegment } from '@angular/router';
import { httpInterceptorProviders } from './interceptors/auth.interceptor';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
// Guards
import { AuthGuardGuard } from './guards/auth-guard.guard'
import { IsAuthGuard } from './guards/is-auth.guard'

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuardGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./auth/sign-in/sign-in.module').then( m => m.SignInPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./auth/sign-up/sign-up.module').then( m => m.SignUpPageModule)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ],
    canActivateChild: [IsAuthGuard]
  },
  // {
  //   path: 'sign-in',
  //   loadChildren: () => import('./auth/sign-in/sign-in.module').then( m => m.SignInPageModule)
  // },
  // {
  //   path: 'sign-up',
  //   loadChildren: () => import('./auth/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
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
    (async ()=> {
      try{
        this.storage = new Storage({
          name: '__authcredentials',
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
        })
        await this.storage.create()
        let __ACCESS_TOKEN = await this.storage.get('ACCESS_TOKEN')
        if(__ACCESS_TOKEN === null) router.navigateByUrl('auth/login');
      } catch (error) {
        router.navigateByUrl('auth/login')
      }
    })()
  }
}
