import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
  },
  {
    path: 'contacts',
    component: HomePage,
  },
  {
    path: 'todos-los-chats',
    component: HomePage, // Aqui va el componente de lista de chats
  },
  {
    path: 'chat',
    component: HomePage, // Aqui va el componente de un chat con un usuario
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
