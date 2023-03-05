import { UIService } from './../../shared/ui.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private loadingSubs: Subscription;

  constructor(private authSerivce: AuthService, private uiService: UIService) { }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe((state) => {
      this.isLoading = state;
    });
  }
  onSubmit(form: NgForm) {

    this.authSerivce.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }


}
