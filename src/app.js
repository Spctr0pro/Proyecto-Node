import paths from "./utils/paths.js";
import express from "express";
import handlebars from "./config/handlebars.config.js";
import appSocket from "./config/socket.config.js";

import apiCartsRouter from "./routes/api.carts.router.js";
import apiProductsRouter from "./routes/api.products.router.js";
import appHomeRouter from "./routes/app.home.router.js";
import appCartRouter from "./routes/app.cart.router.js";

import mongoDB from "./config/mongoose.config.js";



const PORT = 8080;
const HOST = "localhost";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Método oyente de solicitudes
const appHTTP = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

// Configuración del servidor de websocket
const socket = appSocket.config(appHTTP);

// Enrutadores
app.use('/api/products', apiProductsRouter(socket));
app.use('/api/carts', apiCartsRouter);
app.use("/", appHomeRouter);
app.use("/", appCartRouter);

app.use("/api/public", express.static(paths.public));
handlebars.config(app);



// Control de rutas inexistentes
app.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Control de errores internos
app.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});