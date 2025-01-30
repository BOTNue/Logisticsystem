import * as mongoose from "mongoose"

const pickerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    warehouse: { type: Number, required: true },
    stock_row: { type: Number, required: true },
    work_days: { type: [String], required: true },
    work_hours: { type: [String], required: true }
})

export type Picker = mongoose.InferSchemaType<typeof pickerSchema>
export const Picker = mongoose.model("Picker", pickerSchema)