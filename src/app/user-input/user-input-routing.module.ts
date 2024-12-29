import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInputPage } from './user-input.page';

const routes: Routes = [
  {
    path: '',
    component: UserInputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInputPageRoutingModule {}
