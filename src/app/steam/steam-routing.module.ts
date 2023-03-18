import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { SteamLoginComponent } from './steam-login/steam-login.component';

const routes: Routes = [
    { path: '', component: SteamLoginComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SteamRoutingModule {

}