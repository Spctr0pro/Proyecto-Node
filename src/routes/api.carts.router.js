import { Router } from "express";
import CartManager from "../manager/CartMaganer.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

const router = Router();
const cartsManager = new CartManager();

router.get("/", async (req, res) => {
    try{
        const carts = await cartsManager.getCarts();
        res.status(200).send(carts);
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.get("/cart", async (req, res) => {
    try{
        const carts = await cartsManager.getCart();
        res.status(200).send(carts);
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.get("/:cid", async (req, res) => {
    try{
        const { cid } = req.params;
        const carts = await cartsManager.getCartsById(cid);
        res.status(200).send(carts);
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.post("/", async (req, res) => {
    try{
        const { products } = req.body;
        await cartsManager.addCart(products);
        res.status(201).send({ status: "success" })
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if(!cid || !pid || !quantity){
            return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
        }
        await cartsManager.updateCarts(cid, pid, quantity);
        res.status(201).send({ status: "success" })
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params;
        if(!cid || !pid){
            return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
        }
        await cartsManager.deleteProductCarts(cid, pid);
        res.status(201).send({ status: "success" })
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.delete("/:cid", async (req, res) => {
    try{
        const { cid } = req.params;
        if(!cid){
            return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
        }
        await cartsManager.removeProductsCart(cid);
        res.status(201).send({ status: "success" })
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

router.put("/:cid", async (req, res) => {
    try{
        const { cid } = req.params;
        const { products } = req.body;
        if(!cid){
            return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
        }
        await cartsManager.updateProductCarts(cid, products);
        res.status(201).send({ status: "success" })
    }
    catch(error){
        errorHandler(res, error.message);
    }
});

export default router;