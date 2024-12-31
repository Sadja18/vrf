import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewPageRoutingModule } from './preview-routing.module';

import { PreviewPage } from './preview.page';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { ZoomModalComponent } from '../zoom-modal/zoom-modal.component';
import { DateFormatPipe } from 'src/app/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewPageRoutingModule,
    MapModalComponent,
    ZoomModalComponent,
    DateFormatPipe
  ],
  declarations: [PreviewPage, ],
})
export class PreviewPageModule {}
