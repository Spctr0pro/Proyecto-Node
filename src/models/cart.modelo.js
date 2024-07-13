import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [{
        productId: {
            type: Schema.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            require: [true, "La cantidad es obligatoria"]
        }
    }],
    status: {
        type: Boolean,
        required: [false],
    },
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    toJSON: { virtuals: true }, // Permite que los campos virtuales se incluyan en el JSON.
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;