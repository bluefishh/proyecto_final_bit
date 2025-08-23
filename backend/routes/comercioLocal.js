const express = require('express');
const router = express.Router();
const ComercioLocal = require('../models/comercioLocalModel');

// Listar comercios
router.get('/', async (req, res) => {
    try {
        const { comunidadId } = req.query;
        let query = {};
        if (comunidadId) {
            query.comunidad = comunidadId;
        }
        const comercios = await ComercioLocal.find(query).populate('publicadoPor', 'primerNombre primerApellido');
        res.json(comercios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comercios' });
    }
});

// Obtener comercio por ID
router.get('/:id', async (req, res) => {
    try {
        const comercio = await ComercioLocal.findById(req.params.id);
        if (!comercio) return res.status(404).json({ error: 'Comercio no encontrado' });
        res.json(comercio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el comercio' });
    }
});

// Crear comercio
router.post('/', async (req, res) => {
    try {
        const nuevo = new ComercioLocal(req.body);
        let guardado = await nuevo.save();
        guardado = await guardado.populate('publicadoPor', 'primerNombre primerApellido');
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el comercio' });
    }
});

// Actualizar comercio
router.put('/:id', async (req, res) => {
    try {
        let actualizado = await ComercioLocal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!actualizado) return res.status(404).json({ error: 'Comercio no encontrado' });
        actualizado = await actualizado.populate('publicadoPor', 'primerNombre primerApellido');
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el comercio' });
    }
});

// Eliminar comercio
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await ComercioLocal.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Comercio no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el comercio' });
    }
});

module.exports = router;