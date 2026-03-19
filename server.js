const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.static('.'));

// Créer les dossiers s'ils n'existent pas
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, videosDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuration de Multer pour l'upload direct
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
        cb(null, path.join(__dirname, 'uploads', folder));
    },
    filename: function (req, file, cb) {
        // Nom unique avec timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max
    }
});

// ✅ UPLOAD direct sur le serveur Railway
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Fichier manquant' });
        }

        const file = req.file;
        const fileType = file.mimetype.startsWith('video/') ? 'video' : 'image';
        
        // Construire l'URL publique
        const publicUrl = `https://le-professeur-5962-production.up.railway.app/uploads/${fileType === 'video' ? 'videos' : 'images'}/${file.filename}`;
        
        console.log(`✅ ${fileType} uploadé: ${file.filename}`);
        console.log(`📡 URL publique: ${publicUrl}`);
        
        res.json({ 
            success: true, 
            url: publicUrl,
            filename: file.filename,
            size: file.size,
            type: fileType
        });
        
    } catch (error) {
        console.error('❌ Erreur upload:', error);
        res.status(500).json({ error: error.message });
    }
});

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JSONBIN_ID = process.env.JSONBIN_ID || '6997693b43b1c97be98c5829';
const JSONBIN_KEY = process.env.JSONBIN_KEY || '$2a$10$HDh.vZjjM5lGtDsPLbcqce9WhEZ.bdlPmKbTRMpEM4tP86RS3dlLW';

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
