const express = require('express');
const router = express.Router();
const PuntoReciclaje = require('../models/puntoReciclajeModel');

// Listar puntos de reciclaje
router.get('/', async (req, res) => {
    try {
        const puntos = await PuntoReciclaje.find();
        res.json(puntos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener puntos' });
    }
});

// Obtener punto por ID
router.get('/:id', async (req, res) => {
    try {
        const punto = await PuntoReciclaje.findById(req.params.id);
        if (!punto) return res.status(404).json({ error: 'Punto no encontrado' });
        res.json(punto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el punto' });
    }
});

// Crear punto
router.post('/', async (req, res) => {
    try {
        const nuevo = new PuntoReciclaje(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el punto' });
    }
});

// Actualizar punto
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await PuntoReciclaje.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizado) return res.status(404).json({ error: 'Punto no encontrado' });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el punto' });
    }
});

// Eliminar punto
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await PuntoReciclaje.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Punto no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el punto' });
    }
});

module.exports = router;