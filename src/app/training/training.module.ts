import { StopTrainingComponent } from './current-training/stop-training.component';
import { SahredModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TrainingRoutingModule } from './training-routing.module';

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        StopTrainingComponent,
    ],
    imports: [SahredModule, TrainingRoutingModule],
    entryComponents: [StopTrainingComponent]
})
export class TrainingModule {

}