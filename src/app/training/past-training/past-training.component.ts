import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ["date" , "name" , "calories" , "duration" , "state"]
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private trainingService:TrainingService) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;  
  }

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getCompletedOrCanceledTrainings();
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }
}
