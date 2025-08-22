const express = require('express');
const router = express.Router();
const Alerta = require('../models/alertaModel');

// Obtener todas las alertas
// Obtener alertas filtradas por comunidadId (si se provee)
router.get('/', async (req, res) => {
    try {
        const { comunidadId } = req.query;
        let query = {};
        if (comunidadId) {
            query.comunidad = comunidadId;
        }
        const alertas = await Alerta.find(query).populate('publicadoPor', 'primerNombre primerApellido');
        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las alertas' });
    }
});

// Obtener una alerta por ID
router.get('/:id', async (req, res) => {
    try {
        const alerta = await Alerta.findById(req.params.id);
        if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.json(alerta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la alerta' });
    }
});

// Crear una nueva alerta
router.post('/', async (req, res) => {
    try {
        const nuevaAlerta = new Alerta(req.body);
        const alertaGuardada = await nuevaAlerta.save();
        res.status(201).json(alertaGuardada);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la alerta' });
    }
});

// Actualizar una alerta
router.put('/:id', async (req, res) => {
    try {
        const alertaActualizada = await Alerta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!alertaActualizada) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.json(alertaActualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la alerta' });
    }
});

// Eliminar una alerta
router.delete('/:id', async (req, res) => {
    try {
        const eliminada = await Alerta.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar la alerta' });
    }
});

module.exports = router;