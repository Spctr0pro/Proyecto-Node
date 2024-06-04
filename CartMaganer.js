import fs from "fs";
import path from "path";

export default class CartManager {
    #pathCartJSON;

    constructor() {
        this.#pathCartJSON = path.join("data", "carts.json");
    }

    #getCartsPrivate = async () => {
        if (!fs.existsSync(this.#pathCartJSON)) {
            await fs.promises.writeFile(this.#pathCartJSON, "[]");
        }
        const cartsJSON = await fs.promises.readFile(this.#pathCartJSON, "utf8");
        return JSON.parse(cartsJSON);
    }

    #persistCart = async (newCart) => {
        const carts = await this.#getCartsPrivate();
        carts.push(newCart);

        const updateCartsJSON = JSON.stringify(carts, null, "\t");
        await fs.promises.writeFile(this.#pathCartJSON, updateCartsJSON);
    }

    addCart = async (products) => {
        const carts = await this.#getCartsPrivate()
        let max;
        if(carts.length > 0){
            max = Math.max.apply(null, carts.map(item => item.id));
        }else{ max = 0; }
        
        const newCart = {
            id: max + 1,// Debe autogenerarse
            products
        };

        await this.#persistCart(newCart);
    }

    getCarts = async () => {
        const carts = await this.#getCartsPrivate();
        return carts;
    }

    getCartsById = async (cid) => {
        const carts = await this.#getCartsPrivate();
        return carts.find(cart => cart.id === Number(cid));
    }

    updateCarts = async (cid, pid) => {
        const carts = await this.#getCartsPrivate();
        
        carts.map((cart) => {
            if(cart.id === Number(cid)){
                if(cart.products.length > 0){
                    if(cart.products.find(p => p.id === Number(pid))){
                        cart.products.map((product) => {
                            if(product.id === Number(pid)){
                                product.quantity = product.quantity + 1; 
                            }
                        });
                    }
                    else{
                        cart.products.push({"id": Number(pid), "quantity": 1})    
                    }
                }
                else{
                    cart.products.push({"id": Number(pid), "quantity": 1})
                }
            }
        });
        const updateCartsJSON = JSON.stringify(carts, null, "\t");
        await fs.promises.writeFile(this.#pathCartJSON, updateCartsJSON);
    }
}