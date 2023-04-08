import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Loads } from '../../models/loads.model';
import { DriverService } from '../../services/driver.service';
import { LoadsService } from '../../services/loads.service';

@Component({
  selector: 'app-deactivate-driver',
  templateUrl: './deactivate-driver.component.html',
  styleUrls: ['./deactivate-driver.component.scss'],
})
export class DeactivateDriverComponent implements OnInit {
  @Input() driver!: Drivers;

  loads$!: Observable<HttpResponseObject<Loads>[]>;

  @ViewChild('checkLoads') checkLoads!: TemplateRef<any>;

  constructor(
    private driverService: DriverService,
    private loadService: LoadsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loads$ = this.loadService.getLoadsByDriver(this.driver.id as string);
  }

  onClose() {
    this.dialog.closeAll();
  }

  openDialog() {
    this.dialog.open(this.checkLoads, {
      width: '500px',
      height: '250px',
    });
  }

  deactivateDriver() {
    const payload: Partial<Drivers> = {
      active: false,
    };
    this.driverService
      .deactivateDriver(payload as Drivers, this.driver?.id)
      .subscribe({
        next: (response) => {
          console.log('Deactivated Driver Successfully', response);
        },
      });
  }
}
