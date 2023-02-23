import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { StopTrainingComponent } from './stop-training.component';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  @Output() trainingExit = new EventEmitter();
  isPaused = false;
  progress = 0;
  timer!: any;

  constructor(private dialog: MatDialog, private trainingService:TrainingService) {}

  ngOnInit(): void {
    this.StartOrResumeTimer();
  }

  StartOrResumeTimer() {
    const step = (this.trainingService.getRunningTraining().duration / 100) * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if(this.progress >= 100) {
        this.trainingService.completeTraining();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent , {
      data: {progress: this.progress},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.trainingService.cancelTraining(this.progress);
      }
      else{
        this.StartOrResumeTimer();
      }
    });
  }

  onPauseOrResume() {
    if(this.isPaused === true) {
      this.isPaused = !this.isPaused;
      this.StartOrResumeTimer();

    }
    else {
      this.isPaused = !this.isPaused;
        clearInterval(this.timer);
    }
  }
    
  
}
