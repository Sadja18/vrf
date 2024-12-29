import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Screen3Page } from './screen3.page';

const routes: Routes = [
  {
    path: '',
    component: Screen3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Screen3PageRoutingModule {}
