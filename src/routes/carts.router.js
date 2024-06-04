import { Router } from "express";
import CartManager from "../../CartMaganer.js";

const router = Router();
const cartsManager = new CartManager();

router.get("/", async (req, res) => {
    const carts = await cartsManager.getCarts();

    res.status(200).send(carts);
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const carts = await cartsManager.getCartsById(cid);
    res.status(200).send(carts);
});

router.post("/", async (req, res) => {
    const { products } = req.body;
    await cartsManager.addCart(products);
    res.status(201).send({ status: "success" })
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    if(!cid || !pid){
        return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
    }
    await cartsManager.updateCarts(cid, pid);
    res.status(201).send({ status: "success" })
});

export default router;