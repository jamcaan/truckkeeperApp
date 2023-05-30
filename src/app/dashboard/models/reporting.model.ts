import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Expenses } from './expenses.model';
import { Loads, PayStubSummary } from './loads.model';

export interface LoadsWithDriver extends HttpResponseObject<Loads> {
  driverName?: string;
}

export interface PayStubWithDriverName
  extends HttpResponseObject<PayStubSummary> {
  driverName?: string;
}

export interface ExpenseWithDriverName extends HttpResponseObject<Expenses> {
  driverName?: string;
}
