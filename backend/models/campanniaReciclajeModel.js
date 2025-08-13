const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Campaña de Reciclaje
const campanniaReciclajeSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaCampannia: {
        type: Date,
        required: true,
    },
    horaCampannia: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: String,
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente',
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: true,
    }
});

// Creación del modelo de Campaña de Reciclaje
const CampanniaReciclaje = mongoose.model('CampanniaReciclaje', campanniaReciclajeSchema);

module.exports = CampanniaReciclaje;    