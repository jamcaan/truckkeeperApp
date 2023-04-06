import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-deactivate-driver',
  templateUrl: './deactivate-driver.component.html',
  styleUrls: ['./deactivate-driver.component.scss']
})
export class DeactivateDriverComponent {
  @Input() driver!: Drivers

  constructor(private driverService: DriverService, private dialog: MatDialog){}


  onClose(){
    this.dialog.closeAll()
  }

  deactivateDriver(){
    const payload: Partial<Drivers> = {
      active: false
    }
    this.driverService.deactivateDriver(payload as Drivers, this.driver?.id).subscribe({
      next: (response)=> {
        console.log('Deactivated Driver Successfully', response)
      }
    })
  }
}
