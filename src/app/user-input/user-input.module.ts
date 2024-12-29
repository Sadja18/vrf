import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserInputPageRoutingModule } from './user-input-routing.module';

import { UserInputPage } from './user-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserInputPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UserInputPage]
})
export class UserInputPageModule {}
