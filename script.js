// ===== GESTION DU STOCKAGE HYBRIDE =====
class StorageManager {
    constructor() {
        this.dbName = 'LeProfesseurDB';
        this.dbVersion = 1;
        this.db = null;
    }
    
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('media')) {
                    db.createObjectStore('media', { keyPath: 'id' });
                }
            };
        });
    }
    
    async saveMedia(id, dataUrl) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['media'], 'readwrite');
            const store = transaction.objectStore('media');
            
            const request = store.put({ id, data: dataUrl });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getMedia(id) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['media'], 'readonly');
            const store = transaction.objectStore('media');
            
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result?.data);
            request.onerror = () => reject(request.error);
        });
    }
    
    async deleteMedia(id) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['media'], 'readwrite');
            const store = transaction.objectStore('media');
            
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

const storageManager = new StorageManager();

// Initialize Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Set viewport height for mobile
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// Global variables
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let musicPlaying = false;
let firstClick = true;
let currentProduct = null;
let currentPage = 'menu';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let adminCurrentCat = 'stup';

// Products Data - Chargé depuis localStorage (géré par le panel admin)
let productsData = {
    stup: [],
    tabac: [],
    puff: []
};

function loadProductsFromStorage() {
    // Charger depuis localStorage uniquement si disponible, sinon utiliser les produits par défaut
    const saved = localStorage.getItem('products_data');
    
    if (saved) {
        try {
            productsData = JSON.parse(saved);
        } catch (e) {
            console.error('Erreur chargement produits:', e);
            initDefaultProducts();
        }
    } else {
        initDefaultProducts();
    }
    
    updateCategoryCounts();
}
// Initialiser les produits par défaut
function initDefaultProducts() {
    productsData = {
        stup: [
            {
                name: "🍫STATICSIFT🍫 • PINEAPPLE 🍎",
            description: "STATICSIFT de folie terps développé",
            type: "video",
            media: "videos/stup1.mp4",
            thumbnail: "videos/stup1.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Un STATICSIFT de folie terps développer comme il faut, encore glassy du feu 🔥\n\nQUANTITÉS DISPO : 10G🍎25G🍎50G🍎100G🍎200G🍎500G🍎1K🍎+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍫DRYSIFT🍫 • ISLAND MIMOSA 🏝️🌻",
            description: "DRYSIFT exceptionnel qualité static",
            type: "video",
            media: "videos/stup2.mp4",
            thumbnail: "videos/stup2.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Les amis je ne vais pas vous le dire deux fois, ce drysift est un mensonge on ne devrait pas pouvoir appeler ça un dry car vue le curage les terps et le développement on est plus sur un static de la fusée les amis foncer il n'y en aura pas pour tout le monde🔥\n\nQUANTITÉS DISPO : 10G🟢25G🟢50G🟢100G🟢200G🟢500G🟢1K🟢+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍫DRYSIFT MOUNTAIN GIANTS 120u🍫 • GAMEBOY COLORS 🧁",
            description: "Mountain Giants Farm - Glassy premium",
            type: "video",
            media: "videos/stup3.mp4",
            thumbnail: "videos/stup3.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Un DRYSIFT de la fameuse farm MOUNTAIN GIANTS de folie terps développer comme il faut, encore glassy du feu 🔥\n\n• ICE CREAM CAKE 🧁\n\nQUANTITÉS DISPO : 10G ⛰️ 25G ⛰️ 50G ⛰️ 100G ⛰️ 200G ⛰️ 500G ⛰️ 1K⛰️+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸 CALI US PREMIUM SHELF • GAS FACE ⛽️",
            description: "Cali unique - Bonbon & boisé",
            type: "video",
            media: "videos/stup4.mp4",
            thumbnail: "videos/stup4.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Une cali unique et spectaculaire la GAS FACE est un mélange de bonbon et de note de fond boisé un régale pour vos papilles 🔥\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K +\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍫DRYSIFT MOUNTAIN GIANTS 120u🍫 • RAW (LONDON POUND CAKE)🧁",
            description: "Format 25g plaquette - Goût bonbon",
            type: "video",
            media: "videos/stup5.mp4",
            thumbnail: "videos/stup5.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Un DRYSIFT de la fameuse farm MOUNTAIN GIANTS format inédit de 25g par plaquette conditionner en feuille slim pour vous faire kiffer, goût prononcer de bonbon 🔥\n\nQUANTITÉS DISPO : 10G ⛰️ 25G ⛰️ 50G ⛰️ 100G ⛰️ 200G ⛰️ 500G ⛰️ 1K⛰️+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇳🇱SHOP NL 🇺🇸 • AMNESIA HAZE 🟢",
            description: "Shop légendaire - Original 12/10",
            type: "video",
            media: "videos/stup6.mp4",
            thumbnail: "videos/stup6.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Une shop d'exception plus besoin de vous la présenter elle est légendaire et connu, pour les connaisseurs il s'agit de la première génétique de A.H le produit original du 12/10 les amis🔥\n\nQUANTITÉS DISPO : 10G🟢25G🟢50G🟢100G🟢200G🟢500G🟢1K🟢+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸🍯PIATELLA UNCLE'S FARM🍯🇺🇸",
            description: "Importé USA - Voyage garanti",
            type: "video",
            media: "videos/stup7.mp4",
            thumbnail: "videos/stup7.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🇺🇸De la folie a tout niveau les amis ce PIATELLA importés tout droit des USA vous fera voyager jusqu'à là-bas 🇺🇸\n\nQUANTITÉS DISPO : 1G🍯3G🍯5G🍯10G🍯25G🍯50G🍯100G🍯\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🟡JAUNE MOUSSEUX🟡 • MILKA🧽",
            description: "Top qualité - Note caramel",
            type: "video",
            media: "videos/stup8.mp4",
            thumbnail: "videos/stup8.mp4",
            rating: "⭐⭐⭐⭐",
            details: "🔥Jaune mousseux de top qualité pas du cbd toug degueulasse, note de tête beuh note de fond caramel 🔥\n\nQUANTITÉS DISPO : 1G🧽3G🧽5G🧽10G🧽25G🧽50G🧽100G🧽200G🧽500G🧽1K🧽 +PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸 CALI US PREMIUM SHELF • GELATO 33 🍦",
            description: "Cali spectaculaire - Bonbon & boisé",
            type: "video",
            media: "videos/stup9.mp4",
            thumbnail: "videos/stup9.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Une cali unique et spectaculaire la GELATO 33 est un mélange de bonbon et de note de fond boisé un régale pour vos papilles 🔥\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K +\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸CALI US🇺🇸 • N9🍾",
            description: "Dérivé NEWBEATLE 1 - Plus fruité",
            type: "video",
            media: "videos/stup10.mp4",
            thumbnail: "videos/stup10.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥La N9 est un dériver de la NEWBEATLE 1 en plus fruité et plus douce une Cali connu et reconnu au US🔥\n\nQUANTITÉS DISPO : 1G🟢3G🟢5G🟢10G🟢25G🟢50G🟢100G🟢200G🟢500G🟢 +PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸🍯LIVE ROSIN PUR 🍯🇺🇸 • LEMON 🍋",
            description: "Concentré haut de gamme sans solvant",
            type: "video",
            media: "videos/stup11.mp4",
            thumbnail: "videos/stup11.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Le live rosin pur est un concentrer de cannabis haut de gammes (fresh Frozen ou WPFF) transformer d'abord en LIVE HASH (bubble Hash) puis presser a chaud (rosin) sans aucun solvant chimique (pas de buthane, pas de co2 pas de propane…)🔥\n\nSouvent apprécier pour sa pureté, son goût prononcer et sa Méthode d'extraction sans solvant\n\n💡Pur signifie souvent sans additif, sans terpènes ajouter, sans coupe uniquement la résine de la plante💡\n\nQUANTITÉS DISPO : 1G🍯3G🍯5G🍯10G🍯25G🍯50G🍯100G🍯\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🇺🇸CALI US PREMIUM🇺🇸 • BISCOTTIZ 🌾",
            description: "Cali favorite de l'équipe",
            type: "video",
            media: "videos/stup12.mp4",
            thumbnail: "videos/stup12.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "⚡️ La BISCOTTIZ fait partie des Cali favorite de l'équipe du professeur, comme une impression de revenir au début des cali ⚡️\n\n🔥QUANTITÉS DISPONIBLES🔥\n10G🟢25G🟢50G🟢100G🟢200G🟢500G🟢\n\n⭕️PV POUR PLUS D'INFOS⭕️"
        },
        {
            name: "🫒OLIVETTE FRESH FROZEN GOLDEN TIGER FARM🫒 • GMO COOKIES 🧅🍪",
            description: "Inédit - Note cookie & oignon caramélisé",
            type: "video",
            media: "videos/stup13.mp4",
            thumbnail: "videos/stup13.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥La famille de la fusée inédit dans la zone, olivette de fresh Frozen de la fameuse farm's GOLDEN TIGER, curée au max un fresh Frozen de qualité, note de tête cookie, note de fond oignon caramélisés 🔥\n\n⭕️Dispo par : 2G🍪5G🍪10G(1 🫒)🍪20G🍪50G🍪100G🍪200G🍪500G🍪 +PV⭕️\n\n🚨PRIX EN PV🚨"
        },
        {
            name: "🟣FRESH FROZEN WHOLE PLANT🟣 • PURPLE MOLT'S 🧬",
            description: "Whole plant - Pureté légendaire",
            type: "video",
            media: "videos/stup14.mp4",
            thumbnail: "videos/stup14.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🧬Les amis ce WHOLE PLANT FRESH FROZEN est tout simplement une dinguerie, ça méthode de traitement asser spécifique de fresh Frozen Qui consiste a recolter entièrement (fleurs, feuille, tige) non sécher et directement mis en congélation après la récolte fais de ce produit un produit a haute teneur en thc et d'une pureté légendaire 🧬\n\nQUANTITÉS DISPO : 1G🟣2G🟣5G🟣10G🟣25G🟣50G🟣100G🟣200G🟣500G🟣1K🟣+PV\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍫DRYSIFT MOUNTAIN GIANTS 120u🍫 • GAMEBOY COLORS 🧁",
            description: "Mountain Giants - Glassy premium",
            type: "video",
            media: "videos/stup15.mp4",
            thumbnail: "videos/stup15.mp4",
            rating: "⭐⭐⭐⭐⭐",
            details: "🔥Un DRYSIFT de la fameuse farm MOUNTAIN GIANTS de folie terps développer comme il faut, encore glassy du feu 🔥\n\n• ICE CREAM CAKE 🧁\n\nQUANTITÉS DISPO : 10G ⛰️ 25G ⛰️ 50G ⛰️ 100G ⛰️ 200G ⛰️ 500G ⛰️ 1K⛰️+PV\n\n⭕️PRIX EN PV⭕️"
        },
{
        name: "🟣 F.F WHOLE PLANT ROEMER FARMS 🟣",
        description: "PURPLE MOLT'S 🧬 - Family's Farmeurs since 2019",
        type: "video",
        media: "videos/stup16.mp4",
        thumbnail: "videos/stup16.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🟣 F.F WHOLE PLANT ROEMER FARMS SINCE 2019 FAMILY'S FARMEURS 🟣\n\n✅ VARIÉTÉS ✅\n• PURPLE MOLT'S 🧬\n\n🧬 Les amis ce WHOLE PLANT FRESH FROZEN est tout simplement une dinguerie, sa méthode de traitement assez spécifique de fresh Frozen qui consiste à récolter entièrement (fleurs, feuille, tige) non séché et directement mis en congélation après la récolte fait de ce produit un produit à haute teneur en THC et d'une pureté légendaire 🧬\n\nROEMER FARMS : Famille de cannaculteur connu et reconnu depuis 2019 🌾\n\nQUANTITÉS DISPO : 1G🟣2G🟣5G🟣10G🟣25G🟣50G🟣100G🟣200G🟣500G🟣1K🟣+PV\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🇺🇸 CALI BAG'S DOJA 🇺🇸",
        description: "DAWG BREATH X COFFIN CANDY 🍭",
        type: "video",
        media: "videos/stup17.mp4",
        thumbnail: "videos/stup17.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🇺🇸 CALI BAG'S DOJA 🇺🇸\n\n✅ VARIÉTÉS ✅\n• DAWG BREATH X COFFIN CANDY 🍭\n\n🔥 Plus besoin de vous présenter cette fameuse farm plus que connue, DOJA nous a sorti une Cali à la fois fruitée/sucrée et choquante du 12/10 🔥\n\nDISPO PAR : 1Bag(3.5g)🛍️2Bag's🛍️5Bag's🛍️10Bag's🛍️25Bag's🛍️+ PV\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🇺🇸 CALI US PREMIUM SHELF 🇺🇸",
        description: "WATERMELON SKITTLEZ 🍉🍦",
        type: "video",
        media: "videos/stup18.mp4",
        thumbnail: "videos/stup18.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🇺🇸 CALI US PREMIUM SHELF 🇺🇸\n\n✅ VARIÉTÉS ✅\n• WATERMELON SKITTLEZ 🍉🍦\n\n🔥 Une cali unique et spectaculaire, la WATERMELON SKITTLEZ est un mélange de bonbon et de note de fond boisé, un régal pour vos papilles 🔥\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K +\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🇺🇸 CALI US PREMIUM SHELF 🇺🇸",
        description: "GAS FACE ⛽️",
        type: "video",
        media: "videos/stup19.mp4",
        thumbnail: "videos/stup19.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🇺🇸 CALI US PREMIUM SHELF 🇺🇸\n\n✅ VARIÉTÉS ✅\n• GAS FACE ⛽️\n\n🔥 Une cali unique et spectaculaire, la GAS FACE est un mélange de bonbon et de note de fond boisé, un régal pour vos papilles 🔥\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K +\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🇺🇸 HASH EXTRACT FULL MELT 🇺🇸",
        description: "BLUEBERRY 🫐",
        type: "video",
        media: "videos/stup20.mp4",
        thumbnail: "videos/stup20.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🇺🇸 HASH EXTRACT FULL MELT 🇺🇸\n\n✅ VARIÉTÉS ✅\n• BLUEBERRY 🫐\n\n🔥 Les amis le FULL MELT est un Hash qui fond complètement quand on le chauffe, sans laisser de résidus solides ni de matière végétale brûlée. On considère généralement que le FULL MELT correspond aux meilleurs grades de Hash, souvent noté 5 à 6 étoiles sur une échelle de qualité 🔥\n\n‼️ Fort goût de myrtille, défonce choquante ‼️\n\nDISPO PAR : 1G🫐3G🫐5G🫐10G🫐25G🫐50G🫐100G🫐300G🫐500G🫐1K🫐\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🇺🇸 MOONROCK EAGLES BEAN'S FARM 🇺🇸",
        description: "GUAVA 🥭",
        type: "video",
        media: "videos/stup21.mp4",
        thumbnail: "videos/stup21.mp4",
        rating: "⭐⭐⭐⭐⭐",
        details: "🇺🇸 MOONROCK EAGLES BEAN'S FARM 🇺🇸\n\n✅ VARIÉTÉS ✅\n• GUAVA 🥭\n\n🔥 La voilà les connaisseurs savent déjà ahah la Moonrock de la farm EAGLES BEAN'S a fait des ravages 🔥\n\nLes revendeurs venez PV ça vous arrange 😉\n\nDISPO PAR : 1G🌒2G🌒5G🌒10G🌒25G🌒50G🌒100G🌒200G🌒500G🌒1K🌒\n\n⭕️PRIX EN PV⭕️"
    }
    ],
    tabac: [
        {
            name: "🚬 PACK CIGARETTES PREMIUM",
            description: "Sélection complète qualité",
            type: "video",
            media: "videos/tabac1.mp4",
            thumbnail: "videos/tabac1.mp4",
            rating: "⭐⭐⭐⭐",
            details: "Pack complet de cigarettes premium. Marques variées disponibles :\n\n✅ Marlboro Red & Blue\n✅ Camel Blue\n✅ Lucky Strike\n✅ Winston\n✅ Et plus encore...\n\nTous formats disponibles. Livraison rapide et discrète.\n\n⭕️PRIX EN PV⭕️"
        }
    ],
   puff: [
    {
        name: "🦅🔥 FALCON 16K 🦅🔥",
        description: "🔥 16K JNR - Saveur intense, gros nuages et sensations garanties 💨⚡🌀",
        type: "image",
        media: "images/puff1.jpg",
        thumbnail: "images/puff1.jpg",
        rating: "⭐⭐⭐⭐⭐",
        details: "🔥 16K JNR - Saveur intense, gros nuages et sensations garanties 💨⚡🌀\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🦅 Falcon 18K 🦅",
        description: "🔥 18K JNR - Encore plus puissant, saveur explosive et nuages XXL 💨⚡🌀",
        type: "image",
        media: "images/puff2.jpg",
        thumbnail: "images/puff2.jpg",
        rating: "⭐⭐⭐⭐",
        details: "🔥 18K JNR - Encore plus puissant, saveur explosive et nuages XXL 💨⚡🌀\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🦅 Falcon 28K 🦅",
        description: "🔥 28K JNR - Ultra puissant, saveur extrême et nuages monstrueux 💨⚡🌀",
        type: "image",
        media: "images/puff3.jpg",
        thumbnail: "images/puff3.jpg",
        rating: "⭐⭐⭐⭐",
        details: "🔥 28K JNR - Ultra puissant, saveur extrême et nuages monstrueux 💨⚡🌀\n\n⭕️PRIX EN PV⭕️"
    },
    {
        name: "🌀 Shisha Hookah 22K ✨",
        description: "🔥 Shisha Hookah 22K - Saveur riche, tirage fluide et gros nuages garantis 💨✨",
        type: "image",
        media: "images/puff4.jpg",
        thumbnail: "images/puff4.jpg",
        rating: "⭐⭐⭐⭐⭐",
        details: "🔥 Shisha Hookah 22K - Saveur riche, tirage fluide et gros nuages garantis 💨✨\n\n⭕️PRIX EN PV⭕️"
    }
]
};
// Sauvegarder dans localStorage pour la persistance des cartes
localStorage.setItem('products_data', JSON.stringify(productsData));
}

