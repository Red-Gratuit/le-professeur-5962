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

// Products Data - Chargé depuis localStorage (géré par le panel admin)
let productsData = {
    stup: [],
    tabac: [],
    puff: []
};

// Charger les produits depuis localStorage
function loadProductsFromStorage() {
    const saved = localStorage.getItem('products_data');
    
    if (saved) {
        try {
            productsData = JSON.parse(saved);
        } catch (e) {
            console.error('Erreur chargement produits:', e);
            initDefaultProducts();
        }
    } else {
        // Première utilisation : créer les produits par défaut
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
            name: "🏆🥇 PIATELLA UNCLE'S FARM 🥇🏆",
            description: "FULL EXTRACT SATISFACTION ++ 😍🔥",
            type: "image",
            media: "images/puff1.jpg",
            rating: "⭐⭐⭐⭐⭐",
            details: "🇺🇸 FULL EXTRACT - SATISFACTION MAXIMALE 🇺🇸\n\n🔥 Extraction complète de très haute qualité importée directement des USA. Satisfaction maximale absolument garantie. Notre meilleur produit puff disponible ! 🔥\n\nProduit premium pour connaisseurs exigeants.\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍊 ORANGE CRUSH EXTREME",
            description: "Saveur orange explosive 🔥",
            type: "image",
            media: "images/puff2.jpg",
            rating: "⭐⭐⭐⭐",
            details: "🍊 ORANGE CRUSH - EXPLOSION DE SAVEURS 🍊\n\nGoût d'orange ultra intense et rafraîchissant. Très populaire auprès de nos clients fidèles.\n\n✅ Saveur fruitée authentique\n✅ Sensation fraîche durable\n✅ Qualité premium garantie\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍇 GRAPE ICE MENTHOL",
            description: "Raisin mentholé intense 🥶",
            type: "image",
            media: "images/puff3.jpg",
            rating: "⭐⭐⭐⭐",
            details: "🍇 GRAPE ICE - FRAÎCHEUR MENTHOLÉE 🍇\n\nMélange parfait entre fruité et frais. Sensation mentholée très agréable et durable.\n\n✅ Goût raisin authentique\n✅ Fraîcheur mentholée intense\n✅ Effet longue durée\n\n⭕️PRIX EN PV⭕️"
        },
        {
            name: "🍓 STRAWBERRY BLAST",
            description: "Fraise ultra puissante 💥",
            type: "image",
            media: "images/puff4.jpg",
            rating: "⭐⭐⭐⭐⭐",
            details: "🍓 STRAWBERRY BLAST - EXPLOSION FRAISE 🍓\n\nSaveur fraise explosive et sucrée. Un véritable délice fruité à ne pas manquer !\n\n✅ Goût fraise ultra intense\n✅ Sucré et gourmand\n✅ Qualité premium\n\n⭕️PRIX EN PV⭕️"
        }
    ]
};
// Sauvegarder dans localStorage
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
    
    if (tg.HapticFeedback) {
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
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
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
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Show products
function showProducts(category, event) {
    if (event) {
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
                            <video muted loop autoplay playsinline>
                                <source src="${product.thumbnail}" type="video/mp4">
                            </video>
                            <div class="play-icon">▶</div>
                        ` : `<img src="${product.media}" alt="${product.name}">`}
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
    
    if (tg.HapticFeedback) {
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
                <video controls autoplay loop>
                    <source src="${product.media}" type="video/mp4">
                    Votre navigateur ne supporte pas la vidéo.
                </video>
            </div>
        `;
    } else if (product.type === 'image') {
        mediaHTML = `
            <div class="modal-product-media">
                <img src="${product.media}" alt="${product.name}">
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
    
    if (tg.HapticFeedback) {
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
    
    if (tg.HapticFeedback) {
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
    
    if (tg.HapticFeedback) {
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
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

function openSnapchat2() {
    tg.openLink('https://www.snapchat.com/add/prfsec');
    showToast('📱 Ouverture de Snapchat...');
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

function openSignal() {
    tg.openLink('https://signal.me/#eu/vGD3tpB0PRBb-dZdLmbDCVQi9Jm2a2UKSUnyGR5ZW2wyP-e3UUpNbJwTMkwi1nzX');
    showToast('📱 Ouverture de Signal...');
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

function openPotato() {
    tg.openLink('https://dympt.org/Leprofesseur5962');
    showToast('🥔 Ouverture du Canal Potato...');
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
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
    
    if (tg.HapticFeedback) {
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

console.log('🎓 Le Professeur 59-62 - Version Ultra Premium chargée avec succès !');