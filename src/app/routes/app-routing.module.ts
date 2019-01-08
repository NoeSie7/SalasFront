import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../components/index/index.component';
import { DashboardSalasComponent } from '../components/dashboard-salas/dashboard-salas.component';
import {MainContentComponent} from '../core/layout/main-content/main-content.component';
import {ShellComponent} from '../core/layout/shell/shell.component';
import {TopBarComponent} from '../core/layout/top-bar/top-bar.component';
import {ReservaItemComponent} from '../components/dashboard-salas/reserva-item/reserva-item.component';
import {ReservaComponent} from '../components/dashboard-salas/reserva/reserva.component';
import {SelectComponent} from '../components/dashboard-salas/reserva/select/select.component';
import {ConfirmationPopupComponent} from '../components/confirmation-popup/confirmation-popup.component';
import {AboutComponent} from '../components/about/about.component';
import { SalasComponent } from '../components/salas/salas.component';
import { TimetableComponent } from '../components/timetable/timetable.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    // children: [
    //   {
    //     path: 'salas',
    //     component: DashboardSalasComponent,
    //   },
    // ]
  },

  // {
  //   path: 'office/:office/room/:room/timetable',
  //   component: DashboardSalasComponent,
  // },

  {
    path: 'office/:office/room/:room/timetable',
    component: TimetableComponent,
  },

  // {path: 'office/:id', component: SalasComponent}, // Componente con las rutas a cada sala
  {path: 'office/:office', component: DashboardSalasComponent}, // Muestra todas las reservas de un lugar
  {path: 'reservaitem', component: ReservaItemComponent}, // caca
  {path: 'reserva', component: ReservaComponent}, // caca
  {path: 'select', component: SelectComponent},
  {path: 'confirmation', component: ConfirmationPopupComponent}, // caca
  {path: 'about', component: AboutComponent},
  {path: 'main', component: MainContentComponent},
  {path: 'shell', component: ShellComponent},
  {path: 'topbar', component: TopBarComponent},
  { path: '**', redirectTo: '',  pathMatch: 'full'}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
