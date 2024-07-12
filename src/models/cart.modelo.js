import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [{
        _id: {
            type: Schema.ObjectId,
            require: [true, "El id del producto es requerido"],
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

// RELACIÓN INVERSA 0:N - Es una relación virtual que sirva para incluir los estudiantes del curso.
cartSchema.virtual("productsCarts", {
    ref: "products", // Nombre de la collection externa
    localField: "_id", // Nombre del campo de referencia que esta en esta collection
    foreignField: "products._id", // Nombre del campo de referencia que está en la collection externa
    justOne: false,
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;