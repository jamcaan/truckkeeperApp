import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';
import { Loads } from '../models/loads.model';
import { LoadsService } from '../services/loads.service';

@Component({
  selector: 'app-loads-list',
  templateUrl: './loads-list.component.html',
  styleUrls: ['./loads-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class LoadsListComponent implements OnInit {
  @Input() driver!: Drivers;

  constructor(
    public loadsService: LoadsService,
    private route: ActivatedRoute
  ) {}

  displayedColumns: string[] = [
    'loadnumber',
    'date',
    'from',
    'destination',
    'commPercentage',
    'amount',
    'actions',
  ];

  expandedElement: Loads | null | undefined;

  loadsList$!: Observable<HttpResponseObject<Loads>[]>;
  driverIdTest!: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const driverId = params.get('id');
      this.driverIdTest = String(driverId);
      console.log('driverId: ', driverId);
      if (driverId) {
        this.loadsList$ = this.loadsService.getLoadsByDriver(driverId);
      }
    });
  }
  onLoadSelected(load: Loads) {
    // this.selectedLoad = load
    console.log('onloadsSelected:', load);
  }
}
