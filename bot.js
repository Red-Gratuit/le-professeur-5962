const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN || '8596512035:AAHYFLDTbHv7LZq03peLIym-somlpFjVbdc';
const APP_URL = process.env.APP_URL || 'https://le-professeur-5962-production.up.railway.app';
const BANNER_URL = process.env.BANNER_URL || 'https://res.cloudinary.com/dbkcnqgyb/image/upload/v1771614680/IMG_3384_n7xmsa.webp';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

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

console.log('🤖 Bot CaliFastDrive démarré !');
