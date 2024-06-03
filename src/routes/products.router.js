import { Router } from "express";
import ProductManager from "../../ProductManager.js";

const router = Router();
const productsManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productsManager.getProducts();
    res.status(200).send({ products });
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;    
    if(!pid){
        return res.status(400).send({"error": "No se envió ningún parámetro"})
    }
    const product = await productsManager.getProductById(pid);
    res.status(200).send({ product });
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, thumbnailes } = req.body;
    if(!title || !description || !code || !price || !stock){
        return res.status(400).send({"error": "Debe enviar toda la información necesaria"})
    }
    await productsManager.addProduct(title, description, code, price, true, stock, thumbnailes)
    res.status(201).send({ status: "success" })
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, thumbnailes } = req.body;
    if(!pid){
        return res.status(400).send({"error": "No viene el parámetro para actualizar el producto."})
    }else if(!title || !description || !code || !price || !stock || !status){
        return res.status(400).send({"error": "Debe enviar toda la información necesaria."})
    }
    await productsManager.updateProduct(pid, title, description, code, price, status, stock, thumbnailes)
    res.status(201).send({ status: "success" })
});

router.delete("/:pid", (req, res) => {
    const { pid } = req.params;
    if(!pid){
        return res.status(400).send({"error": "No se envió ningún parámetro"})
    }
    products = productsManager.getProducts();// Implementar delete
    res.status(200).send({ products });
});

export default router;