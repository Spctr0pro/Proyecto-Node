import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const productsManager = new ProductManager();
const productRoutes = (io) => {
async function EmitIO(){
    let products;
    products = await productsManager.getProducts();
    io.emit("refresh-data", products);
}    

router.get("/", async (req, res) => {
    const { limit } = req.query;
    let products;    
    if(limit === undefined){
        products = await productsManager.getProducts();
        return res.status(200).send({ products });
    }
    products = await productsManager.getProductsLimit(limit);
    return res.status(200).send({ products });
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).send({ "error": "No se envió ningún parámetro" })
    }
    const product = await productsManager.getProductById(pid);
    res.status(200).send({ product });
});

router.post("/", async (req, res, socketIO) => {
    const { title, description, code, price, status, stock, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock) {
        return res.status(400).send({ "error": "Debe enviar toda la información necesaria" })
    }
    await productsManager.addProduct(title, description, code, price, status, stock, !thumbnails ? [] : thumbnails)
    EmitIO();
    res.status(201).send({ status: "success" })
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, thumbnails } = req.body;
    if (!pid) {
        return res.status(400).send({ "error": "No viene el parámetro para actualizar el producto." })
    } else if (!title || !description || !code || !price || !stock || !status) {
        return res.status(400).send({ "error": "Debe enviar toda la información necesaria." })
    }
    await productsManager.updateProduct(pid, title, description, code, price, status, stock, !thumbnails ? [] : thumbnails)
    EmitIO();
    res.status(201).send({ status: "success" })
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).send({ "error": "No se envió ningún parámetro" })
    }

    const product = await productsManager.getProductById(pid);
    if (product.length === 0) {
        return res.status(400).send({ "Error": `El producto con el Id ${pid}, no existe` });
    }
    await productsManager.deleteProduct(pid);
    EmitIO();
    res.status(200).send({ "existo": `Producto con el Id ${pid} fue eliminado exitosamente` });
});

return router;
}
export default productRoutes;