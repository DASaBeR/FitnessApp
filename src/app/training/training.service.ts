import { Injectable } from '@angular/core';
import { UIService } from './../shared/ui.service';
import { environment } from './../../enviroment/environment';
import { Subject } from 'rxjs';
import * as Parse from 'parse';

import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
    trainingChanged = new Subject<Exercise>();
    private runningTraining: Exercise;
    private finishedExercise: Exercise[] = [];
    private subscriptions: Promise<Parse.LiveQuerySubscription>[] = [];
    private subscription: Promise<Parse.LiveQuerySubscription>;
    private availabelExercises: Exercise[] = [];

    constructor(private uiService: UIService) { }

    async fetchAvailabelExercises() {
        // How to Read Data from Back4App.com  ==> https://docs.parseplatform.org/js/guide/#queries
        this.availabelExercises = [];
        (Parse as any).serverURL = environment.serverLiveQueryURL;
        const Exercises = Parse.Object.extend("availableExercises");
        const query = new Parse.Query(Exercises);

        //for LiveQuery we need to subscrbe the query  ==> https://docs.parseplatform.org/js/guide/#live-queries
        this.subscription = query.subscribe();

        this.subscriptions.push(this.subscription); //  <== store all subscriptions in an array to unsubscrib all of them in component.
        const exer = await query.find().catch(error => {
            this.uiService.showSnackbar("Fetching Exercises failed, please try again later.", null, 3000);
        });
        if (exer) {
            for (let i = 0; i < exer.length; i++) {
                this.availabelExercises.push({
                    id: exer[i]["id"],
                    name: exer[i].attributes["name"],
                    duration: exer[i].attributes["duration"],
                    calories: exer[i].attributes["calories"]
                });
            }
        }

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
        this.addDataToDatabase({ ...this.runningTraining, date: new Date(), state: "completed" });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    cancelTraining(progress: number) {
        this.addDataToDatabase({
            ...this.runningTraining,
            duration: this.runningTraining.duration * (progress / 100),
            calories: this.runningTraining.calories * (progress / 100),
            date: new Date(), state: "cancelled"
        });
        this.runningTraining = null;
        this.trainingChanged.next(null);
    }

    async fetchCompletedOrCanceledTrainings() {
        this.finishedExercise = [];
        (Parse as any).serverURL = environment.serverLiveQueryURL;
        const Exercises = Parse.Object.extend("finishedExercises");
        const query = new Parse.Query(Exercises);

        //for LiveQuery we need to subscrbe the query  ==> https://docs.parseplatform.org/js/guide/#live-queries
        this.subscription = query.subscribe();

        this.subscriptions.push(this.subscription); //  <== store all subscriptions in an array to unsubscrib all of them in component.

        const exer = await query.find().catch(() => {
            this.uiService.showSnackbar("Fetching Exercises failed, please try again later.", null, 3000);
        });
        if (exer) {
            for (let i = 0; i < exer.length; i++) {
                this.finishedExercise.push({
                    id: exer[i]["id"],
                    name: exer[i].attributes["name"],
                    duration: exer[i].attributes["duration"],
                    calories: exer[i].attributes["calories"],
                    date: exer[i].attributes["createdAt"],
                    state: exer[i].attributes["state"]
                });
            }
        }

        // Real Time (LiveQuery) if data change in sever(Back4App database) it will update automaticly in app.
        (await this.subscription).on("update", (result) => {
            var updatedExercise = this.finishedExercise.find(x => x.id === result["id"]);
            updatedExercise.name = result.attributes["name"];
            updatedExercise.duration = result.attributes["duration"];
            updatedExercise.calories = result.attributes["calories"];
            updatedExercise.calories = result.attributes["createdAt"];
            updatedExercise.state = result.attributes["state"];

            console.log(result.attributes["name"] + " Updated in database . . .");
        });

        (await this.subscription).on("delete", (result) => {
            var Exercise = this.finishedExercise.find(x => x.id === result["id"]);
            var indexOfExercise = this.finishedExercise.indexOf(Exercise, 0);
            this.finishedExercise.splice(indexOfExercise);

            console.log(result.attributes["name"] + " Deleted from database . . .");
        });

        (await this.subscription).on("create", (result) => {
            this.finishedExercise.push({
                id: result["id"],
                name: result.attributes["name"],
                duration: result.attributes["duration"],
                calories: result.attributes["calories"],
                date: result.attributes["createdAt"],
                state: result.attributes["state"]
            });
            console.log(result.attributes["name"] + " Created in database . . .");
        });
        (Parse as any).serverURL = environment.serverURL;
        return this.finishedExercise;
    }

    async unsubscribeLiveQueries() {
        if (this.subscriptions) {
            this.subscriptions.forEach(async (sub) => {
                (await sub).unsubscribe();
            });
        }
        (Parse as any).serverURL = environment.serverURL;
    }

    async addDataToDatabase(exercise: Exercise) {
        const finishedExerciseObject = Parse.Object.extend("finishedExercises");
        const finishedExercise = new finishedExerciseObject();
        finishedExercise.set("typeId", exercise.id);
        finishedExercise.set("name", exercise.name);
        finishedExercise.set("state", exercise.state);
        finishedExercise.set("duration", exercise.duration);
        finishedExercise.set("calories", exercise.calories);

        finishedExercise.save();
    }
}