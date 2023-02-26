import { environment } from './../../enviroment/environment';
import { Subject } from 'rxjs';
import * as Parse from 'parse';

import { Exercise } from "./exercise.model";

export class TrainingService {
    trainingChanged = new Subject<Exercise>();
    private runningTraining: Exercise;
    private trainings: Exercise[] = [];
    private subscription: Promise<Parse.LiveQuerySubscription>;
    private availabelExercises: Exercise[] = [];

    async fetchAvailabelExercises() {
        // How to Read Data from Back4App.com  ==> https://docs.parseplatform.org/js/guide/#queries
        this.availabelExercises = [];
        (Parse as any).serverURL = environment.serverLiveQueryURL;
        const Exercises = Parse.Object.extend("availableExercises");
        const query = new Parse.Query(Exercises);

        //for LiveQuery we need to subscrbe the query  ==> https://docs.parseplatform.org/js/guide/#live-queries
        this.subscription = query.subscribe();

        (await this.subscription).on("open", async () => {
            const exer = await query.find();
            for (let i = 0; i < exer.length; i++) {
                this.availabelExercises.push({
                    id: exer[i]["id"],
                    name: exer[i].attributes["name"],
                    duration: exer[i].attributes["duration"],
                    calories: exer[i].attributes["calories"]
                });
            }
            console.log(" Start Conection Query . . .");
        });

        // Real Time (LiveQuery) if data change in sever(Back4App database) it will update automaticly in app.
        (await this.subscription).on("update", (result) => {
            var updatedExercise = this.availabelExercises.find(x => x.id === result["id"]);
            updatedExercise.name = result.attributes["name"];
            updatedExercise.duration = result.attributes["duration"];
            updatedExercise.calories = result.attributes["calories"];

            console.log(result.attributes["name"] + " Updated in database . . .");
        });

        (await this.subscription).on("delete", (result) => {
            var Exercise = this.availabelExercises.find(x => x.id === result["id"]);
            var indexOfExercise = this.availabelExercises.indexOf(Exercise, 0);
            this.availabelExercises.splice(indexOfExercise);

            console.log(result.attributes["name"] + " Deleted from database . . .");
        });

        (await this.subscription).on("create", (result) => {
            this.availabelExercises.push({
                id: result["id"],
                name: result.attributes["name"],
                duration: result.attributes["duration"],
                calories: result.attributes["calories"]
            });
            console.log(result.attributes["name"] + " Created in database . . .");
        });
        (Parse as any).serverURL = environment.serverURL;
        return this.availabelExercises;
    }
    async startTraining(selectedTrainingId: string) {
        this.runningTraining = this.availabelExercises.find(x => x.id === selectedTrainingId);
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

    async unsubscribeLiveQuery() {
        (await this.subscription).unsubscribe();
        (Parse as any).serverURL = environment.serverURL;
    }
}