import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SahredModule } from '../shared/shared.module';

@NgModule({
    declarations: [LoginComponent, SignupComponent],
    imports: [
        ReactiveFormsModule,
        SahredModule
    ],
    exports: []
})
export class AuthModule {

}