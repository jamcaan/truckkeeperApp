import { Component } from '@angular/core';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent {

  drivers = [
    {
      "id": '1',
      "name": 'Warsame',
      "license": 'Tyt5544',
      "phone": '573-366-3663',
      "email": 'test@gmail.com'

    },
    {
      "id": '2',
      "name": 'John',
      "license": 'Tyt5544',
      "phone": '573-366-3663',
      "email": 'test@gmail.com'

    },
    {
      "id": '3',
      "name": 'Omar',
      "license": 'Tyt5544',
      "phone": '573-366-3663',
      "email": 'test@gmail.com'

    }


  ]
}
