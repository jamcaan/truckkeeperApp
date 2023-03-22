import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Drivers } from '../../models/driver.model';
import { Loads } from '../../models/loads.model';

@Component({
  selector: 'app-loads-item-list',
  templateUrl: './loads-item-list.component.html',
  styleUrls: ['./loads-item-list.component.scss'],
})
export class LoadsItemListComponent implements OnInit {
  @Input() driver!: Drivers;

  @Input() load!: Loads;

  @Input() selected!: boolean;

  @Output() loadSelected = new EventEmitter<Loads>();

  ngOnInit(): void {}

  selectLoad() {
    this.loadSelected.emit(this.load);
  }
}
