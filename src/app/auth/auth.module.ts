import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [SigninComponent, SignoutComponent, SignupComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    // FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
})
export class AuthModule {}
