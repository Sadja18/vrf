import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { UserCardComponent } from '../user-card/user-card.component';
import { DateFormatPipe } from 'src/app/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    ReactiveFormsModule,
    DateFormatPipe

  ],
  declarations: [ListPage, UserCardComponent]
})
export class ListPageModule { }
