/**
 * Main JavaScript File for E-commerce Frontend
 * Handles mock functionality for Cart, Auth, Search, and Filters using localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. GLOBAL LAYOUT & MENU
    // =========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navDesktop = document.querySelector('.nav-desktop');
    
    if (mobileMenuBtn && navDesktop) {
        mobileMenuBtn.addEventListener('click', () => {
            const isDisplayed = window.getComputedStyle(navDesktop).display !== 'none';
            if (isDisplayed && window.innerWidth <= 768) {
                navDesktop.style.display = 'none';
            } else {
                navDesktop.style.display = 'flex';
                navDesktop.style.flexDirection = 'column';
                navDesktop.style.position = 'absolute';
                navDesktop.style.top = '100%';
                navDesktop.style.left = '0';
                navDesktop.style.width = '100%';
                navDesktop.style.backgroundColor = 'var(--color-white)';
                navDesktop.style.padding = 'var(--spacing-md)';
                navDesktop.style.boxShadow = 'var(--shadow-md)';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navDesktop.style.display = 'flex';
                navDesktop.style.flexDirection = 'row';
                navDesktop.style.position = 'static';
                navDesktop.style.padding = '0';
                navDesktop.style.boxShadow = 'none';
            } else {
                navDesktop.style.display = 'none';
            }
        });
    }

    // =========================================
    // 2. SEARCH FUNCTIONALITY
    // =========================================
    const searchBtns = document.querySelectorAll('a[title="Search"]');
    searchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const query = prompt("Enter search term (e.g. 'Shirt', 'Denim'):");
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    });

    // =========================================
    // 3. AUTHENTICATION LOGIC (MOCK)
    // =========================================
    const userStr = localStorage.getItem('aura_user');
    let user = userStr ? JSON.parse(userStr) : null;

    // Register Page
    const registerForm = document.querySelector('form[action="profile.html"]');
    if (registerForm && window.location.pathname.includes('register.html')) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = registerForm.querySelectorAll('input');
            const firstName = inputs[0].value;
            const lastName = inputs[1].value;
            const email = inputs[2].value;
            
            user = { firstName, lastName, email };
            localStorage.setItem('aura_user', JSON.stringify(user));
            alert("Account created successfully!");
            window.location.href = 'profile.html';
        });
    }

    // Login Page
    const loginForm = document.querySelector('form[action="profile.html"]');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            if (user && user.email === email) {
                alert("Welcome back!");
                window.location.href = 'profile.html';
            } else {
                alert("Login successful (Mocking login for demo).");
                if (!user) {
                    user = { firstName: "Demo", lastName: "User", email: email };
                    localStorage.setItem('aura_user', JSON.stringify(user));
                }
                window.location.href = 'profile.html';
            }
        });
    }

    // Profile Page
    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('orders.html')) {
        const profileForm = document.querySelector('.account-content form');
        if (profileForm && user) {
            const inputs = profileForm.querySelectorAll('input');
            if (inputs.length >= 3) {
                inputs[0].value = user.firstName || "";
                inputs[1].value = user.lastName || "";
                inputs[2].value = user.email || "";
            }
            
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                user.firstName = inputs[0].value;
                user.lastName = inputs[1].value;
                user.email = inputs[2].value;
                localStorage.setItem('aura_user', JSON.stringify(user));
                alert("Profile updated successfully!");
            });
        }
        
        // Sign Out Logic
        const signOutLink = document.querySelector('.account-sidebar a[href*="login.html"]');
        if (signOutLink) {
            signOutLink.addEventListener('click', (e) => {
                localStorage.removeItem('aura_user');
                // Allow default navigation to login.html
            });
        }
    }

    // =========================================
    // 4. CART LOGIC
    // =========================================
    let cart = JSON.parse(localStorage.getItem('aura_cart') || '[]');

    function updateCartCount() {
        // Just visual feedback if needed, currently no badge on icon, but we can add one
        const cartIcons = document.querySelectorAll('a[title="Cart"]');
        cartIcons.forEach(icon => {
            let badge = icon.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = 'position: absolute; top: -5px; right: -5px; background: var(--color-error); color: white; border-radius: 50%; font-size: 10px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;';
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'flex' : 'none';
        });
    }
    updateCartCount();

    // Add to Cart
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product info from DOM
            let card = btn.closest('.product-card');
            let isDetailPage = false;
            if (!card) {
                // Must be product detail page
                card = document.querySelector('.product-info-section');
                isDetailPage = true;
            }
            
            if (card) {
                let name = isDetailPage ? card.querySelector('.product-title').textContent : card.querySelector('.product-name').textContent;
                let priceStr = isDetailPage ? card.querySelector('.product-price-large').textContent : card.querySelector('.product-price').textContent;
                let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
                
                let img = '';
                if (isDetailPage) {
                    img = document.querySelector('.gallery-main img').src;
                } else {
                    img = card.querySelector('.product-img').src;
                }

                // If on detail page, check for quantity selector
                let qtyToAdd = 1;
                if (isDetailPage) {
                    const qtyInput = card.querySelector('.qty-input');
                    if (qtyInput) {
                        qtyToAdd = parseInt(qtyInput.value) || 1;
                    }
                }

                // Check if already in cart
                let existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.qty += qtyToAdd;
                } else {
                    cart.push({ name, price, img, qty: qtyToAdd });
                }
                
                localStorage.setItem('aura_cart', JSON.stringify(cart));
                updateCartCount();

                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = 'Added to Cart!';
                btn.style.backgroundColor = 'var(--color-success)';
                btn.style.borderColor = 'var(--color-success)';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 1500);
            }
        });
    });

    // Render Cart Page
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
    
    // Render Checkout Page Summary
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
    }

    function renderCartPage() {
        const cartSection = document.querySelector('.cart-items-section');
        const summaryTotal = document.querySelector('.summary-total span:last-child');
        const subtotalEl = document.querySelector('.summary-row:first-child span:last-child');
        
        if (!cartSection) return;

        // Keep the header and back button
        const headerHTML = `
            <div class="cart-table-header">
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
            </div>`;
        const backBtnHTML = `
            <div class="mt-lg">
                <a href="products.html" class="btn btn-secondary"><i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i> Continue Shopping</a>
            </div>`;

        let itemsHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            itemsHTML = '<p class="my-lg">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const total = item.price * item.qty;
                subtotal += total;
                itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-product" data-label="Product">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4><a href="product-detail.html">${item.name}</a></h4>
                            <p>Color: Standard</p>
                            <a href="#" class="text-sm mt-sm remove-item-btn" data-index="${index}" style="display: inline-block; color: var(--color-error); text-decoration: underline;">Remove</a>
                        </div>
                    </div>
                    <div data-label="Price">$${item.price.toFixed(2)}</div>
                    <div data-label="Quantity">
                        <div class="quantity-selector" style="transform: scale(0.85); transform-origin: left center;">
                            <button class="qty-btn dec-qty" data-index="${index}">-</button>
                            <input type="text" value="${item.qty}" class="qty-input" readonly>
                            <button class="qty-btn inc-qty" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div data-label="Total" class="font-weight-600">$${total.toFixed(2)}</div>
                </div>`;
            });
        }

        cartSection.innerHTML = headerHTML + itemsHTML + backBtnHTML;
        
        const tax = subtotal > 0 ? 12.00 : 0;
        const totalAmount = subtotal + tax;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (summaryTotal) summaryTotal.textContent = `$${totalAmount.toFixed(2)}`;
        
        const cartSubtitle = document.querySelector('main > p.text-muted');
        if (cartSubtitle) {
            cartSubtitle.textContent = `You have ${cart.reduce((sum, item) => sum + item.qty, 0)} items in your cart.`;
        }

        // Attach event listeners to new buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                localStorage.setItem('aura_cart', JSON.stringify(cart));
                renderCartPage();
                updateCartCount();
            });
        });

        document.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-index'));
                cart[idx].qty += 1;
                localStorage.setItem('aura_cart', JSON.stringify(cart));
                renderCartPage();
                updateCartCount();
            });
        });

        document.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-index'));
                if (cart[idx].qty > 1) {
                    cart[idx].qty -= 1;
                    localStorage.setItem('aura_cart', JSON.stringify(cart));
                    renderCartPage();
                    updateCartCount();
                }
            });
        });
    }
    
    function renderCheckoutSummary() {
        const summaryContainer = document.querySelector('aside.cart-summary');
        if (!summaryContainer) return;
        
        let itemsHTML = '<h3 class="text-xl mb-md">Order Summary</h3><div style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-md); margin-bottom: var(--spacing-md);">';
        let subtotal = 0;
        
        cart.forEach((item) => {
            subtotal += (item.price * item.qty);
            itemsHTML += `
            <div class="flex gap-sm mb-sm items-center">
                <div style="position: relative;">
                    <img src="${item.img}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 4px;">
                    <span style="position: absolute; top: -8px; right: -8px; background: var(--color-text-muted); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">${item.qty}</span>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-size: 0.875rem;">${item.name}</h4>
                    <p class="text-xs text-muted">Standard</p>
                </div>
                <div class="font-weight-500 text-sm">$${(item.price * item.qty).toFixed(2)}</div>
            </div>`;
        });
        
        itemsHTML += `</div>`;
        const tax = subtotal > 0 ? 12.00 : 0;
        const totalAmount = subtotal + tax;
        
        itemsHTML += `
        <div class="summary-row">
            <span class="text-muted">Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-row">
            <span class="text-muted">Tax</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
            <span>Total</span>
            <span>$${totalAmount.toFixed(2)}</span>
        </div>`;
        
        summaryContainer.innerHTML = itemsHTML;
        
        const payBtn = document.querySelector('button[type="submit"]');
        if (payBtn) payBtn.textContent = `Pay $${totalAmount.toFixed(2)}`;
        
        const checkoutForm = document.querySelector('.checkout-layout form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', () => {
                // Clear cart on successful order
                localStorage.setItem('aura_cart', '[]');
            });
        }
    }

    // =========================================
    // 5. FILTER & SEARCH LOGIC (Products Page)
    // =========================================
    if (window.location.pathname.includes('products.html')) {
        const productCards = document.querySelectorAll('.product-grid .product-card');
        
        // Handle Search Query Param
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            const heading = document.querySelector('.products-header h1');
            if (heading) heading.textContent = `Search: "${searchQuery}"`;
            
            filterCards(searchQuery.toLowerCase(), []);
        }

        // Handle Checkbox Filters
        const checkboxes = document.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const checkedBrands = Array.from(document.querySelectorAll('.filter-group:nth-child(2) input:checked'))
                    .map(input => input.parentNode.textContent.trim().toLowerCase());
                
                filterCards(searchQuery ? searchQuery.toLowerCase() : "", checkedBrands);
            });
        });

        function filterCards(query, brands) {
            let visibleCount = 0;
            productCards.forEach(card => {
                const name = card.querySelector('.product-name').textContent.toLowerCase();
                const brand = card.querySelector('.product-brand').textContent.toLowerCase();
                
                let matchesSearch = !query || name.includes(query) || brand.includes(query);
                let matchesBrand = brands.length === 0 || brands.includes(brand);

                if (matchesSearch && matchesBrand) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const countText = document.querySelector('.products-header p.text-muted');
            if (countText) {
                countText.textContent = `Showing ${visibleCount} products`;
            }
        }

        // Handle Sorting
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                const grid = document.querySelector('.product-grid');
                const cardsArray = Array.from(productCards);
                
                cardsArray.sort((a, b) => {
                    const priceAStr = a.querySelector('.product-price').textContent;
                    const priceBStr = b.querySelector('.product-price').textContent;
                    const priceA = parseFloat(priceAStr.replace(/[^0-9.]/g, ''));
                    const priceB = parseFloat(priceBStr.replace(/[^0-9.]/g, ''));
                    const nameA = a.querySelector('.product-name').textContent;
                    const nameB = b.querySelector('.product-name').textContent;

                    if (val === 'price-low') {
                        return priceA - priceB;
                    } else if (val === 'price-high') {
                        return priceB - priceA;
                    } else if (val === 'newest') {
                        // Dummy sort based on new badge presence
                        const newA = a.querySelector('.product-badge') && a.querySelector('.product-badge').textContent === 'New' ? 1 : 0;
                        const newB = b.querySelector('.product-badge') && b.querySelector('.product-badge').textContent === 'New' ? 1 : 0;
                        return newB - newA;
                    } else {
                        return nameA.localeCompare(nameB);
                    }
                });

                grid.innerHTML = '';
                cardsArray.forEach(card => grid.appendChild(card));
            });
        }
    }

    // =========================================
    // 6. PRODUCT DETAIL SPECIFICS
    // =========================================
    if (window.location.pathname.includes('product-detail.html')) {
        // Qty Selector
        const qtyInput = document.querySelector('.qty-input');
        const decBtn = document.querySelector('.qty-btn:first-child');
        const incBtn = document.querySelector('.qty-btn:last-child');
        
        if (qtyInput && decBtn && incBtn) {
            decBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value) || 1;
                if (val > 1) qtyInput.value = val - 1;
            });
            incBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value) || 1;
                qtyInput.value = val + 1;
            });
        }

        // Color and Size Selection
        const colorOpts = document.querySelectorAll('div.flex.gap-sm > div[style*="border-radius: 50%"]');
        colorOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                colorOpts.forEach(o => {
                    o.style.borderColor = 'var(--color-border)';
                    o.style.borderWidth = '1px';
                });
                opt.style.borderColor = 'var(--color-black)';
                opt.style.borderWidth = '2px';
            });
        });

        const sizeOpts = document.querySelectorAll('div.flex.gap-sm.flex-wrap > span:not([style*="not-allowed"])');
        sizeOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                sizeOpts.forEach(o => {
                    o.style.backgroundColor = '';
                    o.style.color = '';
                    o.style.borderColor = 'var(--color-border)';
                });
                opt.style.backgroundColor = 'var(--color-black)';
                opt.style.color = 'white';
                opt.style.borderColor = 'var(--color-black)';
            });
        });
    }

    // Wishlist basic toggle
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.style.color = 'var(--color-error)'; 
                btn.querySelector('i').classList.remove('fa-regular');
                btn.querySelector('i').classList.add('fa-solid');
            } else {
                btn.style.color = ''; 
                btn.querySelector('i').classList.add('fa-regular');
                btn.querySelector('i').classList.remove('fa-solid');
            }
        });
    });
});
