import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsToolsService } from '../../core/shared/forms/forms-tools.service';
import { ValidatorsService } from '../../core/shared/forms/validators.service';
import { FormsModule } from '@angular/forms';

import { DashboardSalasRoutingModule } from './dashboard-salas-routing.module';
import { DashboardSalasComponent } from './dashboard-salas.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ReservaComponent } from './reserva/reserva.component';
import { ReservaItemComponent } from './reserva-item/reserva-item.component';
import { SelectComponent } from './reserva/select/select.component';


@NgModule({
  imports: [
    CommonModule,
    DashboardSalasRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [DashboardSalasComponent, ReservaComponent, ReservaItemComponent, ConfirmationPopupComponent, SelectComponent],
  providers: [FormsToolsService, ValidatorsService],
  exports: [DashboardSalasComponent]
})
export class DashboardSalasModule { }
