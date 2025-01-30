import * as mongoose from "mongoose";
import { Picker } from "./picker"
import { Product } from "./product"

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true, unique: true },
    product: [ // List for ordering multiple objects
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    picker_id: { type: mongoose.Schema.Types.ObjectId, ref: "Picker", required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    created_at: { type: Date, default: Date.now }
});

export type Order = mongoose.InferSchemaType<typeof orderSchema>;
export const Order = mongoose.model("Order", orderSchema)