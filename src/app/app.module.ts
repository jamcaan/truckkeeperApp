import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './dashboard/home/home.component';
import { DriversComponent } from './dashboard/drivers/drivers.component';
import { LoadsComponent } from './dashboard/loads/loads.component';
import { ExpensesComponent } from './dashboard/expenses/expenses.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // DriversComponent,
    // LoadsComponent,
    // ExpensesComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    // MatButtonModule,
    // MatIconModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatListModule,
    AuthModule,
    DashboardModule,
    MaterialModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
