const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN || '8596512035:AAHYFLDTbHv7LZq03peLIym-somlpFjVbdc';
const APP_URL = process.env.APP_URL || 'https://le-professeur-5962-production.up.railway.app';
const BANNER_URL = process.env.BANNER_URL || 'https://res.cloudinary.com/dbkcnqgyb/image/upload/v1771614680/IMG_3384_n7xmsa.webp';
const ADMIN_ID = process.env.ADMIN_ID || '8310891728';

const bot = new TelegramBot(TOKEN, { polling: true });

let users = new Set();

// ✅ /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    users.add(chatId);

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

// ✅ /broadcast
bot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (String(chatId) !== String(ADMIN_ID)) {
        return bot.sendMessage(chatId, '❌ Accès refusé !');
    }

    const message = match[1];
    let success = 0;
    let fail = 0;

    bot.sendMessage(chatId, `⏳ Envoi en cours à ${users.size} utilisateurs...`);

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

// ✅ /stats
bot.onText(/\/stats/, (msg) => {
    if (String(msg.chat.id) !== String(ADMIN_ID)) return;
    bot.sendMessage(msg.chat.id, `📊 Statistiques :\n👥 Utilisateurs enregistrés : ${users.size}`);
});

console.log('🤖 Bot Le Professeur démarré !');
