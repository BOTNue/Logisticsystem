import { Elysia } from "elysia"
import * as mongoose from "mongoose"
import { Product } from "./product"
import { Driver } from "./driver"
import { Picker } from "./picker"
import { Order } from "./order"


const db = await mongoose.connect("mongodb+srv://joshua:BEjnCT1vVMK8Wg8S@cluster0.s9dkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

interface OrderRequestBody {
    order_id: string;
    products: Array<{
        product_id: string;
        quantity: number;
    }>;
    picker_id: string;
}

interface OrderUpdateBody {
    picker_id: string;
    status: string;
    products: Array<{
        product_id: string;
        quantity: number;
    }>;
}

new Elysia()
    .post("/driver", async ({ body, set }) => {
        // Create driver
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
            // checks if the driver exists
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
        // Create picker
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

    .get("/picker", async ({ query, set }) => {
        const { name, id, warehouse, stock_row, work_days, work_hours } = query;

        const filter: Record<string, any> = {};
        if (name) filter.name = name;
        if (id) filter.id = id;
        if (warehouse) filter.warehouse = warehouse;
        if (stock_row) filter.stock_row = stock_row;
        if (work_days) filter.work_days = work_days;
        if (work_hours) filter.work_hours = work_hours;

        try {
            // checks if the picker exists
            const pickers = await Picker.find(filter);
            if (pickers.length === 0) {
                set.status = 404;
                return { message: "No pickers found matching the query" };
            }
            return pickers;
        } catch (error) {
            set.status = 500;
            return error;
        }
    })

    .post("/product", async ({ body, set }) => {
        // Create product
        const newProduct = new Product({
            name: body.name,
            product_id: body.product_id,
            warehouse: body.warehouse,
            stock_row: body.stock_row,
            price: body.price,
            weight: body.weight,
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
            // Checks if the product exists 
            const products = await Product.find(filter)
            if (products.length === 0) {
                set.status = 404;
                return { message: "No products found matching the query." };
            }
            const response = products.map(product => {
                // Logging the product object for debugging 
                console.log("Processing product:", product);

                // Checks the quantity of the product
                if (product.quantity === 0) {
                    return { ...product.toObject(), message: "Out of stock." };
                }
                return product.toObject();
            });
            return response;

        } catch (error) {
            set.status = 500;
            return { message: "Error fetching product." };
        }
    })

    .post("/order", async ({ body, set }) => {
        const { order_id, products, picker_id } = body as OrderRequestBody;

        try {
            // Checks if the product that wants to be ordere exists
            for (const item of products) {
                const product = await Product.findById(item.product_id);
                if (!product) {
                    set.status = 404;
                    return { message: `Product Id ${item.product_id} not found.` };
                }
                if (product.quantity < item.quantity) {
                    set.status = 400;
                    return { message: `Product ${product.name} out of stock.` };
                }
            }
            // Reduces the products total quantity
            for (const item of products) {
                await Product.findByIdAndUpdate(item.product_id, {
                    $inc: { quantity: -item.quantity }
                });
            }

            // Create order
            const newOrder = new Order({
                order_id,
                product: products,
                picker_id,
                status: "Pending"
            });
            await newOrder.save();

            return newOrder;
        } catch (error) {
            set.status = 500
            return { message: "Error creating order." };
        }
    })

    .put("/order/:id", async ({ params, body, set }) => {
        const { id } = params;
        const { picker_id, status, products } = body as OrderUpdateBody;

        try {
            // Checks if the picker exists 
            if (picker_id) {
                const picker = await Picker.findById(picker_id);
                if (!picker) {
                    set.status = 404;
                    return { message: "Picker not found." };
                }
            }

            // Updates the order 
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { picker_id, status, products },
                { new: true, overwrite: false }
            );

            if (!updatedOrder) {
                set.status = 404;
                return { message: "Order not found." };
            }

            return updatedOrder;
        } catch (error) {
            set.status = 500;
            return { message: "Error updating order." }
        }
    })

    .get("/order", async ({ query, set }) => {
        const { status } = query;

        const filter: Record<string, any> = {};
        if (status) filter.status = status;

        try {
            // Checks if the order exists 
            const orders = await Order.find(filter);
            if (orders.length === 0) {
                set.status = 404;
                return { message: "Order or orders not found." };
            }
            return orders;
        } catch (error) {
            set.status = 500;
            return { message: "Error fetching order." };
        }
    })

    .listen(3000);