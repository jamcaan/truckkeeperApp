import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DriversComponent } from './home/drivers/drivers.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LoadsComponent } from './loads/loads.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { DriverListComponent } from './driver-list/driver-list.component';
import { DriverListItemComponent } from './driver-list/driver-list-item/driver-list-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DriverDetailsComponent } from './driver-list/driver-details/driver-details.component';
import { LoadsListComponent } from './loads-list/loads-list.component';
import { LoadsItemListComponent } from './loads-list/loads-item-list/loads-item-list.component';
import { SharedModule } from '../shared/shared.module';
import { AddNewDriverComponent } from './driver-list/add-new-driver/add-new-driver.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { AddLoadComponent } from './loads-list/add-load/add-load.component';
import { LoadDetailComponent } from './loads-list/load-detail/load-detail.component';
import { AddExpensesComponent } from './expenses-list/add-expenses/add-expenses.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpenseListItemComponent } from './expenses-list/expense-list-item/expense-list-item.component';
import { EditDriverComponent } from './driver-list/edit-driver/edit-driver.component';

@NgModule({
  declarations: [
    HomeComponent,
    DriversComponent,
    ExpensesComponent,
    LoadsComponent,
    DriverListComponent,
    DriverListItemComponent,
    DriverDetailsComponent,
    LoadsListComponent,
    LoadsItemListComponent,
    AddNewDriverComponent,
    AddLoadComponent,
    LoadDetailComponent,
    AddExpensesComponent,
    ExpensesListComponent,
    ExpenseListItemComponent,
    EditDriverComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ModalComponent],
})
export class DashboardModule {}
