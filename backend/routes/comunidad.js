const express = require('express');
const router = express.Router();
const Comunidad = require('../models/comunidadModel');

// Obtener comunidades donde el usuario es miembro
router.get('/mis/:usuarioId', async (req, res) => {
    try {
        const comunidades = await Comunidad.find({ miembros: req.params.usuarioId });
        res.json(comunidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comunidades del usuario' });
    }
});

// Listar comunidades
router.get('/', async (req, res) => {
    try {
        const comunidades = await Comunidad.find();
        res.json(comunidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comunidades' });
    }
});

// Obtener comunidad por ID
router.get('/:id', async (req, res) => {
    try {
        const comunidad = await Comunidad.findById(req.params.id).populate('miembros');
        if (!comunidad) return res.status(404).json({ error: 'Comunidad no encontrada' });
        res.json(comunidad);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la comunidad' });
    }
});

// Crear comunidad
router.post('/', async (req, res) => {
    try {
        const nueva = new Comunidad(req.body);
        const guardada = await nueva.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la comunidad' });
    }
});

// Actualizar comunidad
router.put('/:id', async (req, res) => {
    try {
        const actualizada = await Comunidad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizada) return res.status(404).json({ error: 'Comunidad no encontrada' });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la comunidad' });
    }
});

// Eliminar comunidad
router.delete('/:id', async (req, res) => {
    try {
        const eliminada = await Comunidad.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ error: 'Comunidad no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar la comunidad' });
    }
});


// Unirse a una comunidad (crea si no existe y une al usuario)
router.post('/unirse', async (req, res) => {
    const { apiId, nombre, ciudad, estado, codigoPostal, usuarioId } = req.body;
    if (!apiId || !nombre || !ciudad || !estado || !codigoPostal || !usuarioId) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    try {
        let comunidad = await Comunidad.findOne({ apiId });
        if (!comunidad) {
            comunidad = new Comunidad({
                apiId,
                nombre,
                ciudad,
                estado,
                codigoPostal,
                miembros: [usuarioId]
            });
            await comunidad.save();
            return res.status(201).json({ comunidad, mensaje: 'Comunidad creada y usuario unido' });
        } else {
            if (!comunidad.miembros.includes(usuarioId)) {
                comunidad.miembros.push(usuarioId);
                await comunidad.save();
                return res.status(200).json({ comunidad, mensaje: 'Usuario unido a la comunidad' });
            } else {
                return res.status(200).json({ comunidad, mensaje: 'El usuario ya es miembro de la comunidad' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al unirse a la comunidad' });
    }
});

module.exports = router;