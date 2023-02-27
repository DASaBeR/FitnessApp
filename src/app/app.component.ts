import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService) {}
  ngOnInit(): void {
    this.authService.AuthListener();
  }

  title = 'FitnessApp';
  //@ViewChild("sidenav") sidenav!: MatSidenav;

  
}
