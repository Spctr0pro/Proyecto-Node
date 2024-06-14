import paths from "./utils/paths.js";
import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import handlebars from "./config/handlebars.config.js";
import appSocket from "./config/socket.config.js";
import homeRouter from "./routes/home.router.js";

const PORT = 8080;
const HOST = "localhost";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enrutadores
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/products", homeRouter);

handlebars.config(app);
app.use("/api/public", express.static(paths.public));

// Control de rutas inexistentes
app.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Control de errores internos
app.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

// app.listen(PORT, () => {
//     console.log(`Ejecutandose en http://${HOST}:${PORT}`);
// })

// Método oyente de solicitudes
const appHTTP = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
});

// Configuración del servidor de websocket
appSocket.config(appHTTP);