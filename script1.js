/* ==========================================
   1. بيانات الكتب
   ========================================== */
const allBooks = [
  { id: 1, title: " التغليف المجاني ", price: 1000, image: "images/رسائل قران.jpg" },
  { id: 2, title: " التغليف الاسطوري ", price: 1450,  image: "images/مملكة المرعبين.jpg" }



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
      <span class="price">${book.price.toLocaleString()} د.ج</span>
      <button class="add-btn" onclick="addToCart(${book.id})">🛒 إضافة للسلة</button>
    `;
    grid.appendChild(card);
  });
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

loadCartFromStorage();

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


// حذف عنصر
function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  saveCartToStorage();
  updateCartUI();
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

    try {
        // جلب البيانات مع التأكد من وجود العناصر لمنع توقف الكود
        const nameField = document.getElementById('custName');
        const phoneField = document.getElementById('custPhone');
        const placeField = document.getElementById('custplace');
        const deliveryField = document.getElementById('deliveryType');
        const addressField = document.getElementById('custAddress');
        const notesField = document.getElementById('custNotes');

        const name = nameField ? nameField.value.trim() : '';
        const phone = phoneField ? phoneField.value.trim() : '';
        const place = placeField ? placeField.value.trim() : '';
        const deliveryType = deliveryField ? deliveryField.value.trim() : 'غير محدد';
        const addressInput = addressField ? addressField.value.trim() : '';
        const notes = notesField ? notesField.value.trim() : '';

        // معالجة عنوان التوصيل
        let finalAddress = addressInput ? addressInput : "استلام من المكتب";
        if (deliveryType === "المنزل" && addressInput) {
            finalAddress = addressInput;
        }

        let booksListText = "";
        let totalPrice = 0;

        // التحقق من أن السلة معرفة وتحتوي على منتجات
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.forEach((item, index) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                totalPrice += itemTotal;
                booksListText += `${index + 1}. *${item.title || 'منتج'}* (الكمية: ${item.quantity || 1}) - ${itemTotal.toLocaleString()} د.ج\n`;
            });
        }

        // بناء نص الرسالة
        let message = `🛍️ *طلب جديد من المتجر* 🛍️\n\n`;
        message += `👤 *معلومات الزبون:*\n`;
        message += `▪️ *الاسم:* ${name}\n`;
        message += `📞 *الهاتف:* ${phone}\n`;
        message += `📍 *الولاية:* ${place}\n`;
        message += `🚚 *طريقة التوصيل:* ${deliveryType}\n`;
        message += `🏠 *العنوان:* ${finalAddress}\n`;
        message += `📝 *ملاحظات:* ${notes ? notes : "لا توجد ملاحظات"}\n\n`;
        message += `📚 *الكتب المطلوبة:*\n${booksListText}\n`;
        message += `💰 *المجموع الكلي:* *${totalPrice.toLocaleString()} د.ج*`;

        const phoneNumber = "213780243603"; // رقم الواتساب الخاص بك
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // فتح رابط الواتساب في تبويب جديد
        window.open(whatsappURL, '_blank');

    } catch (error) {
        console.error("حدث خطأ أثناء إرسال الطلب:", error);
        alert("عذراً، حدث خطأ أثناء إرسال الطلب. يرجى التأكد من تعبئة جميع الحقول المطلوبة.");
    }


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









/*  اظهار خانةالعنوان عند اختيار المنزل */


function toggleAddressField() {
    const deliveryType = document.getElementById('deliveryType').value;
    const addressGroup = document.getElementById('addressGroup');
    const addressInput = document.getElementById('custAddress');

    if (deliveryType === 'المنزل') {
        addressGroup.style.display = 'block'; // إظهار خانة العنوان
        addressInput.setAttribute('required', 'true'); // جعل العنوان إجباري
    } else {
        addressGroup.style.display = 'none'; // إخفاء خانة العنوان
        addressInput.removeAttribute('required'); // إلغاء الإجبار
        addressInput.value = ''; // تفريغ الحقل عند إخفائه
    }
}