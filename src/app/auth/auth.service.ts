import { AuthData } from './auth-data.model';
import { User } from "./user.model";
import { Guid } from 'guid-typescript';
import { Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
 private user: User;
 authChange = new Subject<boolean>();

 constructor(private router: Router) {}
 registerUSer(authData: AuthData) {
    this.user = {
        userId : Guid.create().toString(),
        email : authData.email
    };
    this.authSuccefully();
 }


    login(authData: AuthData) {
        this.user = {
            userId : Guid.create().toString(),
            email : authData.email
        };
        this.authSuccefully();
    }

    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(["/login"]);


    }

    getUser() {
        return {...this.user};
    }

    isAuth() {
        return this.user != null;
    }

    private authSuccefully() {
        this.authChange.next(true);
        this.router.navigate(["/training"]);
    }
}