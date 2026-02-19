// ============ INIT TELEGRAM ============
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// ============ VARIABLES GLOBALES ============
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let musicPlaying = false;
let firstClick = true;
let currentProduct = null;
let currentPage = 'menu';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let adminCurrentCat = 'stup';
let productsData = { stup: [], tabac: [], puff: [] };

// ============ CHARGEMENT PRODUITS ============
async function loadProductsFromStorage() {
    try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data?.stup) {
            productsData = data;
        } else {
            initDefaultProducts();
        }
    } catch(e) {
        initDefaultProducts();
    }
    updateCategoryCounts();
}

async function saveProducts() {
    try {
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productsData)
        });
    } catch(e) {
        console.log('Erreur save:', e);
    }
}

function initDefaultProducts() {
    productsData = {
        stup: [
            { name:"🍫STATICSIFT🍫 • PINEAPPLE 🍎", description:"STATICSIFT de folie terps développé", type:"video", media:"videos/stup1.mp4", thumbnail:"videos/stup1.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥Un STATICSIFT de folie terps développer comme il faut, encore glassy du feu 🔥\n\nQUANTITÉS DISPO : 10G🍎25G🍎50G🍎100G🍎200G🍎500G🍎1K🍎+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • ISLAND MIMOSA 🏝️🌻", description:"DRYSIFT exceptionnel qualité static", type:"video", media:"videos/stup2.mp4", thumbnail:"videos/stup2.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT ISLAND MIMOSA de folie 🔥\n\nQUANTITÉS DISPO : 10G🟢25G🟢50G🟢100G🟢200G🟢500G🟢1K🟢+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT MOUNTAIN GIANTS🍫 • GAMEBOY 🧁", description:"Mountain Giants Farm - Glassy premium", type:"video", media:"videos/stup3.mp4", thumbnail:"videos/stup3.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT MOUNTAIN GIANTS GAMEBOY 🔥\n\nQUANTITÉS DISPO : 10G⛰️25G⛰️50G⛰️100G⛰️200G⛰️500G⛰️1K⛰️+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT MOUNTAIN GIANTS🍫 • ISLAND MIMOSA 🏝️", description:"Mountain Giants - Island Mimosa premium", type:"video", media:"videos/stup4.mp4", thumbnail:"videos/stup4.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT MOUNTAIN GIANTS ISLAND MIMOSA 🔥\n\nQUANTITÉS DISPO : 10G⛰️25G⛰️50G⛰️100G⛰️200G⛰️500G⛰️1K⛰️+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • OG KUSH 🌲", description:"Classique OG Kush qualité maximale", type:"video", media:"videos/stup5.mp4", thumbnail:"videos/stup5.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT OG KUSH 🔥\n\nQUANTITÉS DISPO : 10G🌲25G🌲50G🌲100G🌲200G🌲500G🌲1K🌲+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • BISCOTTI 🍪", description:"Biscotti terps explosifs", type:"video", media:"videos/stup6.mp4", thumbnail:"videos/stup6.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT BISCOTTI 🔥\n\nQUANTITÉS DISPO : 10G🍪25G🍪50G🍪100G🍪200G🍪500G🍪1K🍪+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • GELATO 🍦", description:"Gelato premium terps sucrés", type:"video", media:"videos/stup7.mp4", thumbnail:"videos/stup7.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT GELATO 🔥\n\nQUANTITÉS DISPO : 10G🍦25G🍦50G🍦100G🍦200G🍦500G🍦1K🍦+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • WEDDING CAKE 🎂", description:"Wedding Cake terps vanille", type:"video", media:"videos/stup8.mp4", thumbnail:"videos/stup8.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT WEDDING CAKE 🔥\n\nQUANTITÉS DISPO : 10G🎂25G🎂50G🎂100G🎂200G🎂500G🎂1K🎂+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • ZKITTLEZ 🌈", description:"Zkittlez fruité multicolore", type:"video", media:"videos/stup9.mp4", thumbnail:"videos/stup9.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT ZKITTLEZ 🔥\n\nQUANTITÉS DISPO : 10G🌈25G🌈50G🌈100G🌈200G🌈500G🌈1K🌈+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • PURPLE PUNCH 🟣", description:"Purple Punch violet intense", type:"video", media:"videos/stup10.mp4", thumbnail:"videos/stup10.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT PURPLE PUNCH 🔥\n\nQUANTITÉS DISPO : 10G🟣25G🟣50G🟣100G🟣200G🟣500G🟣1K🟣+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • BLUE DREAM 💙", description:"Blue Dream californien", type:"video", media:"videos/stup11.mp4", thumbnail:"videos/stup11.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT BLUE DREAM 🔥\n\nQUANTITÉS DISPO : 10G💙25G💙50G💙100G💙200G💙500G💙1K💙+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • GORILLA GLUE 🦍", description:"Gorilla Glue puissant", type:"video", media:"videos/stup12.mp4", thumbnail:"videos/stup12.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT GORILLA GLUE #4 🔥\n\nQUANTITÉS DISPO : 10G🦍25G🦍50G🦍100G🦍200G🦍500G🦍1K🦍+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • SOUR DIESEL ⛽", description:"Sour Diesel terps diesel", type:"video", media:"videos/stup13.mp4", thumbnail:"videos/stup13.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT SOUR DIESEL 🔥\n\nQUANTITÉS DISPO : 10G⛽25G⛽50G⛽100G⛽200G⛽500G⛽1K⛽+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • LEMON HAZE 🍋", description:"Lemon Haze citronné", type:"video", media:"videos/stup14.mp4", thumbnail:"videos/stup14.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT LEMON HAZE 🔥\n\nQUANTITÉS DISPO : 10G🍋25G🍋50G🍋100G🍋200G🍋500G🍋1K🍋+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🍫DRYSIFT🍫 • AMNESIA 🧠", description:"Amnesia classique puissant", type:"video", media:"videos/stup15.mp4", thumbnail:"videos/stup15.mp4", rating:"⭐⭐⭐⭐⭐", details:"🔥DRYSIFT AMNESIA 🔥\n\nQUANTITÉS DISPO : 10G🧠25G🧠50G🧠100G🧠200G🧠500G🧠1K🧠+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🟣 F.F WHOLE PLANT ROEMER FARMS 🟣", description:"PURPLE MOLT'S 🧬 - Family's Farmeurs since 2019", type:"video", media:"videos/stup16.mp4", thumbnail:"videos/stup16.mp4", rating:"⭐⭐⭐⭐⭐", details:"🟣 F.F WHOLE PLANT ROEMER FARMS SINCE 2019 🟣\n\nQUANTITÉS DISPO : 1G🟣2G🟣5G🟣10G🟣25G🟣50G🟣100G🟣200G🟣500G🟣1K🟣+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🇺🇸 CALI BAG'S DOJA 🇺🇸", description:"DAWG BREATH X COFFIN CANDY 🍭", type:"video", media:"videos/stup17.mp4", thumbnail:"videos/stup17.mp4", rating:"⭐⭐⭐⭐⭐", details:"🇺🇸 CALI BAG'S DOJA 🇺🇸\n\nDISPO PAR : 1Bag(3.5g)🛍️2Bag's🛍️5Bag's🛍️10Bag's🛍️25Bag's🛍️+PV\n\n⭕️PRIX EN PV⭕️" },
            { name:"🇺🇸 CALI US PREMIUM SHELF 🇺🇸", description:"WATERMELON SKITTLEZ 🍉🍦", type:"video", media:"videos/stup18.mp4", thumbnail:"videos/stup18.mp4", rating:"⭐⭐⭐⭐⭐", details:"🇺🇸 CALI US PREMIUM SHELF 🇺🇸\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K+\n\n⭕️PRIX EN PV⭕️" },
            { name:"🇺🇸 CALI US PREMIUM SHELF 🇺🇸", description:"GAS FACE ⛽️", type:"video", media:"videos/stup19.mp4", thumbnail:"videos/stup19.mp4", rating:"⭐⭐⭐⭐⭐", details:"🇺🇸 CALI US PREMIUM SHELF 🇺🇸\n\nDISPO PAR : 10G/25G/50G/100G/200G/500G/1K+\n\n⭕️PRIX EN PV⭕️" },
            { name:"🇺🇸 HASH EXTRACT FULL MELT 🇺🇸", description:"BLUEBERRY 🫐", type:"video", media:"videos/stup20.mp4", thumbnail:"videos/stup20.mp4", rating:"⭐⭐⭐⭐⭐", details:"🇺🇸 HASH EXTRACT FULL MELT 🇺🇸\n\nDISPO PAR : 1G🫐3G🫐5G🫐10G🫐25G🫐50G🫐100G🫐300G🫐500G🫐1K🫐\n\n⭕️PRIX EN PV⭕️" },
            { name:"🇺🇸 MOONROCK EAGLES BEAN'S FARM 🇺🇸", description:"GUAVA 🥭", type:"video", media:"videos/stup21.mp4", thumbnail:"videos/stup21.mp4", rating:"⭐⭐⭐⭐⭐", details:"🇺🇸 MOONROCK EAGLES BEAN'S FARM 🇺🇸\n\nDISPO PAR : 1G🌒2G🌒5G🌒10G🌒25G🌒50G🌒100G🌒200G🌒500G🌒1K🌒\n\n⭕️PRIX EN PV⭕️" }
        ],
        tabac: [
            { name:"🚬 PACK CIGARETTES PREMIUM", description:"Sélection complète qualité", type:"video", media:"videos/tabac1.mp4", thumbnail:"videos/tabac1.mp4", rating:"⭐⭐⭐⭐", details:"Pack complet de cigarettes premium.\n\nMarques : Marlboro, Camel, Lucky Strike, Winston, Chesterfield\n\n⭕️PRIX EN PV⭕️" }
        ],
        puff: [
            { name:"🦅🔥 FALCON 16K 🦅🔥", description:"🔥 16K JNR - Saveur intense, gros nuages garantis 💨⚡", type:"image", media:"images/puff1.jpg", thumbnail:"images/puff1.jpg", rating:"⭐⭐⭐⭐⭐", details:"🔥 16K JNR - Saveur intense, gros nuages et sensations garanties 💨⚡\n\n⭕️PRIX EN PV⭕️" },
            { name:"🦅 FALCON 18K 🦅", description:"🔥 18K JNR - Encore plus puissant, nuages XXL 💨⚡", type:"image", media:"images/puff2.jpg", thumbnail:"images/puff2.jpg", rating:"⭐⭐⭐⭐", details:"🔥 18K JNR - Encore plus puissant, saveur explosive et nuages XXL 💨⚡\n\n⭕️PRIX EN PV⭕️" },
            { name:"🦅 FALCON 28K 🦅", description:"🔥 28K JNR - Ultra puissant, nuages monstrueux 💨", type:"image", media:"images/puff3.jpg", thumbnail:"images/puff3.jpg", rating:"⭐⭐⭐⭐", details:"🔥 28K JNR - Ultra puissant, saveur extrême et nuages monstrueux 💨\n\n⭕️PRIX EN PV⭕️" },
            { name:"🌀 SHISHA HOOKAH 22K ✨", description:"🔥 Shisha Hookah 22K - Saveur riche, tirage fluide 💨✨", type:"image", media:"images/puff4.jpg", thumbnail:"images/puff4.jpg", rating:"⭐⭐⭐⭐⭐", details:"🔥 Shisha Hookah 22K - Saveur riche, tirage fluide et gros nuages garantis 💨✨\n\n⭕️PRIX EN PV⭕️" }
        ]
    };
    saveProducts();
}

