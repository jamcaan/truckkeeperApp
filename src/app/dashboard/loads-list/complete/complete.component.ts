import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Expenses } from '../../models/expenses.model';
import { Loads } from '../../models/loads.model';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {


  @Input() driver!: Drivers
  @Input() loads$!:  Observable<HttpResponseObject<Loads>[]>;
  @Input() expense!: Expenses


  ngOnInit(): void {
    console.log('The Driver: ', this.driver)
  }

  onModalClose(){}


  onSubmit(){}

}
