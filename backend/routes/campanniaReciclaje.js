const express = require('express');
const router = express.Router();
const CampanniaReciclaje = require('../models/campanniaReciclajeModel');

// Listar campañas
router.get('/', async (req, res) => {
    try {
        const campannias = await CampanniaReciclaje.find();
        res.json(campannias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener campañas' });
    }
});

// Obtener campaña por ID
router.get('/:id', async (req, res) => {
    try {
        const campannia = await CampanniaReciclaje.findById(req.params.id);
        if (!campannia) return res.status(404).json({ error: 'Campaña no encontrada' });
        res.json(campannia);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la campaña' });
    }
});

// Crear campaña
router.post('/', async (req, res) => {
    try {
        const nueva = new CampanniaReciclaje(req.body);
        const guardada = await nueva.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la campaña' });
    }
});

// Actualizar campaña
router.put('/:id', async (req, res) => {
    try {
        const actualizada = await CampanniaReciclaje.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizada) return res.status(404).json({ error: 'Campaña no encontrada' });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la campaña' });
    }
});

// Eliminar campaña
router.delete('/:id', async (req, res) => {
    try {
        const eliminada = await CampanniaReciclaje.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ error: 'Campaña no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar la campaña' });
    }
});

module.exports = router;