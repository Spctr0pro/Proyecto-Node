import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    fetch("http://localhost:8080/api/products")
        .then((response) => response.json())
        .then((data) => res.render("home", { title: "Productos", data }))
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

export default router;