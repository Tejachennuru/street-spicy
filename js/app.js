document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        menuItems: window.appFoodData || [],
        cart: [],
        filter: {
            search: '',
            category: 'all',
            vegOnly: false
        }
    };

    // DOM Elements
    const foodGrid = document.getElementById('food-grid');
    const categoryFilters = document.getElementById('category-filters');
    const noResults = document.getElementById('no-results');
    const desktopSearch = document.getElementById('desktop-search');
    const mobileSearch = document.getElementById('mobile-search');
    const vegToggle = document.getElementById('veg-toggle');
    const toggleBg = document.getElementById('toggle-bg');
    const toggleIndicatorColor = document.getElementById('toggle-indicator-color');
    const filterVegText = document.getElementById('filter-veg-text');
    const filterAllText = document.getElementById('filter-all-text');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // Cart DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchContainer = document.getElementById('mobile-search-container');
    const cartBadge = document.getElementById('cart-badge');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items');
    const emptyCartMsgHtml = `
            <div id="empty-cart-msg" class="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                <i class="ph ph-shopping-cart text-6xl text-gray-700 mb-4"></i>
                <p class="text-xl font-serif text-gray-300 mb-2">Your cart is empty</p>
                <p class="text-sm">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
                <button onclick="document.getElementById('close-cart-btn').click(); document.getElementById('menu-section').scrollIntoView();" class="mt-6 font-bold text-brand-500 hover:text-brand-400">Browse Menu</button>
            </div>`;
    const cartFooter = document.getElementById('cart-footer');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    const categories = ['All', 'Starters', 'Street Food', 'Chinese', 'Biryani', 'Burgers', 'Rolls', 'Pizza', 'Desserts', 'Drinks'];

    // Initialize App
    function init() {
        renderCategories();
        renderMenu();
        setupEventListeners();
        updateCartStorage();
    }

    // --- RENDER FUNCTIONS --- //

    function renderCategories() {
        categoryFilters.innerHTML = categories.map(cat => {
            const isActive = state.filter.category.toLowerCase() === cat.toLowerCase();
            return `
                <button data-category="${cat.toLowerCase()}" class="category-chip px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'}">
                    ${cat}
                </button>
            `;
        }).join('');

        // Add event listeners to newly created chips
        document.querySelectorAll('.category-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const cat = e.target.getAttribute('data-category');
                state.filter.category = cat;
                renderCategories(); // re-render to update active state
                renderMenu();
            });
        });
    }

    function renderMenu() {
        let filtered = state.menuItems;

        // Search Filter
        if (state.filter.search) {
            const query = state.filter.search.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        // Category Filter
        if (state.filter.category !== 'all') {
            filtered = filtered.filter(item => item.category === state.filter.category);
        }

        // Veg Only Filter
        if (state.filter.vegOnly) {
            filtered = filtered.filter(item => item.type === 'veg');
        }

        // Render Grid
        if (filtered.length === 0) {
            foodGrid.innerHTML = '';
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            foodGrid.innerHTML = filtered.map((item, index) => createFoodCard(item, index)).join('');
        }
    }

    function createFoodCard(item, index) {
        // Animation delay for staggered appearance
        const delay = (index % 10) * 0.1;

        const isVeg = item.type === 'veg';
        const typeIcon = isVeg ? '<div class="veg-icon" title="Vegetarian"></div>' : '<div class="nonveg-icon" title="Non-Vegetarian"></div>';

        const badgesHtml = item.badges && item.badges.length > 0
            ? `<div class="absolute top-4 left-4 flex flex-col gap-2">
                 ${item.badges.map(badge => `<span class="bg-dark-900/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10 uppercase tracking-wide">${badge}</span>`).join('')}
               </div>`
            : '';

        return `
            <div class="food-card rounded-2xl overflow-hidden fade-in relative flex flex-col" style="animation-delay: ${delay}s">
                <div class="card-img-wrap h-56 w-full relative">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" class="card-img w-full h-full object-cover">
                    ${badgesHtml}
                    <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark-800 to-transparent"></div>
                </div>
                
                <div class="p-5 flex-1 flex flex-col bg-dark-800 z-10 -mt-2 rounded-t-2xl">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex gap-2 items-center">
                            ${typeIcon}
                            <h3 class="font-serif text-xl font-bold leading-tight line-clamp-1" title="${item.name}">${item.name}</h3>
                        </div>
                    </div>
                    
                    <p class="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">${item.description}</p>
                    
                    <div class="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div class="font-bold text-xl text-white">₹${item.price}</div>
                        <button onclick="window.addToCart(${item.id})" class="add-to-cart-btn bg-white/5 hover:bg-brand-500 border border-white/10 hover:border-brand-500 text-white rounded-lg px-4 py-2 text-sm font-bold transition-all duration-300 flex items-center gap-2 group">
                            <span>Add</span>
                            <i class="ph-bold ph-plus group-hover:rotate-90 transition-transform"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- CART LOGIC --- //

    window.addToCart = function (id) {
        const item = state.menuItems.find(i => i.id === id);
        if (!item) return;

        const existingItem = state.cart.find(i => i.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({ ...item, quantity: 1 });
        }

        updateCartUI();
        showToast(`Added ${item.name} to cart`);

        // Pulse cart icon
        cartBtn.classList.add('animate-pulse');
        setTimeout(() => cartBtn.classList.remove('animate-pulse'), 500);
    };

    window.updateQuantity = function (id, delta) {
        const itemIndex = state.cart.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            state.cart[itemIndex].quantity += delta;

            if (state.cart[itemIndex].quantity <= 0) {
                state.cart.splice(itemIndex, 1);
            }
            updateCartUI();
        }
    };

    window.removeFromCart = function (id) {
        state.cart = state.cart.filter(i => i.id !== id);
        updateCartUI();
    };

    function updateCartUI() {
        // Update badge
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('scale-0');
            cartBadge.classList.add('scale-100');
        } else {
            cartBadge.classList.remove('scale-100');
            cartBadge.classList.add('scale-0');
        }

        // Render Cart items
        if (state.cart.length === 0) {
            cartItemsList.innerHTML = emptyCartMsgHtml;
            cartFooter.classList.add('hidden');
        } else {
            cartFooter.classList.remove('hidden');

            cartItemsList.innerHTML = state.cart.map(item => {
                const isVeg = item.type === 'veg';
                return `
                <div class="flex gap-4 bg-dark-800 p-3 rounded-xl border border-white/5 animate-fadeIn">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                    <div class="flex-1 flex flex-col relative">
                        <button onclick="window.removeFromCart(${item.id})" class="absolute -top-1 -right-1 text-gray-500 hover:text-brand-500 transition-colors">
                            <i class="ph-bold ph-x"></i>
                        </button>
                        <h4 class="font-bold text-sm tracking-wide mb-1 pr-6 flex items-center gap-1">
                            ${isVeg ? '<div class="veg-icon" style="transform: scale(0.6)"></div>' : '<div class="nonveg-icon" style="transform: scale(0.6)"></div>'} 
                            <span class="line-clamp-1">${item.name}</span>
                        </h4>
                        <div class="text-brand-400 font-bold mb-2">₹${item.price}</div>
                        <div class="mt-auto flex items-center justify-between">
                            <div class="flex items-center bg-dark-900 rounded-lg border border-white/10 overflow-hidden">
                                <button onclick="window.updateQuantity(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors text-gray-400">-</button>
                                <span class="w-8 text-center text-sm font-bold">${item.quantity}</span>
                                <button onclick="window.updateQuantity(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors text-brand-500 hover:text-brand-400">+</button>
                            </div>
                            <span class="font-bold">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            // Calculate totals
            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const taxes = 25; // Dummy flat tax

            cartSubtotal.textContent = `₹${subtotal}`;
            cartTotal.textContent = `₹${subtotal + taxes}`;
        }

        // Save to local storage
        localStorage.setItem('streetSpicyCart', JSON.stringify(state.cart));
    }

    function updateCartStorage() {
        const savedCart = localStorage.getItem('streetSpicyCart');
        if (savedCart) {
            try {
                state.cart = JSON.parse(savedCart);
                updateCartUI();
            } catch (e) {
                console.error("Could not parse cart from storage");
            }
        }
    }

    function toggleCart() {
        const isHidden = cartOverlay.classList.contains('hidden');

        if (isHidden) {
            // Open Cart
            document.body.style.overflow = 'hidden'; // prevent bg scrolling
            cartOverlay.classList.remove('hidden');
            setTimeout(() => {
                cartOverlay.classList.remove('opacity-0');
                cartDrawer.classList.remove('translate-x-full');
            }, 10);
        } else {
            // Close Cart
            document.body.style.overflow = '';
            cartOverlay.classList.add('opacity-0');
            cartDrawer.classList.add('translate-x-full');
            setTimeout(() => {
                cartOverlay.classList.add('hidden');
            }, 300);
        }
    }

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0');

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }

    // --- EVENT LISTENERS --- //

    function setupEventListeners() {
        // Toggle mobile search
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchContainer.classList.toggle('hidden');
            if (!mobileSearchContainer.classList.contains('hidden')) {
                mobileSearch.focus();
            }
        });

        // Search inputs
        const handleSearch = (e) => {
            state.filter.search = e.target.value;
            // Sync both inputs
            if (e.target === desktopSearch) mobileSearch.value = e.target.value;
            if (e.target === mobileSearch) desktopSearch.value = e.target.value;

            // Scroll to menu if searching
            if (e.target.value.length > 0) {
                document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
            }
            renderMenu();
        };

        desktopSearch.addEventListener('input', handleSearch);
        mobileSearch.addEventListener('input', handleSearch);

        // Veg Toggle
        vegToggle.addEventListener('change', (e) => {
            state.filter.vegOnly = e.target.checked;

            if (e.target.checked) {
                toggleIndicatorColor.className = "w-2 h-2 rounded-full bg-green-500";
                filterVegText.classList.replace('text-gray-500', 'text-green-500');
                filterAllText.classList.replace('text-gray-300', 'text-gray-500');
            } else {
                toggleIndicatorColor.className = "w-2 h-2 rounded-full";
                filterVegText.classList.replace('text-green-500', 'text-gray-500');
                filterAllText.classList.replace('text-gray-500', 'text-gray-300');
            }

            renderMenu();
        });

        // Clear filter
        clearFiltersBtn.addEventListener('click', () => {
            state.filter.search = '';
            state.filter.category = 'all';
            state.filter.vegOnly = false;

            desktopSearch.value = '';
            mobileSearch.value = '';
            vegToggle.checked = false;

            toggleIndicatorColor.className = "w-2 h-2 rounded-full";
            filterVegText.classList.replace('text-green-500', 'text-gray-500');
            filterAllText.classList.replace('text-gray-500', 'text-gray-300');

            renderCategories();
            renderMenu();
        });

        // Cart Toggling
        cartBtn.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', toggleCart);

        // Navbar scroll styling
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-dark-900/95', 'shadow-lg');
                navbar.classList.remove('border-transparent');
            } else {
                navbar.classList.remove('bg-dark-900/95', 'shadow-lg');
                navbar.classList.add('border-transparent');
            }
        });
    }

    // Run!
    init();
});
