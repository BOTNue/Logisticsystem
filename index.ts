import { Elysia } from "elysia"
import * as mongoose from "mongoose"
import { Product } from "./models/product"
import { Chauffeur } from "./models/chauffeur"
import { Picker } from "./models/picker"
import { listen } from "bun"

const db = await mongoose.connect("mongodb+srv://joshua:BEjnCT1vVMK8Wg8S@cluster0.s9dkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

new Elysia()
    .post("/chauffeur", async ({ body, set }) => {
        const newChauffeur = new Chauffeur({
            id: body.id,
            wares_location: body.wares_location,
            work_days: body.work_days,
            work_hours: body.work_hours
        });
        try {
            await newChauffeur.save()
        } catch (error) {
            set.status = 400;
            return error
        }
        return newChauffeur;
    })

    .listen(3030)