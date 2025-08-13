const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Alerta
const alertaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: true
    },
    publicadoPor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// Creación del modelo de Alerta
const Alerta = mongoose.model('Alerta', alertaSchema);

module.exports = Alerta;