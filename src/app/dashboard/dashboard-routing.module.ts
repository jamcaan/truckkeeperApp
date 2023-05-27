import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverDetailsComponent } from './driver-list/driver-details/driver-details.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { LoadDetailComponent } from './loads-list/load-detail/load-detail.component';
import { LoadsListComponent } from './loads-list/loads-list.component';
import { PaystubComponent } from './paystub/paystub.component';

const routes: Routes = [
  {path: 'paystub', component: PaystubComponent},
  {path: 'drivers', component: DriverDetailsComponent},
  {path: 'loads', component: LoadDetailComponent},


  {
    path: '',
    component: DashboardComponent,
    children: [
      // {path: '', component: DashboardComponent},
      {path: ':id', component: LoadsListComponent}
    ],

  }


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
