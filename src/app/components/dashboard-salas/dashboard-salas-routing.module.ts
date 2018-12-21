import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardSalasComponent } from './dashboard-salas.component';

const routes: Routes = [
  // {
  //   path: 'salas',
  //   component: DashboardSalasComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSalasRoutingModule { }
