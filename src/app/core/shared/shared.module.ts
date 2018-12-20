import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorsService } from "./forms/validators.service";
import { FormsToolsService } from "./forms/forms-tools.service";
import { OficinaFilterPipe } from '../../routes/_data/oficina-filter.pipe';

@NgModule({
  declarations: [OficinaFilterPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [FormsToolsService, ValidatorsService],
  exports: [ReactiveFormsModule, OficinaFilterPipe]
})
export class SharedModule { }