import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";


@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router: Router) { }

    canLoad(route: Route, segments: UrlSegment[]) {
        if (this.authService.isAuth()) {
            return true;
        }
        else {
            this.router.navigate(["/login"]);
            return false;
        }
    }

    //with adding canload we do not use canActivate anymore. we did that after add lazy loading to project.
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.authService.isAuth()) {
            return true;
        }
        else {
            this.router.navigate(["/login"]);
            return false;
        }
    }


}