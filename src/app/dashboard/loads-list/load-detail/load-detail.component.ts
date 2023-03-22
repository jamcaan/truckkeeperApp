import { Component, Input, OnInit } from '@angular/core';
import { Drivers } from '../../models/driver.model';
import { Loads } from '../../models/loads.model';

@Component({
  selector: 'app-load-detail',
  templateUrl: './load-detail.component.html',
  styleUrls: ['./load-detail.component.scss']
})
export class LoadDetailComponent implements OnInit{

  @Input() driver!: Drivers

  @Input() load!: Loads


  ngOnInit(): void {
    console.log('Load Item', this.load)
  }

}
