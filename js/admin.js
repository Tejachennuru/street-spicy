// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabSelectors = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    // Dashboard Elements
    const statReceivables = document.getElementById('stat-receivables');
    const statActiveItems = document.getElementById('stat-active-items');
    const statPendingKaatha = document.getElementById('stat-pending-kaatha');

    // Foods Elements
    const adminFoodsTbody = document.getElementById('admin-foods-tbody');
    const addFoodForm = document.getElementById('add-food-form');

    // Kaatha Elements
    const adminKaathaTbody = document.getElementById('admin-kaatha-tbody');

    // Orders Elements
    const adminOrdersList = document.getElementById('admin-orders-list');
    const orderFilter = document.getElementById('order-filter');

    // State
    const state = {
        foods: [],
        users: [],
        orders: [],
        currentTab: 'dashboard'
    };

    // Initialize Admin
    async function init() {
        try {
            state.foods = await db.getFoodItems();
            state.users = await db.getUsers();
            state.orders = await db.getOrders();

            renderAll();
        } catch (error) {
            console.error("Error loading admin data:", error);
            alert("Failed to load admin data. See console.");
        }
    }

    // Tab Switching Logic
    window.switchTab = (tabId) => {
        state.currentTab = tabId;

        // Hide all tabs
        tabContents.forEach(tab => tab.classList.add('hidden'));

        // Dims all selectors
        tabSelectors.forEach(selector => {
            selector.classList.remove('bg-brand-500/10', 'text-brand-500');
            selector.classList.add('text-gray-400');
        });

        // Show selected tab
        document.getElementById(`view-${tabId}`).classList.remove('hidden');
        document.getElementById(`tab-${tabId}`).classList.add('bg-brand-500/10', 'text-brand-500');
        document.getElementById(`tab-${tabId}`).classList.remove('text-gray-400');

        // Update Title
        const titles = {
            'dashboard': 'Dashboard Overview',
            'foods': 'Menu & Stock Management',
            'kaatha': 'Customer Credit (Kaatha)',
            'orders': 'Orders History'
        };
        pageTitle.textContent = titles[tabId];

        renderAll(); // Refresh data explicitly
    };

    // Render Functions
    function renderAll() {
        renderDashboard();
        if (state.currentTab === 'foods') renderFoods();
        if (state.currentTab === 'kaatha') renderKaatha();
        if (state.currentTab === 'orders') renderOrders();
    }

    function renderDashboard() {
        // Receivables = sum of user balances where balance > 0
        const totalReceivables = state.users.reduce((sum, u) => sum + (parseFloat(u.balance) || 0), 0);
        statReceivables.textContent = `₹${totalReceivables.toFixed(2)}`;

        // Active Items
        const activeItems = state.foods.filter(f => f.is_active).length;
        statActiveItems.textContent = activeItems;

        // Pending Kaatha Approvals
        const pending = state.users.filter(u => u.kaatha_status === 'pending').length;
        statPendingKaatha.textContent = pending;
    }

    function renderFoods() {
        if (state.foods.length === 0) {
            adminFoodsTbody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-gray-500">No items found. Add some dishes to the menu!</td></tr>';
            return;
        }

        adminFoodsTbody.innerHTML = state.foods.map(item => `
            <tr class="hover:bg-dark-800/50 transition-colors">
                <td class="p-4">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded object-cover">
                </td>
                <td class="p-4 font-medium">
                    <div class="line-clamp-1">${item.name}</div>
                    <span class="text-xs text-brand-500 uppercase tracking-wider">${item.category} • ${item.type}</span>
                </td>
                <td class="p-4 font-bold">₹${item.price}</td>
                <td class="p-4">
                    <button onclick="window.toggleFoodStatus(${item.id}, ${!item.is_active})" class="px-3 py-1 rounded-full text-xs font-bold border transition-colors ${item.is_active ? 'border-green-500 text-green-500 bg-green-500/10 hover:bg-green-500 hover:text-white' : 'border-gray-500 text-gray-500 bg-gray-500/10 hover:bg-gray-500 hover:text-white'}">
                        ${item.is_active ? 'In Stock' : 'Out of Stock'}
                    </button>
                </td>
                <td class="p-4">
                    <button onclick="window.deleteFood(${item.id})" class="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"><i class="ph ph-trash text-lg"></i></button>
                </td>
            </tr>
        `).join('');
    }

    function renderKaatha() {
        if (state.users.length === 0) {
            adminKaathaTbody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-gray-500">No registered users found.</td></tr>';
            return;
        }

        adminKaathaTbody.innerHTML = state.users.map(user => {
            const statusColor = user.kaatha_status === 'approved' ? 'text-green-500' : (user.kaatha_status === 'pending' ? 'text-brand-yellow' : 'text-red-500');
            const statusLabel = user.kaatha_status.charAt(0).toUpperCase() + user.kaatha_status.slice(1);

            return `
            <tr class="hover:bg-dark-800/50 transition-colors">
                <td class="p-4">
                    <div class="font-bold">${user.name || 'User'}</div>
                    <div class="text-gray-400 text-xs">${user.phone_number}</div>
                </td>
                <td class="p-4">
                    ${user.aadhar_url ? `<a href="${user.aadhar_url}" target="_blank" class="text-brand-500 hover:underline text-xs flex items-center gap-1"><i class="ph ph-image"></i> View Aadhar</a>` : '<span class="text-gray-500 text-xs text-italic">Not Uploaded</span>'}
                </td>
                <td class="p-4 font-bold font-serif text-lg">₹${user.balance || 0}</td>
                <td class="p-4">
                    <div class="${statusColor} font-bold text-xs mb-1">• ${statusLabel}</div>
                    <div class="text-xs text-gray-400">Limit: ₹${user.credit_limit || 0}</div>
                </td>
                <td class="p-4">
                    ${user.kaatha_status === 'pending' && user.aadhar_url ? `
                        <button onclick="window.approveKaatha('${user.id}')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold mr-2">Approve</button>
                        <button onclick="window.rejectKaatha('${user.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">Reject</button>
                    ` : ''}
                    ${user.kaatha_status === 'approved' ? `
                        <button onclick="window.setCreditLimit('${user.id}')" class="text-brand-500 hover:text-brand-400 text-xs font-bold ml-2 underline">Edit Limit</button>
                        <button onclick="window.clearBalance('${user.id}', ${user.balance})" class="text-green-500 hover:text-green-400 text-xs font-bold ml-2 underline">Clear Dues</button>
                    ` : ''}
                </td>
            </tr>
            `;
        }).join('');
    }

    function renderOrders() {
        const filter = orderFilter.value; // 'all', 'month', 'week'
        const now = new Date();

        const filteredOrders = state.orders.filter(order => {
            const orderDate = new Date(order.created_at);
            if (filter === 'all') return true;

            const diffTime = Math.abs(now - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (filter === 'month') return diffDays <= 30;
            if (filter === 'week') return diffDays <= 7;
            return true;
        });

        if (filteredOrders.length === 0) {
            adminOrdersList.innerHTML = '<div class="text-center text-gray-500 py-6">No orders found for the selected period.</div>';
            return;
        }

        adminOrdersList.innerHTML = filteredOrders.map(order => {
            const date = new Date(order.created_at).toLocaleString();
            const itemsStr = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

            return `
            <div class="border-b border-white/5 pb-4 last:border-0">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="text-xs text-gray-400 bg-dark-900 px-2 py-1 rounded">ORD-${order.id}</span>
                        <span class="text-xs text-gray-500 ml-2">${date}</span>
                    </div>
                    <div class="font-bold font-serif text-lg">₹${order.total_amount}</div>
                </div>
                <div class="text-sm text-gray-300 mb-2 truncate">${itemsStr}</div>
                <div class="flex justify-between items-center mt-2">
                    <div class="text-xs bg-dark-900 border border-white/5 px-2 py-1 rounded flex items-center gap-2">
                        <i class="ph-fill ph-wallet text-gray-400"></i> Paid via <span class="${order.payment_method === 'kaatha' ? 'text-brand-orange font-bold' : 'text-gray-300'} uppercase">${order.payment_method}</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    orderFilter.addEventListener('change', renderOrders);


    // Actions
    window.toggleFoodStatus = async (id, newStatus) => {
        try {
            await db.updateFoodItem(id, { is_active: newStatus });
            // Re-fetch and re-render
            state.foods = await db.getFoodItems();
            renderAll();
        } catch (e) {
            console.error(e);
            alert("Failed to update status");
        }
    };

    window.deleteFood = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await db.deleteFoodItem(id);
            state.foods = await db.getFoodItems();
            renderAll();
        } catch (e) {
            console.error(e);
            alert("Failed to delete item");
        }
    };

    window.approveKaatha = async (id) => {
        const limitStr = prompt("Set credit limit for this user (₹):", "5000");
        if (!limitStr) return;
        const limit = parseFloat(limitStr);
        if (isNaN(limit)) return alert("Invalid amount.");

        try {
            await db.updateUser(id, { kaatha_status: 'approved', credit_limit: limit });
            state.users = await db.getUsers();
            renderAll();
        } catch (e) { console.error(e); alert("Failed to approve.") }
    };

    window.rejectKaatha = async (id) => {
        try {
            await db.updateUser(id, { kaatha_status: 'rejected' });
            state.users = await db.getUsers();
            renderAll();
        } catch (e) { console.error(e); alert("Failed to reject.") }
    };

    window.setCreditLimit = async (id) => {
        const limitStr = prompt("Enter new credit limit (₹):");
        if (!limitStr) return;
        const limit = parseFloat(limitStr);
        if (isNaN(limit)) return alert("Invalid amount.");

        try {
            await db.updateUser(id, { credit_limit: limit });
            state.users = await db.getUsers();
            renderAll();
        } catch (e) { console.error(e); alert("Failed to update limit.") }
    };

    window.clearBalance = async (id, currentBalance) => {
        if (!confirm(`Mark ₹${currentBalance} as paid by the customer?`)) return;

        try {
            await db.updateUser(id, { balance: 0 });
            state.users = await db.getUsers();
            renderAll();
        } catch (e) { console.error(e); alert("Failed to clear balance.") }
    };

    // Add Food Form
    addFoodForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newItem = {
            name: document.getElementById('add-name').value,
            price: parseFloat(document.getElementById('add-price').value),
            type: document.getElementById('add-type').value,
            category: document.getElementById('add-category').value.toLowerCase(),
            image: document.getElementById('add-image').value,
            is_active: true,
            description: 'Delicious hot street food.'
        };

        try {
            await db.addFoodItem(newItem);
            state.foods = await db.getFoodItems();
            renderAll();

            // Close modal & reset
            document.getElementById('add-food-modal').classList.add('hidden');
            addFoodForm.reset();
        } catch (err) {
            console.error(err);
            alert("Failed to add food.");
        }
    });

    // Run Initialization
    init();
});

// Mobile Sidebar Toggle Logic
window.toggleSidebar = function () {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Check if sidebar is currently translated off-screen
    const isClosed = sidebar.classList.contains('-translate-x-full');

    if (isClosed) {
        // Open sidebar
        sidebar.classList.remove('-translate-x-full');
        // Show overlay
        overlay.classList.remove('hidden');
        // A tiny delay to ensure transition applies to opacity
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        // Close sidebar
        sidebar.classList.add('-translate-x-full');
        // Hide overlay
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
};
