import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: {
        index: { id: "idx_name" },
        type: Array,
        required: [ false ],
        uppercase: false,
        trim: true
    },
    status: {
        type: Boolean,
        required: [ false ],
    }
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    toJSON: { virtuals: true }, // Permite que los campos virtuales se incluyan en el JSON.
});

// // RELACIÓN INVERSA 0:N - Es una relación virtual que sirva para incluir los estudiantes del curso.
// courseSchema.virtual("products", {
//     ref: "students", // Nombre de la collection externa
//     localField: "_id", // Nombre del campo de referencia que esta en esta collection
//     foreignField: "courses", // Nombre del campo de referencia que está en la collection externa
//     justOne: false,
// });

// // Middleware que elimina la referencia en los estudiantes al eliminar el curso.
// courseSchema.pre("findByIdAndDelete", async function(next) {
//     const StoreModel = this.model("students");

//     await StoreModel.updateMany(
//         { courses: this._id },
//         { $pull: { courses: this._id } },
//     );

//     next();
// });

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;