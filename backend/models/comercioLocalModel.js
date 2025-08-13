const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Comercio Local
const comercioLocalSchema = new Schema({
    nombreComercio: {
        type: String,
        required: true,
    },
    direccionComercio: {
        type: String,
        required: true,
    },
    descuento: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    fechaVigencia: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente',
    },
    publicadoPor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: true,
    }
});

// Creación del modelo de Comercio Local
const ComercioLocal = mongoose.model('ComercioLocal', comercioLocalSchema);

module.exports = ComercioLocal;