import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from './../training.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  
  trainings : Exercise [] = [];

  constructor(private trainingService: TrainingService) {}

  ngOnDestroy(): void {
    this.trainingService.unsubscribeLiveQueries();
  }
  ngOnInit(): void {
    this.trainingService.fetchAvailabelExercises().then((trainings) => {
      this.trainings = trainings;
    });
  }

  onStartTraining(form:NgForm) {
    this.trainingService.startTraining(form.value.training);
  }
  
}
