const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Dossier uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

app.use('/uploads', express.static(uploadsDir));

// Database JSON
const dbPath = path.join(__dirname, 'database.json');
let productsData = { stup: [], tabac: [], puff: [] };

function loadDatabase() {
    if (fs.existsSync(dbPath)) {
        productsData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } else {
        saveDatabase();
    }
}

function saveDatabase() {
    fs.writeFileSync(dbPath, JSON.stringify(productsData, null, 2));
}

loadDatabase();

// GET produits
app.get('/api/products', (req, res) => {
    res.json(productsData);
});

// POST produits (texte + fichier)
app.post('/api/products', upload.single('file'), (req, res) => {
    try {
        const { name, description, details, rating, type, category, mediaUrl, editIdx, editCat } = req.body;

        let media = mediaUrl || '';
        if (req.file) {
            media = `/uploads/${req.file.filename}`;
        }

        const product = { name, description, details, rating, type, media, thumbnail: media };
        const cat = category || 'stup';

        if (editIdx !== undefined && editIdx !== '') {
            const idx = parseInt(editIdx);
            if (editCat && editCat !== cat) {
                productsData[editCat].splice(idx, 1);
                productsData[cat].push(product);
            } else {
                productsData[cat][idx] = product;
            }
        } else {
            if (!productsData[cat]) productsData[cat] = [];
            productsData[cat].push(product);
        }

        saveDatabase();
        res.json({ success: true, product });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE produit
app.delete('/api/products/:cat/:idx', (req, res) => {
    try {
        const { cat, idx } = req.params;
        const product = productsData[cat][parseInt(idx)];

        // Supprimer le fichier uploadé si existe
        if (product?.media?.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, product.media);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        productsData[cat].splice(parseInt(idx), 1);
        saveDatabase();
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
