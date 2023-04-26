import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-complete-button',
  templateUrl: './complete-button.component.html',
  styleUrls: ['./complete-button.component.scss']
})
export class CompleteButtonComponent implements OnInit {

  @Input() title!: string
  @Output() clickButton = new EventEmitter<any>


  ngOnInit(): void {
  }

  onClick(){
    this.clickButton.emit()
  }

}
