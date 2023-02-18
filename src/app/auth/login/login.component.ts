import { NgForm } from '@angular/forms';
import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  onSubmit(form: NgForm) {
    console.log(form);
  }
 }
