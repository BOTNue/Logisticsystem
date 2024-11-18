import * as mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    wares_location: { Number, required: true },
    stock_row: { Number, required: true },
    price: { Number, required: true },
    weight: { type: String, required: true }
});

export type Product = mongoose.InferSchemaType<typeof productSchema>
export const Product = mongoose.model("Product", productSchema)