function updateCategoryCounts() {
    document.getElementById('count-stup').textContent = productsData.stup?.length || 0;
    document.getElementById('count-tabac').textContent = productsData.tabac?.length || 0;
    document.getElementById('count-puff').textContent = productsData.puff?.length || 0;
}

// ============ LOADING SCREEN ============
window.addEventListener('load', () => {
    setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        ls.classList.add('hidden');
        app.style.opacity = '1';
        setTimeout(() => ls.remove(), 500);
        createParticles();
        showToast('🎉 Bienvenue sur Le Professeur 59-62 !');
    }, 2000);
});

function createParticles() {
    const container = document.getElementById('particles-bg');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random()*100}%; animation-duration:${Math.random()*10+10}s; animation-delay:${Math.random()*5}s; width:${Math.random()*3+2}px; height:${Math.random()*3+2}px; background:${['rgba(138,43,226,0.6)','rgba(93,173,226,0.6)','rgba(175,122,197,0.6)'][Math.floor(Math.random()*3)]};`;
        container.appendChild(p);
    }
}

// ============ TOAST ============
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ============ MUSIQUE ============
function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.classList.remove('playing');
        showToast('🔇 Musique désactivée');
    } else {
        bgMusic.play().catch(e => {});
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
        showToast('🔊 Musique activée');
    }
    musicPlaying = !musicPlaying;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

document.addEventListener('click', function autoPlay() {
    if (firstClick && !musicPlaying) {
        bgMusic.play().then(() => {
            musicBtn.textContent = '🔊';
            musicBtn.classList.add('playing');
            musicPlaying = true;
        }).catch(() => {});
        firstClick = false;
    }
}, { once: true });

// ============ SHARE ============
function shareApp() {
    const shareText = '🔥 Découvrez Le Professeur 59-62 ! Qualité premium, livraison rapide dans le 59/62 !';
    if (navigator.share) {
        navigator.share({ title: 'Le Professeur 59-62', text: shareText, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(window.location.href);
        showToast('✅ Lien copié !');
    }
}

// ============ SWIPE ============
let touchStartX = 0, touchEndX = 0;
const swipeContainer = document.getElementById('swipe-container');
swipeContainer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
swipeContainer.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        const pages = ['menu','info','contact'];
        const idx = pages.indexOf(currentPage);
        if (diff > 0 && idx < pages.length - 1) navigateToPage(pages[idx + 1]);
        else if (diff < 0 && idx > 0) navigateToPage(pages[idx - 1]);
    }
}

// ============ NAVIGATION ============
function navigateToPage(pageName, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const pages = document.querySelectorAll('.page');
    const target = document.querySelector(`[data-page="${pageName}"]`);
    const active = document.querySelector('.page.active');
    if (!target || target === active) return;

    const order = ['menu','info','contact'];
    const ci = order.indexOf(currentPage), ti = order.indexOf(pageName);
    active.classList.add(ti > ci ? 'slide-left' : 'slide-right');

    setTimeout(() => {
        pages.forEach(p => p.classList.remove('active','slide-left','slide-right'));
        target.classList.add('active');
        currentPage = pageName;
    }, 100);

    document.querySelectorAll('.nav-btn[data-page]').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-page="${pageName}"]`)?.classList.add('active');
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

