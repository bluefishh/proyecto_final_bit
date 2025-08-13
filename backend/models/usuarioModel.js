const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Definición del esquema para el modelo de Usuario
const usuarioSchema = new Schema({
    primerNombre: {
        type: String,
        required: true
    },
    segundoNombre: {
        type: String,
        required: true
    },
    primerApellido: {
        type: String,
        required: true
    },
    segundoApellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true,
        minlength: 6
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    genero: {
        type: String,
        enum: ['masculino', 'femenino', 'otro'],
        required: true
    },
    rol: {
        type: String,
        enum: ['residente', 'admin'],
        default: 'residente',
        required: true
    }
});

// Middleware: hash de contraseña antes de guardar si fue modificada
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Método de instancia para comparar contraseña
usuarioSchema.methods.compararContrasena = async function (entrada) {
    return bcrypt.compare(entrada, this.contrasena);
};

// Creación del modelo de Usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;