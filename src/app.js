import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

const PORT = 8080;
const HOST = "localhost";
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Enrutadores
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
})
