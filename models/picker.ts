import * as mongoose from "mongoose"

const pickerSchema = new mongoose.Schema({
    id: { String, required: true },
    wares_location: { Number, required: true },
    stock_row: { Number, required: true },
    work_days: { type: [String], required: true },
    work_hours: { type: [String], required: true }
});

export type Picker = mongoose.InferSchemaType<typeof pickerSchema>
export const Picker = mongoose.model("Picker", pickerSchema)