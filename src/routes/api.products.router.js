import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import uploader from "../utils/uploader.js";

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
const productsManager = new ProductManager();
const productRoutes = (io) => {
    async function EmitIO() {
        let products;
        products = await productsManager.getProducts();
        console.log(products);
        io.emit("refresh-data", products.docs);
    }

    router.get("/", async (req, res) => {
        try {
            let products;
            products = await productsManager.getProducts(req.query);
            return res.status(200).send({ products });
        }
        catch (error) {
            errorHandler(res, error.message);
        }
    });

    router.get("/:pid", async (req, res) => {
        try {
            const { pid } = req.params;
            if (!pid) {
                return res.status(400).send({ "error": "No se envió ningún parámetro" })
            }
            const product = await productsManager.getProductById(pid);
            res.status(200).send({ product });
        }
        catch (error) {
            errorHandler(res, error.message);
        }
    });

    router.post("/", uploader.single("file"), async (req, res, socketIO) => {
        try {
            const { file } = req;
            const { title, description, code, price, status, stock, thumbnails, category } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ "error": "Debe enviar toda la información necesaria" })
            }
            const newProduct = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: !thumbnails ? [] : thumbnails
            }

            await productsManager.addProduct(newProduct, file)
            EmitIO();
            res.status(201).send({ status: "success" })
        }
        catch (error) {
            errorHandler(res, error.message);
        }
    });

    router.put("/:pid", uploader.single("file"), async (req, res) => {
        try {
            const { pid } = req.params;
            const { file } = req;
            const { title, description, code, price, status, stock, thumbnails, category } = req.body;
            
            if (!pid) {
                return res.status(400).send({ "error": "No viene el parámetro para actualizar el producto." })
            } else if (!title || !description || !code || !price || !stock || !status || !category) {
                return res.status(400).send({ "error": "Debe enviar toda la información necesaria." })
            }

            const updateProduct = {
                title,
                description,
                code,
                price,
                stock,
                status,
                category,
                thumbnails: !thumbnails ? '' : thumbnails
            }

            await productsManager.updateProduct(pid, updateProduct, file)
            EmitIO();
            res.status(201).send({ status: "success" })
        }
        catch (error) {
            errorHandler(res, error.message);
        }
    });

    router.delete("/:pid", async (req, res) => {
        try {
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
        }
        catch (error) {
            errorHandler(res, error.message);
        }
    });

    return router;
}
export default productRoutes;