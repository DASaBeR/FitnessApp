import { TrainingService } from './../training/training.service';
import { User } from "./user.model";
import { Guid } from 'guid-typescript';
import { Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Parse from "parse";

import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    private user: User;
    private isAthenticated: boolean = false;
    authChange = new Subject<boolean>();

    constructor(private router: Router, private trainingService:TrainingService) { }

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
        var user = new Parse.User();
        user.set("username", authData.email);
        user.set("password", authData.password);
        user.set("email", authData.email);

        user.signUp().then((user) => {
            //console.log('User created in successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
            this.AuthListener();
        }).catch(error => {
            //console.log("SignUp Error: " + error.code + " " + error.message);
        });

    }


    login(authData: AuthData) {
        var user = Parse.User
            .logIn(authData.email, authData.password).then((user) => {
                //console.log('User loged in successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
                this.AuthListener();
            }).catch(function (error) {
                //console.log("Login Error: " + error.code + " " + error.message);
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