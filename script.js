// 1. قاعدة بيانات الكتب
const booksDatabase = [
  { id: 1, title: "مقدمة ابن خلدون", author: "ابن خلدون", category: "تاريخ", price: 3500, icon: "📜" },
  { id: 2, title: "العادات الذرية", author: "جيمس كلير", category: "تطوير الذات", price: 2800, icon: "🌱" },
  { id: 3, title: "ثلاثية غرناطة", author: "رضوى عاشور", category: "روايات", price: 3200, icon: "🏰" },
  { id: 4, title: "موجز تاريخ الزمن", author: "ستيفن هوكينج", category: "علوم", price: 2600, icon: "🌌" },
  { id: 5, title: "فن الحرب", author: "سون تزو", category: "تاريخ", price: 2200, icon: "⚔️" },
  { id: 6, title: "أرض زيكولا", author: "عمرو عبد الحميد", category: "روايات", price: 2400, icon: "📖" }
];

let currentCategory = 'all';
let cart = JSON.parse(localStorage.getItem('bookstoreCart')) || [];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  renderBooks(booksDatabase);
  updateCartUI();
});

// عرض الكتب
function renderBooks(booksList) {
  const container = document.getElementById('books-container');
  const countSpan = document.getElementById('books-count');
  container.innerHTML = '';
  countSpan.textContent = `${booksList.length} كتاب`;

  if (booksList.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">لم يتم العثور على نتائج.</p>';
    return;
  }

  booksList.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-cover">${book.icon}</div>
      <div>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <span class="book-category">${book.category}</span>
      </div>
      <div class="book-footer">
        <span class="book-price">${book.price} د.ج</span>
        <button class="add-btn" onclick="addToCart(${book.id})">+ السلة</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// البحث والفلترة
function handleSearchAndFilter() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  const filtered = booksDatabase.filter(book => {
    const matchesCategory = (currentCategory === 'all') || (book.category === currentCategory);
    const matchesSearch = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  renderBooks(filtered);
}

// فلترة الأقسام
function filterCategory(category, button) {
  currentCategory = category;
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  handleSearchAndFilter();
}

// إضافة وتعديل السلة
function addToCart(bookId) {
  const book = booksDatabase.find(b => b.id === bookId);
  const existing = cart.find(item => item.id === bookId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  saveCart();
  updateCartUI();
}

function changeQuantity(bookId, delta) {
  const index = cart.findIndex(item => item.id === bookId);
  if (index > -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('bookstoreCart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartList = document.getElementById('cart-items-list');
  const cartTotal = document.getElementById('cart-total');
  const badge = document.getElementById('cart-count-badge');

  cartList.innerHTML = '';
  let total = 0, totalItems = 0;

  if (cart.length === 0) {
    cartList.innerHTML = '<p style="text-align: center; color: #94a3b8;">السلة فارغة حالياً 📖</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;
      totalItems += item.quantity;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div>
          <h4>${item.title}</h4>
          <p>${item.price} د.ج × ${item.quantity}</p>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      `;
      cartList.appendChild(itemDiv);
    });
  }

  cartTotal.textContent = total;
  badge.textContent = totalItems;
}

function toggleCartModal() {
  document.getElementById('cart-modal').classList.toggle('active');
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function checkout() {
  if (cart.length === 0) return alert("السلة فارغة!");
  alert("تم استلام طلبك بنجاح! 🎉");
  clearCart();
  toggleCartModal();
}