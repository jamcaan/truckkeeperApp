import { Component, Input, OnInit } from '@angular/core';
import { Drivers } from '../../models/driver.model';


@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit{
  @Input() driver!: Drivers | undefined

  ngOnInit(): void {
      console.log('driver details: ', this.driver)
  }
}
