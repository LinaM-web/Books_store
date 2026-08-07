// ==========================================================================
// Configurations & Database
// ==========================================================================

// رقم الواتساب الخاص بالمتجر
const WHATSAPP_NUMBER = "213000000000";

const booksData = [
    {
        id: 1,
        title: "فن اللامبالاة",
        author: "مارك مانسون",
        desc: "كتاب في التنمية البشرية يتناول القوة الحقيقية في قبول الحقائق الصعبة.",
        price: 1500,
        image: "images/book1.jpg"
    },
    {
        id: 2,
        title: "العادات الذرية",
        author: "جيمس كلير",
        desc: "إطار عمل موثوق لتطوير عاداتك اليومية وتحقيق نتائج شاسعة.",
        price: 1800,
        image: "images/book2.jpg"
    },
    {
        id: 3,
        title: "مائة عام من العزلة",
        author: "غابرييل غارثيا ماركيز",
        desc: "رواية عالمية تروي سيرة عائلة بوينديا عبر سبعة أجيال في قرية ماكوندو.",
        price: 2100,
        image: "images/book3.jpg"
    },
    {
        id: 4,
        title: "الأب الغني والأب الفقير",
        author: "روبرت كيوساكي",
        desc: "أهم مفاهيم الاستقلال المالي وبناء الثروة وتغيير التفكير الاستثماري.",
        price: 1650,
        image: "images/book4.jpg"
    },
    {
        id: 5,
        title: "خوارزميات البرمجة",
        author: "د. أحمد علي",
        desc: "دليل مبسط وشامل لفهم بناء الخوارزميات وهياكل البيانات للمبتدئين.",
        price: 2500,
        image: "images/book5.jpg"
    },
    {
        id: 6,
        title: "تاريخ الفكر العربي",
        author: "د. خالد السعيد",
        desc: "قراءة وتحليل مسار الفكر العربي والتطورات الثقافية والتاريخية.",
        price: 1900,
        image: "images/book6.jpg"
    }
];

let cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
const fallbackImg = "https://via.placeholder.com/230x250?text=صورة+الكتاب";

// ==========================================================================
// DOM Elements
// ==========================================================================
const booksContainer = document.getElementById('books-container');
const searchInput = document.getElementById('search-input');
const noResultsMessage = document.getElementById('no-results');

const cartIconBtn = document.getElementById('cart-icon-btn');
const cartCountBadge = document.getElementById('cart-count');
const cartModalOverlay = document.getElementById('cart-modal-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');

const checkoutBtn = document.getElementById('checkout-btn');
const orderModalOverlay = document.getElementById('order-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const checkoutForm = document.getElementById('checkout-form');
const orderSummaryList = document.getElementById('order-summary-list');
const summaryTotalPrice = document.getElementById('summary-total-price');

const hamburgerBtn = document.getElementById('hamburger-btn');
const navContent = document.getElementById('nav-content');

// ==========================================================================
// Smooth Mouse Cursor Effect Logic
// ==========================================================================
const cursorDot = document.getElementById('cursor-dot');
const cursorCircle = document.getElementById('cursor-circle');

if (window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        // Smooth lag effect for outer circle
        cursorCircle.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 400, fill: "forwards" });
    });
}

// ==========================================================================
// Core Functions
// ==========================================================================

function updateCartUI() {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="no-results">السلة فارغة حالياً.</p>';
        cartTotalPrice.textContent = '0 د.ج';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='${fallbackImg}'">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price} د.ج</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">إزالة</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    cartTotalPrice.textContent = `${total} د.ج`;
}

function renderBooks(booksToRender) {
    booksContainer.innerHTML = '';

    if (booksToRender.length === 0) {
        noResultsMessage.classList.remove('hidden');
        return;
    } else {
        noResultsMessage.classList.add('hidden');
    }

    booksToRender.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}" onerror="this.src='${fallbackImg}'">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-desc">${book.desc}</div>
                <div class="book-bottom">
                    <span class="book-price">${book.price} د.ج</span>
                    <button class="btn btn-primary" onclick="addToCart(${book.id})">أضف للسلة</button>
                </div>
            </div>
        `;
        booksContainer.appendChild(card);
    });
}

window.addToCart = function(id) {
    const book = booksData.find(b => b.id === id);
    if (!book) return;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    updateCartUI();
    toggleCartModal(true);
};

window.changeQuantity = function(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    updateCartUI();
};

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartUI();
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filtered = booksData.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    renderBooks(filtered);
});

// Toggle Center Cart Modal
function toggleCartModal(open) {
    if (open) {
        cartModalOverlay.classList.add('active');
    } else {
        cartModalOverlay.classList.remove('active');
    }
}

cartIconBtn.addEventListener('click', () => toggleCartModal(true));
closeCartBtn.addEventListener('click', () => toggleCartModal(false));
cartModalOverlay.addEventListener('click', (e) => {
    if (e.target === cartModalOverlay) toggleCartModal(false);
});

// Mobile Navbar Toggle
hamburgerBtn.addEventListener('click', () => {
    navContent.classList.toggle('active');
});

// ==========================================================================
// Order Form & WhatsApp Logic
// ==========================================================================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('سلة المشتريات فارغة!');
        return;
    }
    
    toggleCartModal(false);
    renderOrderSummary();
    orderModalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    orderModalOverlay.classList.remove('active');
});

function renderOrderSummary() {
    orderSummaryList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('div');
        row.innerHTML = `<span>${item.title} × ${item.quantity}</span> <span>${itemTotal} د.ج</span>`;
        orderSummaryList.appendChild(row);
    });

    summaryTotalPrice.textContent = `${total} د.ج`;
}

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const location = document.getElementById('location').value.trim();
    const pickupOption = document.querySelector('input[name="pickup-location"]:checked').value;

    if (!fullName || !phone || !location || !pickupOption) {
        alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.');
        return;
    }

    let message = `طلبية جديدة 📚\n\n`;
    message += `👤 *الاسم:* ${fullName}\n`;
    message += `📞 *رقم الهاتف:* ${phone}\n`;
    message += `📍 *الموقع:* ${location}\n`;
    message += `🏠 *مكان الاستلام:* ${pickupOption}\n\n`;
    message += `📖 *الكتب المطلوبة:*\n`;

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `- ${item.title} × ${item.quantity} (${itemTotal} د.ج)\n`;
    });

    message += `\n💰 *السعر الإجمالي:* ${total} د.ج`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    cart = [];
    updateCartUI();
    orderModalOverlay.classList.remove('active');
    checkoutForm.reset();

    window.open(whatsappURL, '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData);
    updateCartUI();
});