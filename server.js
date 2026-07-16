const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.static('.'));

// ===== CONFIG BOT TELEGRAM =====
const TOKEN = process.env.BOT_TOKEN || '8596512035:AAHYFLDTbHv7LZq03peLIym-somlpFjVbdc';
const APP_URL = process.env.APP_URL || 'https://le-professeur-5962-production.up.railway.app';
const BANNER_URL = process.env.BANNER_URL || 'https://res.cloudinary.com/dbkcnqgyb/image/upload/v1771614680/IMG_3384_n7xmsa.webp';
const DEFAULT_ADMIN_ID = '8973743301';
const SECONDARY_ADMIN_ID = process.env.SECONDARY_ADMIN_ID || 'YOUR_SECONDARY_TELEGRAM_ID';
const ADMIN_IDS = new Set(
    [process.env.ADMIN_ID, DEFAULT_ADMIN_ID, SECONDARY_ADMIN_ID]
        .filter(Boolean)
        .map(String)
);

function isAdmin(chatId) {
    return ADMIN_IDS.has(String(chatId));
}

function getMessageUserId(msg) {
    return msg?.from?.id ?? msg?.chat?.id;
}

// Bot en mode webhook (pas de polling = pas de conflit 409)
const bot = new TelegramBot(TOKEN, { webHook: false });

// ===== PERSISTANCE DES UTILISATEURS =====
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function loadUsers() {
    try {
        if (fs.existsSync(usersFile)) {
            const data = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
            return new Set(data);
        }
    } catch (e) {
        console.error('Erreur chargement utilisateurs:', e);
    }
    return new Set();
}

function saveUsers() {
    try {
        fs.writeFileSync(usersFile, JSON.stringify([...users]));
    } catch (e) {
        console.error('Erreur sauvegarde utilisateurs:', e);
    }
}

let users = loadUsers();
console.log(`📂 ${users.size} utilisateurs chargés depuis: ${usersFile}`);

// ===== COMMANDES BOT =====

// /start (seulement si le message COMMENCE par /start)
bot.onText(/^\/start$/,  async (msg) => {
    const chatId = msg.chat.id;
    users.add(chatId);
    saveUsers();

    await bot.sendPhoto(chatId, BANNER_URL, {
        caption:
`👋 Bonjour Les Amis ! Bienvenue sur le bot officiel du Professeur 👨‍🏫🔥

➡️ Ici, tu trouveras toutes nos infos, options d'envoi, actus et offres spéciales.

🕐 Utilise /start pour afficher notre menu et passer commande facilement.

🔒 Merci de faire confiance au Professeur et son équipe — Service rapide, discret & sécurisé. 💜`,

        reply_markup: {
            inline_keyboard: [[
                {
                    text: '👨‍🏫 MENU Le Professeur',
                    web_app: { url: APP_URL }
                }
            ]]
        }
    });
});

// /broadcast (supporte les retours à la ligne)
bot.onText(/^\/broadcast(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = getMessageUserId(msg);

    if (!isAdmin(userId)) {
        return bot.sendMessage(chatId, '❌ Accès refusé !');
    }

    const message = (match && match[1] ? match[1] : '').trim();
    console.log('📢 Broadcast message complet:', JSON.stringify(message));
    if (!message) {
        return bot.sendMessage(chatId, '❌ Message vide. Usage: /broadcast Votre message');
    }

    let success = 0;
    let fail = 0;

    await bot.sendMessage(chatId, `⏳ Envoi en cours à ${users.size} utilisateurs...`);

    for (const userId of users) {
        try {
            await bot.sendMessage(userId, `📢 Message du Professeur :\n\n${message}`);
            success++;
        } catch(e) {
            fail++;
        }
    }

    bot.sendMessage(chatId, `✅ Broadcast terminé !\n✅ Envoyés : ${success}\n❌ Échoués : ${fail}`);
});

// /stats
bot.onText(/\/stats/, (msg) => {
    if (!isAdmin(getMessageUserId(msg))) return;
    bot.sendMessage(msg.chat.id, `📊 Statistiques :\n👥 Utilisateurs enregistrés : ${users.size}`);
});

// ===== WEBHOOK TELEGRAM =====
const WEBHOOK_PATH = `/bot${TOKEN}`;
app.post(WEBHOOK_PATH, (req, res) => {
    const text = req.body?.message?.text || '';
    if (text.startsWith('/broadcast')) {
        console.log('🔍 WEBHOOK RAW TEXT:', JSON.stringify(text));
    }
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Créer les dossiers s'ils n'existent pas (dans data/ pour le volume Railway)
const uploadsDir = path.join(dataDir, 'uploads');
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
        cb(null, path.join(uploadsDir, folder));
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
        const publicUrl = `/uploads/${fileType === 'video' ? 'videos' : 'images'}/${file.filename}`;
        
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
app.use('/uploads', express.static(path.join(dataDir, 'uploads')));

// ✅ Stockage produits dans un fichier JSON local
const productsFile = path.join(dataDir, 'products.json');

if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, JSON.stringify({ stup: [], tabac: [], puff: [] }));
}

// ✅ GET produits depuis le fichier local
app.get('/api/products', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
        res.json(data);
    } catch(e) {
        console.log('ERREUR GET:', e.message);
        res.json({ stup: [], tabac: [], puff: [] });
    }
});

// ✅ POST produits vers le fichier local
app.post('/api/products', (req, res) => {
    try {
        fs.writeFileSync(productsFile, JSON.stringify(req.body, null, 2));
        console.log('✅ Produits sauvegardés sur le serveur');
        res.json({ success: true });
    } catch(e) {
        console.log('ERREUR POST:', e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server on port ${PORT}`);
    
    // Enregistrer le webhook Telegram
    try {
        await bot.setWebHook(`${APP_URL}${WEBHOOK_PATH}`);
        console.log(`🤖 Bot webhook enregistré: ${APP_URL}${WEBHOOK_PATH}`);
    } catch (e) {
        console.error('❌ Erreur webhook:', e.message);
    }
});
