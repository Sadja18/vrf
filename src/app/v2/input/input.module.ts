import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputPageRoutingModule } from './input-routing.module';

import { InputPage } from './input.page';
import { ImageComponent } from '../widgets/image/image.component';
import { DateFormatPipe } from 'src/app/date-format.pipe';
import { ProfilePicV2Component } from '../widgets/profile-pic-v2/profile-pic-v2.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputPageRoutingModule,
    ReactiveFormsModule,
    ImageComponent,
    DateFormatPipe, ProfilePicV2Component
  ],
  declarations: [InputPage]
})
export class InputPageModule {}
