const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

const JSONBIN_ID = process.env.JSONBIN_ID;
const JSONBIN_KEY = process.env.JSONBIN_KEY;

app.get('/api/products', async (req, res) => {
    try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        const data = await r.json();
        res.json(data.record || { stup: [], tabac: [], puff: [] });
    } catch(e) {
        res.json({ stup: [], tabac: [], puff: [] });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_KEY
            },
            body: JSON.stringify(req.body)
        });
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
