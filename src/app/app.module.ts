import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { FormsToolsService } from './core/shared/forms/forms-tools.service';
import { ValidatorsService } from './core/shared/forms/validators.service';

import { AppComponent } from './app.component';
import { LayoutModule } from './core/layout/layout.module';
import { SharedService } from './routes/service/shared.service';
import { OficinaService } from './routes/service/oficina.service';
import { ReservaService } from './routes/service/reserva.service';
import { UsuarioService } from './routes/service/usuario.service';
import { SalaService } from './routes/service/sala.service';

import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MaterializeModule,
    AppRoutingModule,

  ],
  exports: [],
  providers: [FormsToolsService, ValidatorsService, SharedService, OficinaService, ReservaService, UsuarioService, SalaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
