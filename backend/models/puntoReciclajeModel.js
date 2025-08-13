const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Punto de Reciclaje
const puntoReciclajeSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['papel', 'plástico', 'vidrio', 'orgánico', 'todos', 'otro'],
        required: true
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Creación del modelo de Punto de Reciclaje
const PuntoReciclaje = mongoose.model('PuntoReciclaje', puntoReciclajeSchema);

module.exports = PuntoReciclaje;