import { Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from "parse";
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from './auth-data.model';
import { TrainingService } from './../training/training.service';
import { User } from "./user.model";
import { UIService } from './../shared/ui.service';

@Injectable()
export class AuthService {
    private user: User;
    private isAthenticated: boolean = false;
    authChange = new Subject<boolean>();

    constructor(
        private router: Router,
        private trainingService:TrainingService,
        private snackbar: MatSnackBar,
        private uiService:UIService,
        ) { }

    AuthListener() {
        const user = Parse.User.current();
        if (user) {
            this.isAthenticated = true;
            this.authChange.next(true);
            this.router.navigate(["/training"]);
        }
        else {
            this.trainingService.unsubscribeLiveQueries();
            this.isAthenticated = false;
            this.authChange.next(false);
            this.router.navigate(["/login"]);
        }
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        var user = new Parse.User();
        user.set("username", authData.email);
        user.set("password", authData.password);
        user.set("email", authData.email);

        user.signUp().then((user) => {
            this.uiService.loadingStateChanged.next(false);
            this.AuthListener();
        }).catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.snackbar.open(error.message , null , {
                duration: 3000
            });
        });

    }


    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        var user = Parse.User
            .logIn(authData.email, authData.password).then((user) => {
                this.uiService.loadingStateChanged.next(false);
                this.AuthListener();
            }).catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.snackbar.open(error.message, null, {
                    duration: 3000
                });
            });
    }

    async logout() {

        await Parse.User.logOut().then(() => {
            this.AuthListener();
        }).catch(error => {
            console.log(error);
        });
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return this.isAthenticated;
    }
}