// Mettre à jour les compteurs de catégories
function updateCategoryCounts() {
    document.getElementById('count-stup').textContent = productsData.stup.length;
    document.getElementById('count-tabac').textContent = productsData.tabac.length;
    document.getElementById('count-puff').textContent = productsData.puff.length;
}

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        loadingScreen.classList.add('hidden');
        app.style.opacity = '1';
        
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
        
        createParticles();
        showToast('🎉 Bienvenue sur Le Professeur 59-62 !');
    }, 2000);
});

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles-bg');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
        
        const colors = ['rgba(138, 43, 226, 0.6)', 'rgba(93, 173, 226, 0.6)', 'rgba(175, 122, 197, 0.6)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Music control
function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.classList.remove('playing');
        showToast('🔇 Musique désactivée');
    } else {
        bgMusic.play().catch(e => console.log('Music play failed:', e));
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
        showToast('🔊 Musique activée');
    }
    musicPlaying = !musicPlaying;
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Auto-play music on first click
document.addEventListener('click', function autoPlayMusic() {
    if (firstClick && !musicPlaying) {
        bgMusic.play().then(() => {
            musicBtn.textContent = '🔊';
            musicBtn.classList.add('playing');
            musicPlaying = true;
        }).catch(e => console.log('Auto-play failed:', e));
        firstClick = false;
    }
}, { once: true });

