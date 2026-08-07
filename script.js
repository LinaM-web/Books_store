const products = [
            {
                id: 1,
                title: "مقدمة ابن خلدون",
                author: "ابن خلدون",
                category: "تاريخ",
                price: 3500,
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
            },
            {
                id: 2,
                title: "العادات الذرية",
                author: "جيمس كلير",
                category: "تطوير الذات",
                price: 2800,
                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
            },
            {
                id: 3,
                title: "ثلاثية غرناطة",
                author: "رضوى عاشور",
                category: "روايات",
                price: 3200,
                image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80"
            },
            {
                id: 4,
                title: "موجز تاريخ الزمن",
                author: "ستيفن هوكينج",
                category: "علوم",
                price: 2600,
                image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80"
            }
        ];

        let cart = [];
        let currentCategory = 'all';

        function renderProducts(list = products) {
            const grid = document.getElementById('productsGrid');
            document.getElementById('productCount').innerText = `عرض ${list.length} كتب`;
            
            if (list.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد نتائج مطابقة للبحث.</p>';
                return;
            }

            grid.innerHTML = list.map(item => `
                <div class="product-card">
                    <div class="product-img-wrap">
                        <img src="${item.image}" alt="${item.title}">
                        <span class="product-badge">${item.category}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${item.title}</h3>
                        <p class="product-author">${item.author}</p>
                        <div class="product-footer">
                            <span class="product-price">${item.price.toLocaleString()} د.ج</span>
                            <button class="add-cart-btn" onclick="addToCart(${item.id})">
                                <i class="fa-solid fa-cart-plus"></i> أضف
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function toggleDropdown() {
            document.getElementById('categoryDropdown').classList.toggle('active');
        }

        window.addEventListener('click', function(e) {
            const dropdown = document.getElementById('categoryDropdown');
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        function filterCategory(category) {
            currentCategory = category;
            document.getElementById('categoryDropdown').classList.remove('active');
            
            const titleEl = document.getElementById('currentCategoryTitle');
            if (category === 'all') {
                titleEl.innerHTML = '<i class="fa-solid fa-book"></i> جميع الكتب المتاحة';
                renderProducts(products);
            } else {
                titleEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> قسم: ${category}`;
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        }

        function searchProducts() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const filtered = products.filter(p => {
                const matchesCat = currentCategory === 'all' || p.category === currentCategory;
                const matchesQuery = p.title.toLowerCase().includes(query) || p.author.toLowerCase().includes(query);
                return matchesCat && matchesQuery;
            });
            renderProducts(filtered);
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.qty++;
            } else {
                cart.push({ ...product, qty: 1 });
            }

            updateCartUI();
        }

        function changeQty(productId, delta) {
            const item = cart.find(p => p.id === productId);
            if (!item) return;

            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(p => p.id !== productId);
            }
            updateCartUI();
        }

        function removeFromCart(productId) {
            cart = cart.filter(p => p.id !== productId);
            updateCartUI();
        }

        function clearCart() {
            cart = [];
            updateCartUI();
        }

        function updateCartUI() {
            const listEl = document.getElementById('cartItemsList');
            const totalEl = document.getElementById('cartTotal');
            const badgeEl = document.getElementById('cartBadge');

            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            badgeEl.innerText = totalItems;
            totalEl.innerText = `${totalPrice.toLocaleString()} د.ج`;

            if (cart.length === 0) {
                listEl.innerHTML = '<div class="empty-cart-msg">السلة فارغة حالياً</div>';
                return;
            }

            listEl.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} د.ج</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                            <span style="font-size:0.85rem; font-weight:bold;">${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <i class="fa-solid fa-trash-can cart-item-remove" onclick="removeFromCart(${item.id})"></i>
                </div>
            `).join('');
        }

        function scrollToCart() {
            document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth' });
        }

        function openCheckoutModal() {
            if (cart.length === 0) {
                alert('سلة التسوق فارغة! الرجاء إضافة بعض الكتب أولاً.');
                return;
            }
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            document.getElementById('modalTotalPrice').innerText = `${totalPrice.toLocaleString()} د.ج`;
            document.getElementById('checkoutModal').classList.add('active');
        }

        function closeCheckoutModal() {
            document.getElementById('checkoutModal').classList.remove('active');
        }

        function handleSendOrder(e) {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const delivery = document.querySelector('input[name="deliveryType"]:checked').value;
            const wilaya = document.getElementById('clientWilaya').value.trim();
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            let itemsSummary = cart.map(item => `• ${item.title} (العدد: ${item.qty}) - ${(item.price * item.qty).toLocaleString()} د.ج`).join('\n');

            const message = `*طلب جديد من متجر أوراق و كتب* 📚\n\n` +
                            `*معلومات الزبون:*\n` +
                            `👤 *الاسم:* ${name}\n` +
                            `📞 *رقم الهاتف:* ${phone}\n` +
                            `🚚 *نوع الاستلام:* ${delivery}\n` +
                            `📍 *العنوان:* ${wilaya}\n\n` +
                            `*الطلبية:*\n${itemsSummary}\n\n` +
                            `💰 *السعر الإجمالي:* ${totalPrice.toLocaleString()} د.ج`;

            // غيري الرقم هنا إلى رقم الواتساب الخاص بالمتجر (مع رمز الدولة بدون +)
            const storeWhatsAppNumber = "213600000000"; 
            const encodedMsg = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodedMsg}`;

            window.open(whatsappUrl, '_blank');

            closeCheckoutModal();
            clearCart();
        }

        renderProducts();