// ============ PRODUITS ============
function showProducts(category, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const container = document.getElementById('products-container');
    const products = productsData[category] || [];

    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    event?.target?.closest('.category-btn')?.classList.add('active');

    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';

    setTimeout(() => {
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:60px 20px;color:rgba(255,255,255,0.5);">Aucun produit disponible</p>';
        } else {
            container.innerHTML = products.map((p, i) => `
                <div class="product-card" onclick="openProductModal('${category}',${i})" style="animation-delay:${i*0.08}s">
                    <div class="product-image">
                        ${p.type==='video'
                            ? `<video muted loop autoplay playsinline><source src="${p.thumbnail}" type="video/mp4"></video><div class="play-icon">▶</div>`
                            : `<img src="${p.media}" alt="${p.name}" onerror="this.style.opacity='0.3'">`}
                        <span class="stock-badge">EN STOCK</span>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-description">${p.description}</div>
                        <div class="product-rating">${p.rating}</div>
                    </div>
                </div>
            `).join('');
        }
        setTimeout(() => { container.style.opacity='1'; container.style.transform='translateY(0)'; }, 50);
    }, 300);

    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

// ============ MODAL PRODUIT ============
function openProductModal(category, index) {
    const product = productsData[category][index];
    if (!product) return;
    currentProduct = { ...product, category, index };

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    const favBtn = document.getElementById('favoriteBtn');
    const isFav = favorites.includes(`${category}-${index}`);
    favBtn.classList.toggle('active', isFav);

    let mediaHTML = '';
    if (product.type === 'video') {
        mediaHTML = `<div class="modal-product-media"><video controls autoplay loop><source src="${product.media}" type="video/mp4"></video></div>`;
    } else {
        mediaHTML = `<div class="modal-product-media"><img src="${product.media}" alt="${product.name}"></div>`;
    }

    modalBody.innerHTML = `
        ${mediaHTML}
        <div class="modal-product-name">${product.name}</div>
        <div class="modal-product-description">${product.description}</div>
        <div class="modal-product-rating">${product.rating}</div>
        <p style="color:rgba(255,255,255,0.85);line-height:1.8;margin-top:18px;font-size:14px;white-space:pre-line;">${product.details}</p>
    `;
    modal.classList.add('show');
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.querySelectorAll('video').forEach(v => v.pause());
    modal.classList.remove('show');
    currentProduct = null;
}

