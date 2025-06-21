import mongoose, { model, models, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    task: { type: String, required: true },
    note: { type: String },
    timeOfDay: { type: String },
    hours: { type: String },
    plannedDate: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export const taskModel = models.taskModel || model("taskModel", taskSchema);
