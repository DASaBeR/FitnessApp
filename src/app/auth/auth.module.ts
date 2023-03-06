import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SahredModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [LoginComponent, SignupComponent],
    imports: [
        ReactiveFormsModule,
        SahredModule,
        AuthRoutingModule
    ],
    exports: []
})
export class AuthModule {

}