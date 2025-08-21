const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/nominatim/search', async (req, res) => {
	const q = req.query.q;
	if (!q) return res.status(400).json({ error: 'Falta parámetro de búsqueda' });

	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=co&q=${encodeURIComponent(q)}`;
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'CAS/1.0'
			}
		});
		const data = await response.json();

		const tiposBarrio = [
			'suburb', 'neighbourhood', 'quarter', 'residential',
			'borough', 'block', 'village', 'town', 'administrative'
		];

		// Normalizar la respuesta
		const comunidades = data
			.filter(item =>
				item.address &&
				item.address.country === 'Colombia' &&
				tiposBarrio.includes(item.type)
			)
			.map(item => {
				const address = item.address || {};
				return {
					id: item.place_id,
					nombre: item.display_name,
					lat: item.lat,
					lon: item.lon,
					barrio: address.suburb || address.neighbourhood || address.quarter || address.residential || address.borough || address.block || '',
					municipio: address.city || address.town || address.village || address.county || '',
					departamento: address.state || '',
					pais: address.country || ''
				};
			});

		res.json(comunidades);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error al consultar Nominatim' });
	}
});

module.exports = router;
