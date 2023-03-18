import { NgModule } from '@angular/core';
import { SahredModule } from '../shared/shared.module';

import { SteamLoginComponent } from './steam-login/steam-login.component';
import { SteamRoutingModule } from './steam-routing.module';


@NgModule({
    declarations: [SteamLoginComponent],
    imports: [SahredModule, SteamRoutingModule],
})

export class SteamModule {

}