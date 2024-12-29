import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditablePreviewPage } from './editable-preview.page';

const routes: Routes = [
  {
    path: '',
    component: EditablePreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditablePreviewPageRoutingModule {}
