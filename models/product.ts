import * as mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product_id: { type: String, required: true, unique: true },
    warehouse: { type: Number, required: true },
    stock_row: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 }
});

export type Product = mongoose.InferSchemaType<typeof productSchema>
export const Product = mongoose.model("Product", productSchema)