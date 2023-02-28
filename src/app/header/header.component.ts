import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { UserStore } from '../auth/user-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(public authService: AuthService, private userStore: UserStore) {}

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  signout() {
    this.authService.signout();
    sessionStorage.removeItem('currentUser');
  }
}
