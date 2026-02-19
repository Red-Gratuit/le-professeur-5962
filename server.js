const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

const JSONBIN_ID = process.env.JSONBIN_ID || '6997693b43b1c97be98c5829';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$HDh.vZjjM5lGtDsPLbcqce9WhEZ.bdlPmKbTRMpEM4tP86RS3dlLW';

app.get('/api/products', async (req, res) => {
    try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        const text = await r.text();
        console.log('GET JSONBin raw:', text.substring(0, 300));
        const data = JSON.parse(text);
        res.json(data.record || { stup: [], tabac: [], puff: [] });
    } catch(e) {
        console.log('ERREUR GET:', e.message);
        res.json({ stup: [], tabac: [], puff: [] });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        console.log('POST reçu, stup count:', req.body?.stup?.length);
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_KEY
            },
            body: JSON.stringify(req.body)
        });
        const text = await r.text();
        console.log('PUT JSONBin raw:', text.substring(0, 300));
        res.json({ success: true });
    } catch(e) {
        console.log('ERREUR POST:', e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
