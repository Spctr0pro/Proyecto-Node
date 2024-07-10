import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    #getProductsPrivate = async (paramFilters) => {
        try {
            const $and = [];

            if (paramFilters?.title) $and.push({ title: paramFilters.title });
            if (paramFilters?.description) $and.push({ description: paramFilters.description });
            if (paramFilters?.code) $and.push({ code: paramFilters.code });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { price: 1 },
                desc: { price: -1 },
            };

            const paginationOptions = {
                limit: paramFilters?.limit ?? 10,
                page: paramFilters?.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                //populate: "products",
                lean: true,
            };
            const productsFound = await this.#productModel.paginate(filters, paginationOptions);
            return productsFound;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    #getProductsFilterPrivate = async (pid) => {
        try {
            if (!mongoDB.isValidID(pid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(pid);//.populate("courses");

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    #persistProduct = async (data, file) => {
        try {
            const productCreated = new ProductModel(data);
            productCreated.thumbnails = file?.filename ?? null;
            productCreated.status = true;
            await productCreated.save();

            return productCreated;
        } catch (error) {
            console.log(error.message);
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    #updateProduct = async (id, data, file) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }
            const productFound = await this.#productModel.findById(id);
            const currentThumbnail = productFound.thumbnails;
            const newThumbnail = file?.filename;

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            productFound.title = data.title;
            productFound.description = data.description;
            productFound.stock = data.stock;
            productFound.price = data.price;
            productFound.thumbnails = newThumbnail ?? currentThumbnail;

            await productFound.save();
            if (file && newThumbnail != currentThumbnail) {
                await fileSystem.deleteImage(currentThumbnail);
            }

            return productFound;
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    }

    addProduct = async (newProduct, file) => {
        await this.#persistProduct(newProduct, file);
    }

    updateProduct = async (id, data, file) => {
        const productUpdated = await this.#updateProduct(id, data, file)
        return productUpdated;
    }

    getProducts = async (paramFilters) => {
        const products = await this.#getProductsPrivate(paramFilters);
        return products;
    }

    getProductById = async (pid) => {
        const product = await this.#getProductsFilterPrivate(pid);
        return product;
    }

    deleteProduct = async (pid) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const productFound = await this.#productModel.findById(pid);

            if (!productFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#productModel.findByIdAndDelete(pid);
            await fileSystem.deleteImage(productFound.thumbnails);

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}