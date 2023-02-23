import { TrainingService } from './training.service';
import { Exercise } from './exercise.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  onGoingTraining = false;
  trainingSubscription : Subscription;

  constructor(private trainingService:TrainingService) {}

  ngOnInit(): void {
    this.trainingSubscription = this.trainingService.trainingChanged.subscribe(training => {
      if(training) {
        this.onGoingTraining = true;
      }
      else {
        this.onGoingTraining = false;
      }
    });
  }
 
  
}
