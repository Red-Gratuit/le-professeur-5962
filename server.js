const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

const JSONBIN_ID = process.env.JSONBIN_ID || '6997693b43b1c97be98c5829';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$HDh.vZjjM5lGtDsPLbcqce9WhEZ.bdlPmKbTRMpEM4tP86RS3dlLW';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// ✅ Upload image/vidéo vers Cloudinary
app.post('/api/upload', async (req, res) => {
    try {
        const { file, type } = req.body;
        if (!file) return res.status(400).json({ error: 'Fichier manquant' });

        const resourceType = type === 'video' ? 'video' : 'image';
        const timestamp = Math.round(Date.now() / 1000);

        // Signature Cloudinary
        const crypto = require('crypto');
        const str = `timestamp=${timestamp}${API_SECRET}`;
        const signature = crypto.createHash('sha1').update(str).digest('hex');

        const formData = new URLSearchParams();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('api_key', API_KEY);
        formData.append('signature', signature);

        const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await r.json();
        if (data.secure_url) {
            res.json({ success: true, url: data.secure_url });
        } else {
            res.status(500).json({ error: 'Upload échoué', details: data });
        }
    } catch(e) {
        console.log('ERREUR UPLOAD:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// ✅ GET produits depuis JSONBin
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

// ✅ POST produits vers JSONBin
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
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
