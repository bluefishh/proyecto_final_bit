const express = require('express');
const router = express.Router();
const Comunidad = require('../models/comunidadModel');

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

module.exports = router;