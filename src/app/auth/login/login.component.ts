import { NgForm } from '@angular/forms';
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UIService } from './../../shared/ui.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private loadingSubs: Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {}
  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe((state) => {
      this.isLoading = state;
    });
  }
  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password,
    });
  }
 }
