const express = require('express');
const router = express.Router();
const HorarioRecoleccionResiduos = require('../models/horarioRecoleccionResiduosModel');

// Listar horarios
router.get('/', async (req, res) => {
    try {
        const horarios = await HorarioRecoleccionResiduos.find();
        res.json(horarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener horarios' });
    }
});

// Obtener horario por ID
router.get('/:id', async (req, res) => {
    try {
        const horario = await HorarioRecoleccionResiduos.findById(req.params.id);
        if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });
        res.json(horario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el horario' });
    }
});

// Crear horario
router.post('/', async (req, res) => {
    try {
        const nuevo = new HorarioRecoleccionResiduos(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el horario' });
    }
});

// Actualizar horario
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await HorarioRecoleccionResiduos.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizado) return res.status(404).json({ error: 'Horario no encontrado' });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el horario' });
    }
});

// Eliminar horario
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await HorarioRecoleccionResiduos.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Horario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el horario' });
    }
});

module.exports = router;