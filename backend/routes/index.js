const express = require('express');
const router = express.Router();

// Endpoint para verificar si la API/servidor está funcionando
router.get('/', (req, res) => {
    res.send("API/servidor funcionando");
});

module.exports = router;