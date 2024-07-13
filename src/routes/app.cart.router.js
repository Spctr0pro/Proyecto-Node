import { Router } from "express";
import CartMaganer from "../manager/CartMaganer.js";

import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();
const cartManager = new CartMaganer();

router.get("/carts/:cid", async (req, res) => {
    try{
        const { cid } = req.params;
        const data = await cartManager.getCartsById(cid);
        res.render("cart", { title: "Productos en el carrito", data });
    }
    catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default router;