import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { DriversComponent } from './home/drivers/drivers.component';
import { CompleteComponent } from './loads-list/complete/complete.component';

import { LoadsListComponent } from './loads-list/loads-list.component';
import { LoadsComponent } from './loads/loads.component';
import { PaystubComponent } from './paystub/paystub.component';

const routes: Routes = [
  { path: 'paystub', component: PaystubComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'loads', component: LoadsComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'complete', component: CompleteComponent },
  {
    path: '',
    component: DashboardComponent,
    children: [{ path: ':id', component: LoadsListComponent }],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
