// Mot de passe admin (CHANGEZ-LE !)
const ADMIN_PASSWORD = 'professeur2026';

let currentCategory = 'stup';
let productsData = {
    stup: [],
    tabac: [],
    puff: []
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('products_data');
    if (saved) {
        productsData = JSON.parse(saved);
    } else {
        // Données par défaut si vide
        productsData = {
            stup: [],
            tabac: [],
            puff: []
        };
    }
    updateStats();
    renderProducts();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('products_data', JSON.stringify(productsData));
    updateStats();
}

// Login
function login() {
    const password = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('error-msg');
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadData();
        showToast('✅ Connexion réussie !');
    } else {
        errorMsg.textContent = '❌ Mot de passe incorrect !';
        document.getElementById('admin-password').value = '';
    }
}

// Logout
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('admin-password').value = '';
        document.getElementById('error-msg').textContent = '';
    }
}

// Update stats
function updateStats() {
    document.getElementById('stup-count').textContent = productsData.stup.length;
    document.getElementById('tabac-count').textContent = productsData.tabac.length;
    document.getElementById('puff-count').textContent = productsData.puff.length;
    
    const total = productsData.stup.length + productsData.tabac.length + productsData.puff.length;
    document.getElementById('total-count').textContent = total;
}

// Switch category
function switchCategory(category) {
    currentCategory = category;
    
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderProducts();
}

// Render products
function renderProducts() {
    const container = document.getElementById('products-list');
    const products = productsData[currentCategory];
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:60px; color: rgba(255,255,255,0.5);">Aucun produit dans cette catégorie</p>';
        return;
    }
    
    container.innerHTML = products.map((product, index) => `
        <div class="product-admin-card">
            <div class="product-admin-preview">
                ${product.type === 'video' ? 
                    `<video muted loop autoplay><source src="${product.media}" type="video/mp4"></video>` :
                    `<img src="${product.media}" alt="${product.name}">`
                }
            </div>
            <div class="product-admin-info">
                <div class="product-admin-name">${product.name}</div>
                <div class="product-admin-desc">${product.description}</div>
                <div class="product-admin-rating">${product.rating}</div>
                <div class="product-admin-actions">
                    <button class="btn-edit" onclick="editProduct('${currentCategory}', ${index})">✏️ Modifier</button>
                    <button class="btn-delete" onclick="deleteProduct('${currentCategory}', ${index})">🗑️ Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open add modal
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Ajouter un produit';
    document.getElementById('product-form').reset();
    document.getElementById('edit-category').value = '';
    document.getElementById('edit-index').value = '';
    document.getElementById('product-category').value = currentCategory;
    document.getElementById('product-modal').classList.add('show');
}

// Edit product
function editProduct(category, index) {
    const product = productsData[category][index];
    
    document.getElementById('modal-title').textContent = 'Modifier le produit';
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-index').value = index;
    
    document.getElementById('product-category').value = category;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-rating').value = product.rating;
    document.getElementById('product-details').value = product.details;
    document.getElementById('product-type').value = product.type;
    document.getElementById('product-media').value = product.media;
    
    toggleMediaInput();
    
    document.getElementById('product-modal').classList.add('show');
}

// Delete product
function deleteProduct(category, index) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
        productsData[category].splice(index, 1);
        saveData();
        renderProducts();
        showToast('🗑️ Produit supprimé !');
    }
}

// Toggle media input label
function toggleMediaInput() {
    const type = document.getElementById('product-type').value;
    const label = document.getElementById('media-label');
    const input = document.getElementById('product-media');
    
    if (type === 'video') {
        label.textContent = '🎥 URL de la vidéo';
        input.placeholder = 'Ex: videos/stup1.mp4';
    } else {
        label.textContent = '🖼️ URL de l\'image';
        input.placeholder = 'Ex: images/puff1.jpg';
    }
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').classList.remove('show');
}

// Save product (form submit)
document.getElementById('product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editCategory = document.getElementById('edit-category').value;
    const editIndex = document.getElementById('edit-index').value;
    
    const product = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        rating: document.getElementById('product-rating').value,
        details: document.getElementById('product-details').value,
        type: document.getElementById('product-type').value,
        media: document.getElementById('product-media').value,
        thumbnail: document.getElementById('product-media').value
    };
    
    const targetCategory = document.getElementById('product-category').value;
    
    if (editCategory && editIndex !== '') {
        // Edit existing
        if (editCategory !== targetCategory) {
            // Category changed
            productsData[editCategory].splice(editIndex, 1);
            productsData[targetCategory].push(product);
        } else {
            productsData[editCategory][editIndex] = product;
        }
        showToast('✅ Produit modifié !');
    } else {
        // Add new
        productsData[targetCategory].push(product);
        showToast('✅ Produit ajouté !');
    }
    
    saveData();
    
    if (targetCategory !== currentCategory) {
        currentCategory = targetCategory;
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-btn')[
            targetCategory === 'stup' ? 0 : targetCategory === 'tabac' ? 1 : 2
        ].classList.add('active');
    }
    
    renderProducts();
    closeModal();
});

// Export data
function exportData() {
    const dataStr = JSON.stringify(productsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products_backup_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    showToast('📥 Données exportées !');
}

// Import data
function importData() {
    document.getElementById('import-modal').classList.add('show');
}

function closeImportModal() {
    document.getElementById('import-modal').classList.remove('show');
    document.getElementById('import-data').value = '';
}

function processImport() {
    try {
        const data = JSON.parse(document.getElementById('import-data').value);
        
        if (data.stup && data.tabac && data.puff) {
            if (confirm('Voulez-vous remplacer toutes les données actuelles ?')) {
                productsData = data;
                saveData();
                renderProducts();
                closeImportModal();
                showToast('✅ Données importées !');
            }
        } else {
            alert('❌ Format JSON invalide !');
        }
    } catch (e) {
        alert('❌ Erreur : ' + e.message);
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Enter key login
document.getElementById('admin-password')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});

// Initialize
loadData();
