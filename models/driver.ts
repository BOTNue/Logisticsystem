import * as mongoose from "mongoose"

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    warehouse: { type: Number, required: true },
    work_days: { type: [String], required: true },
    work_hours: { type: [String], required: true },
});

export type Driver = mongoose.InferSchemaType<typeof driverSchema>
export const Driver = mongoose.model("Driver", driverSchema)