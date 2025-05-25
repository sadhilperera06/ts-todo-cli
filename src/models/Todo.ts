// interface Todo, types etc..

//import UUID to assing Task No. as ID->PK
import {v4 as uuidv4} from 'uuid';

//In TS, when you declare a "type", you don't specify a base type like ":string"
export type TaskStatus = "Todo"|"Pending"|"Done"
export type TaskPriority = "Low"|"Medium"|"High"

export interface Todo {
    No:number
    Id:string
    Title:string
    Description:string
    Status:TaskStatus
    Priority:TaskPriority
    CreatedAt:Date
}