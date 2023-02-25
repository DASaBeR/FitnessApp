import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from './../training.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  
  trainings : Exercise [] = [];

  constructor(private trainingService: TrainingService) {}
  ngOnInit(): void {
    this.trainingService.getAvailabelExercises().then((trainings) => {
      this.trainings = trainings;
    });
  }

  onStartTraining(form:NgForm) {
    this.trainingService.startTraining(form.value.training);
  }
  
}