// Share app
function shareApp() {
    const shareText = '🔥 Découvrez Le Professeur 59-62 ! Qualité premium, livraison rapide dans le 59/62 !';
    
    if (navigator.share) {
        navigator.share({
            title: 'Le Professeur 59-62',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast('✅ Merci pour le partage !');
            if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
        }).catch(() => {});
    } else {
        tg.showPopup({
            title: '📤 Partager',
            message: shareText,
            buttons: [
                {id: 'copy', type: 'default', text: '📋 Copier le lien'},
                {id: 'cancel', type: 'cancel'}
            ]
        }, (buttonId) => {
            if (buttonId === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('✅ Lien copié !');
            }
        });
    }
}

// Header logo animation
document.getElementById('headerLogo')?.addEventListener('click', () => {
    showToast('🎓 Le Professeur à votre service !');
});

// Touch handling for swipe
let touchStartX = 0;
let touchEndX = 0;

const swipeContainer = document.getElementById('swipe-container');

swipeContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

swipeContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const pages = ['menu', 'info', 'contact'];
        const currentIndex = pages.indexOf(currentPage);
        
        if (diff > 0 && currentIndex < pages.length - 1) {
            navigateToPage(pages[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
            navigateToPage(pages[currentIndex - 1]);
        }
    }
}

