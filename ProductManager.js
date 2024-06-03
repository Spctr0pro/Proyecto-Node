import fs from "fs";
import path from "path";

export default class ProductManager {
    #pathProductJSON;

    constructor() {
        this.#pathProductJSON = path.join("data", "products.json");
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

    addProduct = async (title, description, code, price, status, stock, thumbnailes) => {
        const products = await this.#getProductsPrivate()
        const max = Math.max.apply(null, products.map(item => item.id));
        const newProduct = {
            id: max + 1,//Debe generarse
            title,
            description,
            code,
            price,
            status,
            stock,
            thumbnailes
        };

        await this.#persistProduct(newProduct);
    }

    updateProduct = async (pid, title, description, code, price, status, stock, thumbnailes) => {
        const products = await this.#getProductsPrivate()
        
        products.map((product) => {
            if(product.id === Number(pid)){
                product.title = title,
                product.description = description,
                product.code = code,
                product.price = price,
                product.status = status,
                product.stock = stock,
                product.thumbnailes = thumbnailes
            }
        })
        
        const updateProductsJSON = JSON.stringify(products, null, "\t");
        await fs.promises.writeFile(this.#pathProductJSON, updateProductsJSON);
    }

    getProducts = async () => {
        const products = await this.#getProductsPrivate();
        return products;
    }

    getProductById = async (pid) => {
        const product = await this.#getProductsFilterPrivate(pid);
        return product;
    }
}