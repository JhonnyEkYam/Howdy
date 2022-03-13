import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteResolverService } from '../../utils/services/route-resolver.service';

import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    resolve: {
      data: RouteResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
