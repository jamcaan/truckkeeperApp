import { Component } from '@angular/core';

export interface Loads {
  id: string;
  loadNo: string;
  loadFrom: Date
  amount: number
}

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.scss']
})
export class LoadsComponent {

  loads: Loads = {
    id: '1',
    loadNo: '13',
    loadFrom: new Date(),
    amount: 250
  }


}
