import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../routes/index/index.component';
import { DashboardSalasComponent } from '../routes/dashboard-salas/dashboard-salas.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'salas',
        component: DashboardSalasComponent,
      }]
  },
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
