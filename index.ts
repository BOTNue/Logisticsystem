import { Elysia } from "elysia"
import * as mongoose from "mongoose"
import { Product } from "./models/product"
import { Driver } from "./models/driver"
import { Picker } from "./models/picker"


const db = await mongoose.connect("mongodb+srv://joshua:BEjnCT1vVMK8Wg8S@cluster0.s9dkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

new Elysia()
    .post("/driver", async ({ body, set }) => {
        const newDriver = new Driver({
            name: body.name,
            id: body.id,
            warehouse: body.warehouse,
            work_days: body.work_days,
            work_hours: body.work_hours
        });
        try {
            await newDriver.save()
        } catch (error) {
            set.status = 400;
            return error
        }
        return newDriver;
    })

    .get("/driver", async ({ query, set }) => {
        const { name, id, warehouse, work_days, work_hours } = query;

        const filter: Record<string, any> = {};
        if (name) filter.name = name;
        if (id) filter.id = id;
        if (warehouse) filter.warehouse = warehouse;
        if (work_days) filter.work_days = work_days;
        if (work_hours) filter.work_hours = work_hours;

        try {
            const drivers = await Driver.find(filter);
            if (drivers.length === 0) {
                set.status = 404;
                return { message: "No drivers found matching the query" };
            }
            return drivers;
        } catch (error) {
            set.status = 500;
            return error;
        }
    })

    .post("/picker", async ({ body, set }) => {
        const newPicker = new Picker({
            name: body.name,
            id: body.id,
            warehouse: body.warehouse,
            stock_row: body.stock_row,
            work_days: body.work_days,
            work_hours: body.work_hours
        });
        try {
            await newPicker.save()
        } catch (error) {
            set.status = 400;
            return error;
        }
        return newPicker;
    })

    .post("/product", async ({ body, set }) => {
        const newProduct = new Product({
            name: body.name,
            product_id: body.product_id,
            warehouse: body.warehouse,
            stock_row: body.stock_row,
            price: body.price,
            weight: body.weight,
            priority: body.priority,
            quantity: body.quantity
        });
        try {
            await newProduct.save()
        } catch (error) {
            set.status = 400;
            return error;
        }
        return newProduct;
    })

    .get("/product", async ({ query, set }) => {
        const { name } = query;

        const filter: Record<string, any> = {};
        if (name) filter.name = name;

        try {
            const products = await Product.find(filter)
            if (products.length === 0) {
                set.status = 404;
                return { message: "No products found matching the query" };
            }
            const response = products.map(product => {
                // Logging the product object for debugging 
                console.log("Processing product:", product);

                if (product.quantity === 0) {
                    return { ...product.toObject(), message: "Out of stock" };
                }
                return product.toObject();
            });

            return response;
        } catch (error) {
            set.status = 500;
            return error;
        }
    })


    .listen(3030);