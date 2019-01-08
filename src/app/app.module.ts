import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { FormsToolsService } from './core/shared/forms/forms-tools.service';
import { ValidatorsService } from './core/shared/forms/validators.service';

import { AppComponent } from './app.component';
import { LayoutModule } from './core/layout/layout.module';
import { SharedService } from './components/service/shared.service';
import { OficinaService } from './components/service/oficina.service';
import { ReservaService } from './components/service/reserva.service';
import { UsuarioService } from './components/service/usuario.service';
import { SalaService } from './components/service/sala.service';
import {SalasComponent} from './components/salas/salas.component';

import { AppRoutingModule } from './routes/app-routing.module';
import { RouterModule } from '@angular/router';
import { TimetableComponent } from './components/timetable/timetable.component';
import { FullCalendarModule } from 'ng-fullcalendar';


@NgModule({
  declarations: [
    AppComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterializeModule,
    AppRoutingModule,
    FullCalendarModule
  ],
  exports: [],
  providers: [FormsToolsService, ValidatorsService, SharedService, OficinaService, ReservaService, UsuarioService, SalaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
