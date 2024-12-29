import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditablePreviewPageRoutingModule } from './editable-preview-routing.module';

import { EditablePreviewPage } from './editable-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditablePreviewPageRoutingModule,
  ],
  declarations: [EditablePreviewPage]
})
export class EditablePreviewPageModule {}
