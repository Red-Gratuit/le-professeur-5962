const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

const JSONBIN_ID = process.env.JSONBIN_ID || '6997693b43b1c97be98c5829';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$HDh.vZjjM5lGtDsPLbcqce9WhEZ.bdlPmKbTRMpEM4tP86RS3dlLW';

console.log('JSONBIN_ID:', JSONBIN_ID);
console.log('JSONBIN_KEY:', JSONBIN_KEY ? 'OK' : 'MANQUANT');

app.get('/api/products', async (req, res) => {
    try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        const data = await r.json();
        console.log('JSONBin response:', JSON.stringify(data).substring(0, 200));
        if (data.record) {
            res.json(data.record);
        } else {
            res.json({ stup: [], tabac: [], puff: [] });
        }
    } catch(e) {
        console.log('ERREUR GET:', e.message);
        res.json({ stup: [], tabac: [], puff: [] });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_KEY
            },
            body: JSON.stringify(req.body)
        });
        const data = await r.json();
        console.log('JSONBin save:', JSON.stringify(data).substring(0, 200));
        res.json({ success: true });
    } catch(e) {
        console.log('ERREUR POST:', e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
