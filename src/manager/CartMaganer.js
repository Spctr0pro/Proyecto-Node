import mongoose from "mongoose";
import CartModel from "../models/cart.modelo.js";
import mongoDB from "../config/mongoose.config.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    #getCartsPrivate = async (paramFilters) => {
        try {
            const $and = [];

            if (paramFilters?.status) $and.push({ name: paramFilters.status });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { status: 1 },
                desc: { status: -1 },
            };

            const paginationOptions = {
                limit: paramFilters?.limit ?? 10,
                page: paramFilters?.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                lean: true,
            };

            const coursesFound = await this.#cartModel.paginate(filters, paginationOptions);
            return coursesFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    #persistCart = async (data) => {
        try {
            await this.#cartModel.updateMany({ status: true }
                , { $set: { status: false } });

            data.startDate = data.start_date;
            data.endDate = data.end_date;
            const cartCreated = new CartModel(data);

            await cartCreated.save();

            return cartCreated;
        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    addCart = async (data) => {
        const newCart = {
            products: data,
            status: true
        };

        const cart = await this.#persistCart(newCart);
        return cart;
    }

    getCarts = async () => {
        const carts = await this.#getCartsPrivate();
        return carts;
    }

    getCartsById = async (cid) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid).populate("products.productId").lean();
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    // CREA O DEVUELVE EL CARRITO ACTIVO
    getCart = async () => {
        try {
            const cartFound = await this.#cartModel.find({ status: true });
            if (!cartFound) {
                const newCart = await this.addCart([]);
                return newCart;
            }
            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    updateCarts = async (cid, pid, quantity) => {
        try {
            if (!mongoDB.isValidID(cid) || !mongoDB.isValidID(pid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }
            const productFound = cartFound.products.find((p) => p.productId == pid)

            if (productFound) {
                // ACTUALIZA EL ARREGLO DE PRODUCTOS DEL CARRITO
                const updated = await this.#cartModel.findOneAndUpdate(
                    { _id: cid, 'products.productId': pid },
                    { $set: { "products.$.quantity": productFound.quantity + quantity } },
                    {
                        new: true
                    }
                )
                return updated;
            }
            else {
                // CREATE EL JSON PARA AÑADIRLO AL CARRITO CUANDO EL PRODUCTO NO EXISTE EN EL CARRITO
                const newProduct = {
                    productId: pid,
                    quantity
                }
                cartFound.products.push(newProduct);
                await cartFound.save();
            }
            return cartFound;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    deleteProductCarts = async (cid, pid) => {
        try {
            if (!mongoDB.isValidID(cid) || !mongoDB.isValidID(pid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }
            const productFound = cartFound.products.find((p) => p.productId == pid);

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }
            cartFound.products.pull({ productId: pid })
            cartFound.save();
            return cartFound;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    updateProductCarts = async (cid, data) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            const updated = await this.#cartModel.findOneAndUpdate(
                { _id: cid },
                { $set: { "products": data } },
                {
                    new: true
                }
            )
            return updated;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    removeProductsCart = async (cid) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            const updated = await this.#cartModel.findOneAndUpdate(
                { _id: cid },
                { $set: { "products": [] } },
                {
                    new: true
                }
            )
            return updated;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }
}