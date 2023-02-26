import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DriversComponent } from './drivers/drivers.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LoadsComponent } from './loads/loads.component';
import { DashboardRoutingModule } from './dashboard-routing.module';



@NgModule({
  declarations: [
    HomeComponent,
    DriversComponent,
    ExpensesComponent,
    LoadsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,

  ]
})
export class DashboardModule { }
