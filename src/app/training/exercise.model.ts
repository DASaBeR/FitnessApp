import { Data } from "@angular/router";

export interface Exercise {
    id: string;
    name: string;
    duration: number;
    calories: number;
    date?: Data;
    state?: "completed" | "cancelled" | null 
}