function toggleFavorite() {
    if (!currentProduct) return;
    const id = `${currentProduct.category}-${currentProduct.index}`;
    const favBtn = document.getElementById('favoriteBtn');
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        favBtn.classList.remove('active');
        showToast('💔 Retiré des favoris');
    } else {
        favorites.push(id);
        favBtn.classList.add('active');
        showToast('⭐ Ajouté aux favoris');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function contactForProduct() {
    if (!currentProduct) return;
    tg.showPopup({
        title: '📦 Commander',
        message: `Commander :\n${currentProduct.name}`,
        buttons: [
            {id:'snap1',type:'default',text:'👻 Snap Principal'},
            {id:'snap2',type:'default',text:'👻 Snap Secours'},
            {id:'signal',type:'default',text:'📱 Signal'},
            {id:'cancel',type:'cancel'}
        ]
    }, (id) => {
        if (id==='snap1') openSnapchat1();
        if (id==='snap2') openSnapchat2();
        if (id==='signal') openSignal();
        if (id!=='cancel') closeModal();
    });
}

// ============ CONTACTS ============
function openSnapchat1() { tg.openLink('https://www.snapchat.com/add/pfsrtr'); showToast('📱 Snapchat...'); }
function openSnapchat2() { tg.openLink('https://www.snapchat.com/add/prfsec'); showToast('📱 Snapchat...'); }
function openSignal() { tg.openLink('https://signal.me/#eu/vGD3tpB0PRBb-dZdLmbDCVQi9Jm2a2UKSUnyGR5ZW2wyP-e3UUpNbJwTMkwi1nzX'); showToast('📱 Signal...'); }
function openPotato() { tg.openLink('https://dympt.org/Leprofesseur5962'); showToast('🥔 Canal Potato...'); }

function orderNow() {
    tg.showPopup({
        title: '📦 Commander',
        message: 'Choisissez votre contact :',
        buttons: [
            {id:'snap1',type:'default',text:'👻 Snap Principal'},
            {id:'snap2',type:'default',text:'👻 Snap Secours'},
            {id:'signal',type:'default',text:'📱 Signal'},
            {id:'potato',type:'default',text:'🥔 Canal Potato'}
        ]
    }, (id) => {
        if (id==='snap1') openSnapchat1();
        if (id==='snap2') openSnapchat2();
        if (id==='signal') openSignal();
        if (id==='potato') openPotato();
    });
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
}

function closeApp() {
    tg.showConfirm('Quitter l\'application ?', (ok) => { if (ok) tg.close(); });
}

// ============ PANEL ADMIN ============
function openAdmin() {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('admin-login-screen').style.display = 'flex';
    document.getElementById('admin-main-content').style.display = 'none';
    document.getElementById('admin-pwd-input').value = '';
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function closeAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-pwd-input').value = '';
}

function checkAdminPassword() {
    const pwd = document.getElementById('admin-pwd-input').value;
    const PASS = 'prof5962';

    if (pwd === PASS) {
        document.getElementById('admin-login-screen').style.display = 'none';
        document.getElementById('admin-main-content').style.display = 'block';
        adminRefreshStats();
        adminRenderProducts();
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        adminShowToast('✅ Connecté !');
    } else {
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
        adminShowToast('❌ Mot de passe incorrect !');
        const input = document.getElementById('admin-pwd-input');
        input.value = '';
        input.style.borderColor = '#ff3b30';
        setTimeout(() => input.style.borderColor = 'rgba(138,43,226,0.4)', 1500);
    }
}

function adminRefreshStats() {
    document.getElementById('a-stup').textContent = productsData.stup?.length || 0;
    document.getElementById('a-tabac').textContent = productsData.tabac?.length || 0;
    document.getElementById('a-puff').textContent = productsData.puff?.length || 0;
    document.getElementById('a-total').textContent =
        (productsData.stup?.length||0) + (productsData.tabac?.length||0) + (productsData.puff?.length||0);
}

function adminSwitchCat(cat, el) {
    adminCurrentCat = cat;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    adminRenderProducts();
}

function adminRenderProducts() {
    const list = document.getElementById('admin-products-list');
    const products = productsData[adminCurrentCat] || [];

    if (products.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:14px;">Aucun produit dans cette catégorie</div>';
        return;
    }

    list.innerHTML = products.map((p, i) => {
        let thumb = '';
        if (p.media && p.media.startsWith('data:image')) {
            thumb = `<img src="${p.media}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
        } else if (p.type === 'image' && p.media) {
            thumb = `<img src="${p.media}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" onerror="this.style.opacity='0.3'">`;
        } else if (p.type === 'video' && p.media) {
            thumb = `<video src="${p.media}" muted playsinline style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></video>`;
        } else {
            thumb = p.type === 'video' ? '🎬' : '🖼️';
        }

        return `
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(138,43,226,0.2);border-radius:14px;padding:12px;display:flex;align-items:center;gap:10px;">
                <div style="width:60px;height:60px;border-radius:10px;overflow:hidden;flex-shrink:0;background:rgba(138,43,226,0.2);display:flex;align-items:center;justify-content:center;font-size:22px;">${thumb}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;">${p.name}</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.description}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:5px;">
                    <button onclick="editProduct('${adminCurrentCat}',${i})" style="padding:6px 11px;background:rgba(93,173,226,0.15);border:1px solid rgba(93,173,226,0.3);border-radius:8px;color:#5dade2;font-size:11px;font-weight:bold;cursor:pointer;">✏️ Modifier</button>
                    <button onclick="deleteProduct('${adminCurrentCat}',${i})" style="padding:6px 11px;background:rgba(255,59,48,0.12);border:1px solid rgba(255,59,48,0.25);border-radius:8px;color:#ff6b6b;font-size:11px;font-weight:bold;cursor:pointer;">🗑️ Suppr.</button>
                </div>
            </div>
        `;
    }).join('');
}

function openProductForm() {
    document.getElementById('form-title').textContent = '➕ Nouveau produit';
    document.getElementById('edit-idx').value = '';
    document.getElementById('edit-cat-origin').value = '';
    document.getElementById('f-name').value = '';
    document.getElementById('f-desc').value = '';
    document.getElementById('f-details').value = '';
    document.getElementById('f-rating').value = '⭐⭐⭐⭐⭐';
    document.getElementById('f-type').value = 'video';
    document.getElementById('f-media').value = '';
    document.getElementById('f-media-url').value = '';
    document.getElementById('upload-status').textContent = '';
    document.getElementById('upload-preview').innerHTML = '<div style="font-size:32px;margin-bottom:8px;">📁</div><div style="font-size:13px;color:rgba(255,255,255,0.5);">Appuyez pour choisir<br>une photo ou vidéo</div>';

    document.querySelectorAll('.admin-select-btn[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === adminCurrentCat));
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(b => b.classList.toggle('active', b.dataset.type === 'video'));
    document.querySelectorAll('.admin-rating-btn').forEach(b => b.classList.toggle('active', (b.textContent.match(/⭐/g)||[]).length === 5));

    document.getElementById('product-form-modal').style.display = 'block';
}

function editProduct(cat, idx) {
    const p = productsData[cat][idx];
    document.getElementById('form-title').textContent = '✏️ Modifier le produit';
    document.getElementById('edit-idx').value = idx;
    document.getElementById('edit-cat-origin').value = cat;
    document.getElementById('f-name').value = p.name;
    document.getElementById('f-desc').value = p.description;
    document.getElementById('f-details').value = p.details;
    document.getElementById('f-rating').value = p.rating;
    document.getElementById('f-type').value = p.type;
    document.getElementById('f-media').value = p.media;
    document.getElementById('f-media-url').value = p.media?.startsWith('data:') ? '' : p.media;

    if (p.media) {
        if (p.type === 'image') {
            document.getElementById('upload-preview').innerHTML = `<img src="${p.media}" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;">`;
        } else {
            document.getElementById('upload-preview').innerHTML = `<video src="${p.media}" style="width:100%;max-height:160px;border-radius:8px;" controls muted></video>`;
        }
    }

    document.querySelectorAll('.admin-select-btn[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(b => b.classList.toggle('active', b.dataset.type === p.type));
    const starCount = (p.rating.match(/⭐/g)||[]).length;
    document.querySelectorAll('.admin-rating-btn').forEach(b => b.classList.toggle('active', (b.textContent.match(/⭐/g)||[]).length === starCount));

    document.getElementById('product-form-modal').style.display = 'block';
}

function deleteProduct(cat, idx) {
    tg.showConfirm('🗑️ Supprimer ce produit ?', async (ok) => {
        if (ok) {
            productsData[cat].splice(idx, 1);
            await saveProducts();
            adminRenderProducts();
            adminRefreshStats();
            updateCategoryCounts();
            adminShowToast('🗑️ Produit supprimé !');
        }
    });
}

function closeProductForm() {
    document.getElementById('product-form-modal').style.display = 'none';
}

function selectCat(el) {
    document.querySelectorAll('.admin-select-btn[data-cat]').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

function selectType(el) {
    document.querySelectorAll('.admin-select-btn[data-type]').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('f-type').value = el.dataset.type;
}

function setRating(n) {
    document.getElementById('f-rating').value = '⭐'.repeat(n);
    document.querySelectorAll('.admin-rating-btn').forEach(b => {
        b.classList.toggle('active', (b.textContent.match(/⭐/g)||[]).length === n);
    });
}

// ============ UPLOAD CLOUDINARY ============
async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const statusEl = document.getElementById('upload-status');
    statusEl.textContent = '⏳ Upload en cours...';

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    document.querySelectorAll('.admin-select-btn[data-type]').forEach(b => {
        b.classList.toggle('active', (isImage && b.dataset.type==='image') || (isVideo && b.dataset.type==='video'));
    });
    document.getElementById('f-type').value = isImage ? 'image' : 'video';

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result;
        const preview = document.getElementById('upload-preview');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: base64, type: isImage ? 'image' : 'video' })
            });
            const data = await res.json();

            if (data.success && data.url) {
                document.getElementById('f-media').value = data.url;
                document.getElementById('f-media-url').value = data.url;
                if (isImage) {
                    preview.innerHTML = `<img src="${data.url}" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;">`;
                    statusEl.textContent = `✅ Image uploadée !`;
                } else {
                    preview.innerHTML = `<video src="${data.url}" style="width:100%;max-height:160px;border-radius:8px;" controls muted></video>`;
                    statusEl.textContent = `✅ Vidéo uploadée !`;
                }
            } else {
                statusEl.textContent = '❌ Erreur upload !';
                console.log('Upload error:', data);
            }
        } catch(e) {
            statusEl.textContent = '❌ Erreur connexion !';
        }
    };
    reader.readAsDataURL(file);
}

