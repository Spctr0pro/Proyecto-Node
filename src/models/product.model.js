import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        index: { title: "idx_title" },
        unique: true,
        type: String,
        required: [ true, "El titulo es obligatorio" ],
        uppercase: false,
        trim: true,
        minLength: [ 3, "El titulo debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El titulo debe tener como máximo 25 caracteres" ],
    },
    description: {
        type: String,
        required: [ true, "La descripción es obligatoria" ],
        uppercase: true,
        trim: true,
        minLength: [ 10, "La descripción debe tener al menos 10 caracteres" ],
        maxLength: [ 100, "La descripción debe tener como máximo 100 caracteres" ],
    },
    code: {
        type: String,
        unique: false,
        required: [ true, "El código es obligatorio" ],
        lowercase: true,
        minLength: [ 3, "El código debe tener 3 caracteres" ],
        maxLength: [ 5, "El código debe tener como máximo 5 caracteres" ],
    },
    price:{
        type: Number,
        required: [ true, "El precio es obligatorio" ]
    },
    status: {
        type: Boolean,
        required : false
    },
    stock:{
        type: Number,
        required : false,
        required: [ true, "El stock es obligatorio" ]
    },
    thumbnails: {
        type: String,
        required: [ false, "La imagen es obligatoria" ],
        trim: true,
    },
    category: {
        type: String,
        required: [ true, "La categoría es obligatoria" ],
        trim: true,
        lowercase: true,
    },
    // RELACIÓN FÍSICA 0:N
    // courses: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "carts",
    // }],
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
});

// Índice compuesto para nombre y apellido
// productSchema.index({ title: 1, surname: 1 }, { name: "idx_name_surname" });

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
productSchema.plugin(paginate);

const ProductModel = model("Products", productSchema);

export default ProductModel;