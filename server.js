const express = require('express');
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.static('.'));

const JSONBIN_ID = process.env.JSONBIN_ID || '6997693b43b1c97be98c5829';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$HDh.vZjjM5lGtDsPLbcqce9WhEZ.bdlPmKbTRMpEM4tP86RS3dlLW';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dbkcnqgyb';
const API_KEY = process.env.CLOUDINARY_API_KEY || '366469192989696';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'L7kwi2I_w_Pv0els3LBhnS56LSk';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'le-professeur';

// ✅ UPLOAD vers Cloudinary
app.post('/api/upload', async (req, res) => {
    try {
        const { file, type } = req.body;
        if (!file) return res.status(400).json({ error: 'Fichier manquant' });

        const resourceType = type === 'video' ? 'video' : 'image';

        const formData = new URLSearchParams();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        // ✅ Nom unique sans slash
        formData.append('public_id', `prof_${Date.now()}`);

        console.log(`Upload ${resourceType} vers Cloudinary...`);

        const r = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
            { method: 'POST', body: formData }
        );

        const text = await r.text();
        console.log('Cloudinary:', text.substring(0, 200));
        const data = JSON.parse(text);

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
        console.log('ERREUR GET:', e.message);
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
        console.log('ERREUR POST:', e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
