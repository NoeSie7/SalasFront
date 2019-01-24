import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterializeModule } from 'angular2-materialize';
import { FullCalendarModule } from 'ng-fullcalendar';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { OficinaService } from './components/service/oficina.service';
import { ReservaService } from './components/service/reserva.service';
import { SalaService } from './components/service/sala.service';
import { SharedService } from './components/service/shared.service';
import { UsuarioService } from './components/service/usuario.service';
import { TimetableComponent } from './components/timetable/timetable.component';
import { LayoutModule } from './core/layout/layout.module';
import { FormsToolsService } from './core/shared/forms/forms-tools.service';
import { ValidatorsService } from './core/shared/forms/validators.service';
import { AppRoutingModule } from './routes/app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    TimetableComponent,
    PageNotFoundComponent,
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
