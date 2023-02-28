import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  constructor(public authService: AuthService, private route: Router) {}

  signout() {
    this.authService.signout();
    // location.reload()
    sessionStorage.removeItem('currentUser');
  }
}
