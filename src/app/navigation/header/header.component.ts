import { AuthService } from './../../auth/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs"
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() sidenav!: MatSidenav;
  isUserLogin: boolean;
  authSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isUserLogin = authStatus;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onToggle() {
    this.sidenav.toggle();
  }

  onLogout() {
    this.authService.logout();
  }
}