// Navigate to page
function navigateToPage(pageName, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const pages = document.querySelectorAll('.page');
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    const activePage = document.querySelector('.page.active');
    
    if (!targetPage || targetPage === activePage) return;
    
    const pageOrder = ['menu', 'info', 'contact'];
    const currentIndex = pageOrder.indexOf(currentPage);
    const targetIndex = pageOrder.indexOf(pageName);
    
    if (targetIndex > currentIndex) {
        activePage.classList.add('slide-left');
    } else {
        activePage.classList.add('slide-right');
    }
    
    setTimeout(() => {
        pages.forEach(page => {
            page.classList.remove('active', 'slide-left', 'slide-right');
        });
        targetPage.classList.add('active');
        currentPage = pageName;
    }, 100);
    
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const navBtn = document.querySelector(`.nav-btn[data-page="${pageName}"]`);
    if (navBtn) navBtn.classList.add('active');
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Show products
function checkVideoExists(videoPath) {
    // Vérifie si le chemin de la vidéo semble valide
    if (!videoPath) return false;
    
    // Liste des extensions vidéo valides
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const hasValidExtension = validExtensions.some(ext => videoPath.toLowerCase().endsWith(ext));
    
    // Vérifie si c'est un chemin relatif valide
    const isRelativePath = videoPath.startsWith('videos/') || videoPath.startsWith('images/') || videoPath.startsWith('./');
    
    return hasValidExtension && isRelativePath;
}

async function loadProductMedia(product) {
    if (product.media && product.media.startsWith('indexeddb://')) {
        const mediaId = product.media.replace('indexeddb://', '');
        try {
            const mediaData = await storageManager.getMedia(mediaId);
            if (mediaData) {
                console.log('✅ Média trouvé dans IndexedDB:', mediaId);
                return mediaData;
            } else {
                console.warn('⚠️ Média non trouvé dans IndexedDB:', mediaId);
                return null;
            }
        } catch (error) {
            console.error('❌ Erreur chargement média IndexedDB:', error);
            return null;
        }
    }
    return product.media;
}

function showProducts(category, event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const container = document.getElementById('products-container');
    const products = productsData[category] || [];
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target.closest('.category-btn')?.classList.add('active');
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:60px 20px; color: rgba(255,255,255,0.5); font-size:16px;">Aucun produit disponible</p>';
        } else {
            container.innerHTML = products.map((product, index) => `
                <div class="product-card" onclick="openProductModal('${category}', ${index})" style="animation-delay: ${index * 0.08}s">
                    <div class="product-image">
                        ${product.type === 'video' ? `
                            <video muted loop playsinline onclick="event.stopPropagation(); try { if (this.paused) this.play(); else this.pause(); } catch(e) { console.log('Video play error:', e); }">
                                <source src="${product.media}" type="video/mp4" onerror="console.log('Video loading error:', this.src); this.parentElement.style.display='none';">
                            </video>
                            <div class="play-icon" onclick="event.stopPropagation(); const video = this.parentElement.querySelector('video'); if (video) try { if (video.paused) video.play(); else video.pause(); } catch(e) { console.log('Video play error:', e); }">▶</div>
                        ` : `<img src="${product.media}" alt="${product.name}" onerror="console.log('Image error:', this.src);">`}
                        <span class="stock-badge">EN STOCK</span>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-rating">${product.rating}</div>
                    </div>
                </div>
            `).join('');
        }
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Open product modal
function openProductModal(category, index) {
    const product = productsData[category][index];
    if (!product) return;
    
    currentProduct = { ...product, category, index };
    
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    const productId = `${category}-${index}`;
    const isFavorite = favorites.includes(productId);
    favoriteBtn.classList.toggle('active', isFavorite);
    
    let mediaHTML = '';
    if (product.type === 'video') {
        mediaHTML = `
            <div class="modal-product-media">
                <video controls loop muted playsinline onerror="console.log('Modal video error:', this.src);">
                    <source src="${product.media}" type="video/mp4">
                    Votre navigateur ne supporte pas la vidéo.
                </video>
                <div style="text-align:center; padding:20px; color:rgba(255,255,255,0.6); font-size:14px;">
                    � Vidéo hébergée sur le serveur<br>
                    <small>${product.serverHosted ? 'Upload automatique' : 'URL manuelle'}</small>
                </div>
            </div>
        `;
    } else if (product.type === 'image') {
        mediaHTML = `
            <div class="modal-product-media">
                <img src="${product.media}" alt="${product.name}" onerror="console.log('Image error:', this.src);">
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        ${mediaHTML}
        <div class="modal-product-name">${product.name}</div>
        <div class="modal-product-description">${product.description}</div>
        <div class="modal-product-rating">${product.rating}</div>
        <p style="color: rgba(255,255,255,0.85); line-height: 1.8; margin-top: 18px; font-size: 14px; white-space: pre-line;">${product.details}</p>
    `;
    
    modal.classList.add('show');
    
    // L'utilisateur doit cliquer sur play pour démarrer la vidéo (évite les erreurs autoplay)
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    const videos = modal.querySelectorAll('video');
    videos.forEach(video => video.pause());
    
    modal.classList.remove('show');
    currentProduct = null;
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Toggle favorite
function toggleFavorite() {
    if (!currentProduct) return;
    
    const productId = `${currentProduct.category}-${currentProduct.index}`;
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        favoriteBtn.classList.remove('active');
        showToast('💔 Retiré des favoris');
    } else {
        favorites.push(productId);
        favoriteBtn.classList.add('active');
        showToast('⭐ Ajouté aux favoris');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Contact for product
function contactForProduct() {
    if (!currentProduct) return;
    
    tg.showPopup({
        title: '📦 Commander ce produit',
        message: `Vous voulez commander:\n${currentProduct.name}\n\nChoisissez votre contact:`,
        buttons: [
            {id: 'snap1', type: 'default', text: '👻 Snap Principal'},
            {id: 'snap2', type: 'default', text: '👻 Snap Secours'},
            {id: 'signal', type: 'default', text: '📱 Signal'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, (buttonId) => {
        if (buttonId === 'snap1') openSnapchat1();
        if (buttonId === 'snap2') openSnapchat2();
        if (buttonId === 'signal') openSignal();
        if (buttonId !== 'cancel') closeModal();
    });
}

// Contact functions
function openSnapchat1() {
    tg.openLink('https://www.snapchat.com/add/pfsrtr');
    showToast('📱 Ouverture de Snapchat...');
    if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
}

function openSnapchat2() {
    tg.openLink('https://www.snapchat.com/add/prfsec');
    showToast('📱 Ouverture de Snapchat...');
    if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
}

function openSignal() {
    tg.openLink('https://signal.me/#eu/vGD3tpB0PRBb-dZdLmbDCVQi9Jm2a2UKSUnyGR5ZW2wyP-e3UUpNbJwTMkwi1nzX');
    showToast('📱 Ouverture de Signal...');
    if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
}

function openPotato() {
    tg.openLink('https://dympt.org/Leprofesseur5962');
    showToast('🥔 Ouverture du Canal Potato...');
    if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
}

// Order now
function orderNow() {
    tg.showPopup({
        title: '📦 Passer commande',
        message: 'Choisissez votre moyen de contact préféré pour passer commande rapidement:',
        buttons: [
            {id: 'snap1', type: 'default', text: '👻 Snap Principal'},
            {id: 'snap2', type: 'default', text: '👻 Snap Secours'},
            {id: 'signal', type: 'default', text: '📱 Signal'},
            {id: 'potato', type: 'default', text: '🥔 Canal Potato'}
        ]
    }, (buttonId) => {
        if (buttonId === 'snap1') openSnapchat1();
        if (buttonId === 'snap2') openSnapchat2();
        if (buttonId === 'signal') openSignal();
        if (buttonId === 'potato') openPotato();
    });
    
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        tg.HapticFeedback.impactOccurred('heavy');
    }
}

// Close app
function closeApp() {
    tg.showConfirm('Voulez-vous vraiment quitter l\'application ?', (confirmed) => {
        if (confirmed) {
            tg.close();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Charger les produits AVANT d'afficher
    loadProductsFromStorage();
    
    // Afficher les produits STUP par défaut
    setTimeout(() => {
        const stupBtn = document.querySelector('[data-category="stup"]');
        if (stupBtn) {
            showProducts('stup', { target: stupBtn });
        }
    }, 100);
    
    tg.setHeaderColor('#0a0a0f');
    tg.setBackgroundColor('#0a0a0f');
});

// ===== PANEL ADMIN FUNCTIONS =====
function openAdmin() {
    document.getElementById('admin-panel').style.display = 'block';
    document.body.style.overflow = 'hidden';
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function closeAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('admin-login-screen').style.display = 'flex';
    document.getElementById('admin-main-content').style.display = 'none';
    document.getElementById('admin-pwd-input').value = '';
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function checkAdminPassword() {
    const password = document.getElementById('admin-pwd-input').value;
    const correctPassword = 'professeur59'; // Mot de passe par défaut
    
    if (password === correctPassword) {
        document.getElementById('admin-login-screen').style.display = 'none';
        document.getElementById('admin-main-content').style.display = 'block';
        adminLoadProducts();
        adminShowToast('🔓 Accès autorisé au panel admin');
        if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
    } else {
        adminShowToast('❌ Mot de passe incorrect');
        document.getElementById('admin-pwd-input').value = '';
        if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('error');
    }
}

function adminShowToast(message) {
    const toast = document.getElementById('admin-toast');
    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(120px)';
    }, 3000);
}

function adminSwitchCat(category, button) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    adminCurrentCat = category;
    adminLoadProducts();
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function adminLoadProducts() {
    const list = document.getElementById('admin-products-list');
    const products = productsData[adminCurrentCat] || [];
    
    if (products.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:rgba(255,255,255,0.4);">Aucun produit dans cette catégorie</div>';
    } else {
        list.innerHTML = products.map((product, index) => `
            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
                    <div style="flex:1;">
                        <div style="font-weight:bold; color:#fff; margin-bottom:4px;">${product.name}</div>
                        <div style="font-size:12px; color:rgba(255,255,255,0.6);">${product.description}</div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button onclick="adminEditProduct(${index})" style="background:rgba(138,43,226,0.3); border:none; color:#fff; padding:6px 10px; border-radius:8px; font-size:11px; cursor:pointer;">✏️</button>
                        <button onclick="adminDeleteProduct(${index})" style="background:rgba(220,53,69,0.3); border:none; color:#fff; padding:6px 10px; border-radius:8px; font-size:11px; cursor:pointer;">🗑️</button>
                    </div>
                </div>
                <div style="font-size:11px; color:rgba(255,255,255,0.4);">
                    Type: ${product.type} | Média: ${product.media}
                </div>
            </div>
        `).join('');
    }
}

function adminAddProduct() {
    // Ouvre le modal pour ajouter un produit
    document.getElementById('product-form-modal').style.display = 'block';
    adminResetForm();
}

function adminResetForm() {
    document.getElementById('f-name').value = '';
    document.getElementById('f-desc').value = '';
    document.getElementById('f-media').value = '';
    document.getElementById('f-media-url').value = '';
    document.getElementById('f-details').value = '';
    document.querySelectorAll('.admin-select-btn[data-cat]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.admin-select-btn[data-cat="stup"]').classList.add('active');
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.admin-select-btn[data-type="video"]').classList.add('active');
    document.getElementById('f-type').value = 'video';
    document.getElementById('f-rating').value = '⭐⭐⭐⭐⭐';
    document.querySelectorAll('.admin-rating-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-rating-btn').forEach(btn => {
        if (btn.textContent.includes('⭐⭐⭐⭐⭐')) btn.classList.add('active');
    });
    document.getElementById('edit-idx').value = '';
    document.getElementById('edit-cat-origin').value = '';
    document.getElementById('form-title').textContent = '➕ Nouveau produit';
    
    // Reset upload preview
    document.getElementById('upload-preview').innerHTML = `
        <div style="font-size:32px; margin-bottom:8px;">📁</div>
        <div style="font-size:13px; color:rgba(255,255,255,0.5); line-height:1.5;">Appuyez pour choisir<br>une photo ou vidéo</div>
    `;
    document.getElementById('upload-status').textContent = '';
}

function selectCat(button) {
    document.querySelectorAll('.admin-select-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function adminEditProduct(index) {
    const product = productsData[adminCurrentCat][index];
    if (!product) return;
    
    // Remplir le formulaire avec les données du produit
    document.getElementById('f-name').value = product.name;
    document.getElementById('f-desc').value = product.description;
    document.getElementById('f-media-url').value = product.media;
    document.getElementById('f-details').value = product.details;
    document.getElementById('f-rating').value = product.rating;
    document.getElementById('f-type').value = product.type;
    
    // Sélectionner la catégorie
    document.querySelectorAll('.admin-select-btn[data-cat]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.admin-select-btn[data-cat="${adminCurrentCat}"]`).classList.add('active');
    
    // Sélectionner le type
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.admin-select-btn[data-type="${product.type}"]`).classList.add('active');
    
    // Sélectionner la note
    document.querySelectorAll('.admin-rating-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-rating-btn').forEach(btn => {
        if (btn.textContent === product.rating) btn.classList.add('active');
    });
    
    // Mode édition
    document.getElementById('edit-idx').value = index;
    document.getElementById('edit-cat-origin').value = adminCurrentCat;
    document.getElementById('form-title').textContent = '✏️ Modifier produit';
    
    // Ouvrir le modal
    document.getElementById('product-form-modal').style.display = 'block';
    
    adminShowToast('✏️ Modification du produit');
}

function adminDeleteProduct(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        productsData[adminCurrentCat].splice(index, 1);
        localStorage.setItem('products_data', JSON.stringify(productsData));
        adminLoadProducts();
        updateCategoryCounts();
        adminShowToast('🗑️ Produit supprimé');
        if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') tg.HapticFeedback.notificationOccurred('success');
    }
}

// Fonctions supplémentaires pour le formulaire
function closeProductForm() {
    document.getElementById('product-form-modal').style.display = 'none';
    adminResetForm();
    if (tg.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') tg.HapticFeedback.impactOccurred('light');
}

function selectType(button) {
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.getElementById('f-type').value = button.dataset.type;
}

function setRating(rating) {
    document.querySelectorAll('.admin-rating-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '⭐';
    }
    document.getElementById('f-rating').value = stars;
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            const base64Data = e.target.result;
            
            document.getElementById('upload-status').textContent = `Upload en cours: ${file.name}...`;
            document.getElementById('upload-preview').innerHTML = `
                ${file.type.startsWith('video/') ? 
                    `<video src="${base64Data}" style="max-width:100%; max-height:150px; border-radius:8px;" controls></video>` :
                    `<img src="${base64Data}" style="max-width:100%; max-height:150px; border-radius:8px;">`
                }
                <div style="font-size:12px; color:rgba(255,255,255,0.7); margin-top:8px;">Upload en cours sur le serveur...</div>
            `;
            
            try {
                // Upload vers votre serveur Railway
                const response = await fetch('https://le-professeur-5962-production.up.railway.app/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file: base64Data,
                        type: file.type.startsWith('video/') ? 'video' : 'image'
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Succès : utiliser l'URL du serveur
                    document.getElementById('f-media').value = result.url;
                    document.getElementById('f-media-url').value = result.url;
                    
                    document.getElementById('upload-status').textContent = `✅ Upload réussi: ${file.name}`;
                    document.getElementById('upload-preview').innerHTML = `
                        ${file.type.startsWith('video/') ? 
                            `<video src="${result.url}" style="max-width:100%; max-height:150px; border-radius:8px;" controls></video>` :
                            `<img src="${result.url}" style="max-width:100%; max-height:150px; border-radius:8px;">`
                        }
                        <div style="font-size:12px; color:rgba(76, 175, 80, 0.9); margin-top:8px;">✅ ${file.name}</div>
                    `;
                    
                    adminShowToast('� Fichier uploadé sur le serveur avec succès');
                } else {
                    throw new Error(result.error || 'Upload échoué');
                }
                
            } catch (error) {
                console.error('Erreur upload:', error);
                document.getElementById('upload-status').textContent = `❌ Erreur: ${error.message}`;
                adminShowToast('❌ Erreur lors de l\'upload sur le serveur');
            }
        };
        
        reader.readAsDataURL(file);
    }
}

function saveProduct() {
    const name = document.getElementById('f-name').value.trim();
    const desc = document.getElementById('f-desc').value.trim();
    const details = document.getElementById('f-details').value.trim();
    const rating = document.getElementById('f-rating').value;
    const type = document.getElementById('f-type').value;
    const mediaUrl = document.getElementById('f-media-url').value.trim();
    
    const category = document.querySelector('.admin-select-btn[data-cat].active').dataset.cat;
    const editIdx = document.getElementById('edit-idx').value;
    const editCatOrigin = document.getElementById('edit-cat-origin').value;
    
    if (!name || !desc || !details) {
        adminShowToast('❌ Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (!mediaUrl) {
        adminShowToast('❌ Veuillez uploader une image ou vidéo');
        return;
    }
    
    try {
        const product = {
            name,
            description: desc,
            details,
            rating,
            type,
            media: mediaUrl,
            thumbnail: mediaUrl,
            uploadedFile: true,
            serverHosted: true // Marquer que c'est sur le serveur
        };
        
        if (editIdx !== '' && editCatOrigin !== '') {
            // Mode édition
            productsData[editCatOrigin][parseInt(editIdx)] = product;
            adminShowToast('✅ Produit modifié avec succès');
        } else {
            // Mode ajout
            productsData[category].push(product);
            adminShowToast('✅ Produit ajouté avec succès');
        }
        
        // Sauvegarder dans localStorage (plus besoin d'IndexedDB)
        localStorage.setItem('products_data', JSON.stringify(productsData));
        
        // Fermer le formulaire
        closeProductForm();
        
        // Recharger la liste
        adminLoadProducts();
        updateCategoryCounts();
        
        if (tg.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
    } catch (error) {
        console.error('Erreur sauvegarde produit:', error);
        adminShowToast('❌ Erreur lors de la sauvegarde');
    }
}

console.log('🎓 Le Professeur 59-62 - Version Ultra Premium chargée avec succès !');
