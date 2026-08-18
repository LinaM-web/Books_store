/* ==========================================
   1. بيانات الكتب
   ========================================== */
const allBooks = [
  { id: 1, title: " رسائل من القران ", author: " ادهم شرقاوي ", price: 1000, category: "دينية", image: "images/b1.jpg" },
  { id: 2, title: " رسائل من النبي ", author:" ادهم شرقاوي ", price: 1000, category: "دينية", image: "images/b2.jpg" },
  { id: 3, title: "رسائل من الصحابة ", author:" ادهم شرقاوي ", price: 1000, category: "دينية", image: "images/b3.jpg" },
  { id: 4, title: " لانها كيارا ", author: " سما سامي " , price: 1000, category: "فانتازيا", image: "images/b4.jpg" },
  { id: 5, title: " مملكة الكوابيس و الضباب ", author: " سما سامي " , price: 1000, category: "فانتازيا", image: "images/b5.jpg" },
  { id: 6, title: " العرش الاسود ", author: " سما سامي " , price: 1000, category: "فانتازيا", image: "images/b6.jpg" },
  { id: 7, title: "قضية ست الحسن", author: " ميرنا المهدي ", price: 1000, category: "بوليسية", image: "images/b7.jpg" },
  { id: 8, title: "قضية لوز مر", author: " ميرنا المهدي ", price: 1000, category: "بوليسية", image: "images/b8.jpg" },
  { id: 9, title: "قضية عنب الثعلب", author: " ميرنا المهدي ", price: 1000, category: "بوليسية", image: "images/b9.jpg" },
];

let cart = [];

/* ==========================================
   2. إدارة عرض الكتب والبحث والفلترة
   ========================================== */

// عرض الكتب داخل الشبكة
function renderBooks(booksList) {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (booksList.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">لا توجد نتائج تطابق بحثك.</p>';
    return;
  }

  booksList.forEach(book => {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p class="author">${book.author}</p>
      <span class="price">${book.price.toLocaleString()} د.ج</span>
      <button class="add-btn" onclick="addToCart(${book.id})">🛒 إضافة للسلة</button>
    `;
    grid.appendChild(card);
  });
}

// البحث المباشر
function liveSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const filter = input.value.toLowerCase().trim();
  const filtered = allBooks.filter(book => 
    book.title.toLowerCase().includes(filter) || 
    book.author.toLowerCase().includes(filter)
  );

  renderBooks(filtered);
}

// التصفية حسب التصنيف
function filterBooks(categoryName, btnElement) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const allFilterBtns = document.querySelectorAll('.filter-btn');
  allFilterBtns.forEach(btn => btn.classList.remove('active'));
  
  if (btnElement) btnElement.classList.add('active');

  if (categoryName === 'الكل') {
    renderBooks(allBooks);
  } else {
    const filteredList = allBooks.filter(book => book.category === categoryName);
    renderBooks(filteredList);
  }
}

/* ==========================================
   3. إدارة السلة وتخزين البيانات (LocalStorage)
   ========================================== */

function saveCartToStorage() {
  localStorage.setItem('userCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('userCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// فتح وإغلاق السلة
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');

  if (drawer) drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');

  // إرجاع واجهة السلة للوضع الافتراضي عند الإغلاق
  if (drawer && !drawer.classList.contains('open')) {
    setTimeout(showCartView, 200);
  }
}

// إضافة كتاب
function addToCart(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  const existing = cart.find(item => item.id === bookId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  saveCartToStorage();
  updateCartUI();
  
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

// تعديل الكمية
function changeQuantity(bookId, change) {
  const item = cart.find(b => b.id === bookId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(bookId);
  } else {
    saveCartToStorage();
    updateCartUI();
  }
}

// حذف عنصر
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  saveCartToStorage();
  updateCartUI();
}

// تفريغ السلة
function clearCart() {
  if (cart.length === 0) return;
  if (confirm("هل أنت متأكد من تفريغ جميع العناصر من السلة؟")) {
    cart = [];
    localStorage.removeItem('userCart');
    updateCartUI();
  }
}

// تحديث الواجهة والعدادات
function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const countEl = document.querySelector('.cart-count');
  const totalEl = document.getElementById('cartTotalPrice');

  if (!container) return;

  container.innerHTML = '';
  let totalCount = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888; padding:30px 0;">السلة فارغة حالياً 🛒</p>';
  } else {
    cart.forEach(item => {
      totalCount += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <span class="price">${(item.price * item.quantity).toLocaleString()} د.ج</span>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="delete-item-btn" onclick="removeFromCart(${item.id})">🗑️</button>
      `;
      container.appendChild(itemEl);
    });
  }

  if (countEl) countEl.textContent = totalCount;
  if (totalEl) totalEl.textContent = `${totalPrice.toLocaleString()} د.ج`;
}

