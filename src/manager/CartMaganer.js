import mongoose from "mongoose";
import CartModel from "../models/cart.modelo.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";

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

    addCart = async (products) => {
        const newCart = {
            products,
            status: true
        };

        await this.#persistCart(newCart);
    }

    getCarts = async () => {
        const carts = await this.#getCartsPrivate();
        return carts;
    }

    getCartsById = async (cid) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);//.populate("products");

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    updateCarts = async (cid, pid) => {
        try {
            if (!mongoDB.isValidID(cid) || !mongoDB.isValidID(pid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }
            const productFound = cartFound.products.find((p) => p._id === pid)
            if (productFound) {
                const updated = await this.#cartModel.findOneAndUpdate(
                    { _id: cid, 'products._id': pid },
                    { $set: { "products.$.quantity": productFound.quantity + 1 } },
                    {
                        new: true
                    }
                )
                return updated;
            }
            else {
                const newProduct = {
                    _id: pid,
                    quantity: 1
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
}