import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteResolverService } from '../utils/services/route-resolver.service';

import { ConversationPagePage } from './conversation-page.page';

const routes: Routes = [
  {
    path: '',
    component: ConversationPagePage,
    resolve: {
      data: RouteResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationPagePageRoutingModule {}
