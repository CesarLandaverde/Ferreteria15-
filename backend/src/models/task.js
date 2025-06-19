import { Schema, model } from "mongoose";

const tasksSchema = new Schema (
    {
        title:{
            type:String
        },
        description: {
            type: String
        },
        completed: {
            type:Boolean
        }
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("tasks", tasksSchema);