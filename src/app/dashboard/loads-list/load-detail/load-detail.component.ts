import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Loads } from '../../models/loads.model';
import { LoadsWithDriver } from '../../models/reporting.model';
import { DriverService } from '../../services/driver.service';
import { LoadsService } from '../../services/loads.service';

@Component({
  selector: 'app-load-detail',
  templateUrl: './load-detail.component.html',
  styleUrls: ['./load-detail.component.scss'],
})
export class LoadDetailComponent implements OnInit {

  ngOnInit(): void {
  }

}
