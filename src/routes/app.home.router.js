import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try{
        const paramFilters = req.query;
        const data = await productManager.getProducts(paramFilters);
        res.render("home", { title: "Productos", data });
    }
    catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

export default router;