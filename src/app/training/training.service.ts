import { Subject } from 'rxjs';
import { Exercise } from "./exercise.model";

export class TrainingService {
    trainingChanged = new Subject<Exercise>();
    private runningTraining :Exercise;
    private trainings : Exercise[] = [];

    private availabelExercises: Exercise [] = [
        {id : "crunches", name : "Crunches", duration: 30, calories: 8},
        {id : "toch-tose", name : "Toch Tose", duration: 120, calories: 17},
        {id : "side-lunges", name : "Side Lunges", duration: 90, calories: 22},
        {id : "burpess", name : "Burpess", duration: 45, calories: 8},
    ];

    getAvailabelExercises() {
        return this.availabelExercises.slice();
    }

    startTraining(selectedTrainingId: string) {
        this.runningTraining = this.getAvailabelExercises().find(x => x.id === selectedTrainingId);
        this.trainingChanged.next({...this.runningTraining});
    }

    getRunningTraining() {
        return {...this.runningTraining};
    }

    completeTraining() {
        this.trainings.push({...this.runningTraining , date:new Date(), state:"completed"});
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    cancelTraining(progress: number) {
        this.trainings.push({
            ...this.runningTraining,
            duration: this.runningTraining.duration * (progress/100),
            calories: this.runningTraining.calories * (progress/100),
            date:new Date(), state:"cancelled"});
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }
}