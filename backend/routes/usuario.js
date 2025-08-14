const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

// Login de usuario
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no existe, por favor cree una cuenta' });
        }
        const esValida = await usuario.compararContrasena(password);
        if (!esValida) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrecta' });
        }
        const obj = usuario.toObject();
        delete obj.contrasena;
        // Se genera el token JWT
        const token = jwt.sign({ id: usuario._id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ usuario: obj, token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login' });
    }
});

// Listar usuarios (sin contraseña)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-contrasena');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener usuario por ID (sin contraseña)
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-contrasena');
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

// Crear usuario (oculta contraseña)
router.post('/', async (req, res) => {
    try {
        const nuevo = new Usuario(req.body);
        const guardado = await nuevo.save();
        const obj = guardado.toObject();
        delete obj.contrasena;
        res.status(201).json(obj);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el usuario' });
    }
});

// Actualizar usuario (rehash si cambia contraseña)
router.put('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        Object.assign(usuario, req.body);
        await usuario.save();
        const obj = usuario.toObject();
        delete obj.contrasena;
        res.json(obj);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;