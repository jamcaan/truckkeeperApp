import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, takeUntil, tap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Unsub } from 'src/app/unsub.class';
import { Drivers } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-drivers-data',
  templateUrl: './drivers-data.component.html',
  styleUrls: ['./drivers-data.component.scss'],
})
export class DriversDataComponent implements OnInit {


  ngOnInit(): void {
  }



}
