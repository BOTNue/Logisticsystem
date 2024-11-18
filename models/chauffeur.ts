import * as mongoose from "mongoose"

const chauffeurSchema = new mongoose.Schema({
    id: { type: String },
    wares_location: { Number },
    stock_row: { Number },
    work_days: { type: [String] },
    work_hours: { type: [String] },
});

export type Chauffeur = mongoose.InferSchemaType<typeof chauffeurSchema>
export const Chauffeur = mongoose.model("Chauffer", chauffeurSchema)