import { connect, Types } from "mongoose";
import conn from "../config/connection.json" assert { type: "json" };


const connectDB = () => {
    const URI = `mongodb+srv://${conn.user}:${conn.pass}@cluster0.qbjax5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const options = {
        useNewUrlParser: true, // Utiliza el nuevo motor de análisis de URL de MongoDB.
        useUnifiedTopology: true, // Deshabilitar los métodos obsoletos.
        dbName: "store", // Nombre de la base de datos.
    };

    connect(URI, options)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error al conectar con MongoDB", err));

};

const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

export default {
    connectDB,
    isValidID,
};