async function saveProduct() {
    const name = document.getElementById('f-name').value.trim();
    const desc = document.getElementById('f-desc').value.trim();
    const details = document.getElementById('f-details').value.trim();
    const rating = document.getElementById('f-rating').value;
    const type = document.getElementById('f-type').value;
    const mediaData = document.getElementById('f-media').value;
    const mediaUrl = document.getElementById('f-media-url').value.trim();
    const media = mediaUrl || mediaData;
    const catBtn = document.querySelector('.admin-select-btn[data-cat].active');
    const targetCat = catBtn ? catBtn.dataset.cat : adminCurrentCat;
    const editIdx = document.getElementById('edit-idx').value;
    const editCat = document.getElementById('edit-cat-origin').value;

    if (!name) { adminShowToast('⚠️ Entrez un nom !'); return; }
    if (!desc) { adminShowToast('⚠️ Entrez une description !'); return; }
    if (!media) { adminShowToast('⚠️ Ajoutez une photo/vidéo !'); return; }

    // Bloquer base64 — doit être uploadé via Cloudinary d'abord
    if (media.startsWith('data:')) {
        adminShowToast('⚠️ Attendez la fin de l\'upload !');
        return;
    }

    const product = { name, description: desc, details, rating, type, media, thumbnail: media };

    if (editIdx !== '') {
        if (editCat !== targetCat) {
            productsData[editCat].splice(parseInt(editIdx), 1);
            productsData[targetCat].push(product);
        } else {
            productsData[editCat][parseInt(editIdx)] = product;
        }
    } else {
        if (!productsData[targetCat]) productsData[targetCat] = [];
        productsData[targetCat].push(product);
    }

    adminShowToast('⏳ Sauvegarde...');
    await saveProducts();

    adminCurrentCat = targetCat;
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.toggle('active', t.textContent.toLowerCase().includes(targetCat));
    });
    adminRenderProducts();
    adminRefreshStats();
    updateCategoryCounts();
    closeProductForm();
    adminShowToast('✅ Produit sauvegardé !');
}

function adminShowToast(msg) {
    const t = document.getElementById('admin-toast');
    t.textContent = msg;
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => t.style.transform = 'translateX(-50%) translateY(120px)', 3000);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    setTimeout(() => {
        const stupBtn = document.querySelector('[data-category="stup"]');
        if (stupBtn) showProducts('stup', { target: stupBtn });
    }, 100);
    tg.setHeaderColor('#0a0a0f');
    tg.setBackgroundColor('#0a0a0f');
});
