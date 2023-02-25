import { Subject } from 'rxjs';
import * as Parse from 'parse';

import { Exercise } from "./exercise.model";

export class TrainingService {
    trainingChanged = new Subject<Exercise>();
    private runningTraining: Exercise;
    private trainings: Exercise[] = [];

    private availabelExercises: Exercise[] = [];
/*     private availabelExercises: Exercise[] = [
        { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
        { id: "toch-tose", name: "Toch Tose", duration: 120, calories: 17 },
        { id: "side-lunges", name: "Side Lunges", duration: 90, calories: 22 },
        { id: "burpess", name: "Burpess", duration: 45, calories: 8 },
    ]; */
    
    async getAvailabelExercises() {
        // How to Read Data from Back4App.com  ==> https://docs.parseplatform.org/js/guide/#queries
        this.availabelExercises = [];
        const Exercises = Parse.Object.extend("availableExercises");
        const query = new Parse.Query(Exercises);
        const exer = await query.find();
        for (let i = 0; i < exer.length; i++) {
            this.availabelExercises.push({
                id: exer[i]["id"],
                name: exer[i].attributes["name"],
                duration: exer[i].attributes["duration"],
                calories: exer[i].attributes["calories"]
            });
        }
        console.log(this.availabelExercises);
        return this.availabelExercises;
    }
    async startTraining(selectedTrainingId: string) {
        this.runningTraining = await this.getAvailabelExercises().then(x => x.find(d => d.id === selectedTrainingId));
        this.trainingChanged.next({ ...this.runningTraining });
    }

    getRunningTraining() {
        return { ...this.runningTraining };
    }

    completeTraining() {
        this.trainings.push({ ...this.runningTraining, date: new Date(), state: "completed" });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    cancelTraining(progress: number) {
        this.trainings.push({
            ...this.runningTraining,
            duration: this.runningTraining.duration * (progress / 100),
            calories: this.runningTraining.calories * (progress / 100),
            date: new Date(), state: "cancelled"
        });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    getCompletedOrCanceledTrainings() {
        return this.trainings;
    }
}