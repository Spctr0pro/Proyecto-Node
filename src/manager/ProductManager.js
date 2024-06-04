import fs from "fs";
import path from "path";

export default class ProductManager {
    #pathProductJSON;

    constructor() {
        this.#pathProductJSON = path.join("src/data", "products.json");
    }

    #getProductsPrivate = async () => {
        if (!fs.existsSync(this.#pathProductJSON)) {
            await fs.promises.writeFile(this.#pathProductJSON, "[]");
        }
        const productsJSON = await fs.promises.readFile(this.#pathProductJSON, "utf8");
        return JSON.parse(productsJSON);
    }

    #getProductsFilterPrivate = async (pid) => {
        if (!fs.existsSync(this.#pathProductJSON)) {
            await fs.promises.writeFile(this.#pathProductJSON, "[]");
        }
        const productsJSON = await fs.promises.readFile(this.#pathProductJSON, "utf8");
        const p = JSON.parse(productsJSON).filter((p) => {
            return p.id === Number(pid)
        });
        return p;
    }

    #persistProduct = async (newProduct) => {
        const products = await this.#getProductsPrivate();
        products.push(newProduct);

        const updateProductsJSON = JSON.stringify(products, null, "\t");
        await fs.promises.writeFile(this.#pathProductJSON, updateProductsJSON);
    }

    #updateProduct = async (products) => {
        const updateProductsJSON = JSON.stringify(products, null, "\t");
        await fs.promises.writeFile(this.#pathProductJSON, updateProductsJSON);
    }

    addProduct = async (title, description, code, price, status, stock, thumbnails) => {
        const products = await this.#getProductsPrivate()
        let max
        if (products.length > 0) {
            max = Math.max.apply(null, products.map(item => item.id));
        }
        else { max = 0; }
        const newProduct = {
            id: (max == null || max == undefined ? 0 : max) + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            thumbnails
        };

        await this.#persistProduct(newProduct);
    }

    updateProduct = async (pid, title, description, code, price, status, stock, thumbnails) => {
        const products = await this.#getProductsPrivate()

        products.map((product) => {
            if (product.id === Number(pid)) {
                product.title = title,
                    product.description = description,
                    product.code = code,
                    product.price = price,
                    product.status = !status ? true : status,
                    product.stock = stock,
                    product.thumbnails = thumbnails
            }
        })

        const updateProductsJSON = JSON.stringify(products, null, "\t");
        await fs.promises.writeFile(this.#pathProductJSON, updateProductsJSON);
    }

    getProducts = async () => {
        const products = await this.#getProductsPrivate();
        return products;
    }

    getProductsLimit = async (limit) => {
        const products = await this.#getProductsPrivate();
        const limitProducts = []
        products.map(product => {
            if (limitProducts.length < limit) {
                limitProducts.push(product);
            }
        })
        return limitProducts;
    }

    getProductById = async (pid) => {
        const product = await this.#getProductsFilterPrivate(pid);
        return product;
    }

    deleteProduct = async (pid) => {
        const products = await this.#getProductsPrivate();
        await this.#updateProduct(products.filter(prod => prod.id !== Number(pid)));
    }
}