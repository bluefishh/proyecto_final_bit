const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Comunidad
const comunidadSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    apiId: {
        type: String,
        required: true,
        unique: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    miembros: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }]
});

// Creación del modelo de Comunidad
const Comunidad = mongoose.model('Comunidad', comunidadSchema);

module.exports = Comunidad;
