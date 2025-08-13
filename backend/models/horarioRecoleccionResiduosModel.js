const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Horario de Recolección de Residuos
const horarioRecoleccionResiduosSchema = new Schema({
    dia: {
        type: String,
        enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
        required: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    comunidad: {
        type: Schema.Types.ObjectId,
        ref: 'Comunidad',
        required: true
    }
});

// Creación del modelo de Horario de Recolección de Residuos
const HorarioRecoleccionResiduos = mongoose.model('HorarioRecoleccionResiduos', horarioRecoleccionResiduosSchema);

module.exports = HorarioRecoleccionResiduos;