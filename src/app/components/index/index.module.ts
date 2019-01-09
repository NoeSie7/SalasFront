import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { IndexComponent } from './index.component';
import { IndexRoutingModule } from './index-routing.module';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    FormsModule,
    HttpModule,
    SharedModule,
  ],
  declarations: [
    IndexComponent
  ],
  exports: [IndexComponent]
})
export class IndexModule { }
