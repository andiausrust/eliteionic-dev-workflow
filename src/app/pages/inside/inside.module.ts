import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsidePageRoutingModule } from './inside-routing.module';

import { InsidePage } from './inside.page';
import { ProfilePageModule } from '../profile/profile.module';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsidePageRoutingModule,
    ProfilePageModule,
    SharedPipesModule
  ],
  declarations: [InsidePage]
})
export class InsidePageModule {}
