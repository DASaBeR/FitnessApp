import { MatSidenav } from '@angular/material/sidenav';
import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent {
  @Input() sidenav!: MatSidenav;
  
}