/* ==========================================
   4. التنقل المباشر داخل الحاوية وإرسال الطلب
   ========================================== */

// التحويل لاستمارة البيانات والملخص
function showCheckoutForm() {
  if (cart.length === 0) {
    alert("السلة فارغة! أضفي بعض الكتب أولاً.");
    return;
  }

  const mainBody = document.getElementById('cartMainBody');
  const checkoutBody = document.getElementById('checkoutBody');
  const title = document.getElementById('cartHeaderTitle');

  if (mainBody) mainBody.style.display = 'none';
  if (checkoutBody) checkoutBody.style.display = 'block';
  if (title) title.textContent = 'إتمام الطلب 📝';

  renderOrderSummary();
}

// العودة لعرض الكتب في السلة
function showCartView() {
  const mainBody = document.getElementById('cartMainBody');
  const checkoutBody = document.getElementById('checkoutBody');
  const title = document.getElementById('cartHeaderTitle');

  if (checkoutBody) checkoutBody.style.display = 'none';
  if (mainBody) mainBody.style.display = 'block';
  if (title) title.textContent = 'سلة التسوق 🛒';
}

// بناء ملخص الطلب المصغر
function renderOrderSummary() {
  const listContainer = document.getElementById('summaryItemsList');
  const totalEl = document.getElementById('summaryTotalPrice');
  
  if (!listContainer || !totalEl) return;

  listContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const row = document.createElement('div');
    row.className = 'summary-item-row';
    row.style.cssText = "display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px; color: #444;";
    row.innerHTML = `
      <span>• ${item.title} (x${item.quantity})</span>
      <span>${itemTotal.toLocaleString()} د.ج</span>
    `;
    listContainer.appendChild(row);
  });

  totalEl.textContent = `${totalPrice.toLocaleString()} د.ج`;
}

// صياغة وإرسال الطلب عبر الواتساب
function sendToWhatsApp(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  let booksListText = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    booksListText += `${index + 1}. *${item.title}* (الكمية: ${item.quantity}) - ${itemTotal.toLocaleString()} د.ج\n`;
  });

  const message = `*طلب جديد من المتجر* 📚\n\n` +
                  `*معلومات الزبون:*\n` +
                  `👤 *الاسم:* ${name}\n` +
                  `📞 *الهاتف:* ${phone}\n` +
                  `📍 *العنوان:* ${address}\n\n` +
                  `*الكتب المطلوبة:*\n${booksListText}\n` +
                  `💰 *المجموع الكلي:* ${totalPrice.toLocaleString()} د.ج`;

  const phoneNumber = "213600000000"; // ضعي رقمكِ هنا
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');

  // تفريغ وتصفير وإغلاق
  cart = [];
  localStorage.removeItem('userCart');
  updateCartUI();
  toggleCart();
}

/* ==========================================
   5. التهيئة عند تحميل الصفحة
   ========================================== */
window.onload = function() {
  renderBooks(allBooks);
  loadCartFromStorage();
  updateCartUI();
};