import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private authSerivce:AuthService) {}
  onSubmit(form: NgForm) {
    
    this.authSerivce.registerUSer({
      email: form.value.email,
      password: form.value.password
    });
  }


}
