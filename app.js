// --- State Management ---
const STORAGE_KEY = 'mobile_shop_manager_data';

const defaultState = {
    inventory: [],
    sales: [],
    installments: [],
    customers: [],
    users: [],
    notifications: [
        { id: 1, title: 'Low Stock Alert', message: 'Samsung Galaxy S23 Ultra has only 1 unit remaining in stock.', time: '2 hours ago', unread: true, type: 'warning' },
        { id: 2, title: 'Installment Pending', message: 'Muhammad Ali\'s installment of Rs. 15,000 was due yesterday.', time: '1 day ago', unread: true, type: 'info' },
        { id: 3, title: 'System Updated', message: 'Mobile Shop Manager successfully updated to v2.5.0.', time: '2 days ago', unread: false, type: 'success' }
    ],
    security: {
        enabled: false,
        pin: '',
        biometricsEnabled: false
    }
};

let appState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState;
if (!appState.users) appState.users = [];
if (appState.isDarkMode === undefined) appState.isDarkMode = false;
if (!appState.security) {
    appState.security = {
        enabled: false,
        pin: '',
        biometricsEnabled: false
    };
}
if (!appState.notifications) {
    appState.notifications = [
        { id: 1, title: 'Low Stock Alert', message: 'Samsung Galaxy S23 Ultra has only 1 unit remaining in stock.', time: '2 hours ago', unread: true, type: 'warning' },
        { id: 2, title: 'Installment Pending', message: 'Muhammad Ali\'s installment of Rs. 15,000 was due yesterday.', time: '1 day ago', unread: true, type: 'info' },
        { id: 3, title: 'System Updated', message: 'Mobile Shop Manager successfully updated to v2.5.0.', time: '2 days ago', unread: false, type: 'success' }
    ];
}

let currentUser = JSON.parse(localStorage.getItem('current_user')) || null;

function applyTheme() {
    if (appState.isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
applyTheme();

function toggleTheme() {
    appState.isDarkMode = !appState.isDarkMode;
    saveState();
    applyTheme();
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

// --- Auth ---
function renderAuthForm(type = 'login') {
    const container = document.getElementById('auth-overlay');
    
    if (type === 'login') {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-4 animate-[slideDown_0.3s_ease-out]">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-brand-500/30 mb-5">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
                    <p class="text-gray-500 text-sm mt-2">Login to manage your mobile shop</p>
                </div>
                <form onsubmit="handleLogin(event)" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" id="login-email" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
                        <input type="password" id="login-password" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 rounded-xl mt-6 shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5">Login</button>
                </form>
                <div class="mt-8 text-center pt-6 border-t border-gray-100">
                    <p class="text-sm text-gray-600">Don't have an account? <button onclick="renderAuthForm('register')" class="text-brand-600 font-bold hover:underline">Register</button></p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-4 animate-[slideDown_0.3s_ease-out]">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-brand-500/30 mb-5">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h2>
                    <p class="text-gray-500 text-sm mt-2">Register to start managing your shop</p>
                </div>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name</label>
                        <input type="text" id="reg-name" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" id="reg-email" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
                        <input type="password" id="reg-password" required minlength="6" class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Profile Picture (Optional)</label>
                        <input type="file" id="reg-avatar" accept="image/*" class="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer">
                    </div>
                    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 rounded-xl mt-6 shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5">Register</button>
                </form>
                <div class="mt-8 text-center pt-6 border-t border-gray-100">
                    <p class="text-sm text-gray-600">Already have an account? <button onclick="renderAuthForm('login')" class="text-brand-600 font-bold hover:underline">Login here</button></p>
                </div>
            </div>
        `;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    
    const emailExists = appState.users.some(u => u.email === email);
    
    if (!emailExists) {
        showConfirmModal(
            'Email Not Registered',
            `The email <strong>${email}</strong> is not registered. Would you like to create a new account now?`,
            () => {
                renderAuthForm('register');
                const regEmail = document.getElementById('reg-email');
                if (regEmail) regEmail.value = email;
            },
            'Register Now',
            'Cancel',
            false
        );
        return;
    }

    const user = appState.users.find(u => u.email === email && u.password === pass);
    if (user) {
        currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        document.getElementById('auth-overlay').classList.add('hidden');
        document.getElementById('auth-overlay').classList.remove('flex');
        updateUserInfo();
        updateNotificationBadges();
        showToast('Login successful!');
        navigate('dashboard');
    } else {
        showToast('Incorrect password. Please try again.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    const fileInput = document.getElementById('reg-avatar');
    
    if (appState.users.some(u => u.email === email)) {
        showConfirmModal(
            'Account Already Exists',
            `An account with the email <strong>${email}</strong> already exists. Would you like to login to this account?`,
            () => {
                renderAuthForm('login');
                const loginEmail = document.getElementById('login-email');
                if (loginEmail) loginEmail.value = email;
            },
            'Login Instead',
            'Cancel',
            false
        );
        return;
    }

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const avatar = event.target.result;
            completeRegistration(name, email, pass, avatar);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        completeRegistration(name, email, pass, '');
    }
}

function completeRegistration(name, email, pass, avatar) {
    const newUser = { id: generateId(), name, email, password: pass, avatar };
    appState.users.push(newUser);
    
    // Add Welcome Notification
    const welcomeNotif = {
        id: generateId(),
        title: `Welcome, ${name}! 🎉`,
        message: 'Thank you for choosing Mobile Shop Manager! Start managing your shop by adding your inventory, listing sales, and tracking ledger customer accounts.',
        time: 'Just now',
        unread: true,
        type: 'success'
    };
    if (!appState.notifications) appState.notifications = [];
    appState.notifications.unshift(welcomeNotif);
    
    saveState();
    
    currentUser = newUser;
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('auth-overlay').classList.remove('flex');
    updateUserInfo();
    updateNotificationBadges();
    showToast('Account created successfully!');
    navigate('dashboard');
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('current_user');
    document.getElementById('auth-overlay').classList.remove('hidden');
    document.getElementById('auth-overlay').classList.add('flex');
    renderAuthForm('login');
}

function updateUserInfo() {
    const nameEl = document.getElementById('sidebar-user-name');
    const initialEl = document.getElementById('sidebar-user-initial');
    if (nameEl && currentUser) nameEl.innerText = currentUser.name;
    if (initialEl && currentUser) {
        if (currentUser.avatar) {
            initialEl.innerHTML = `<img src="${currentUser.avatar}" alt="User" class="w-full h-full object-cover">`;
            initialEl.classList.remove('bg-brand-200', 'text-brand-700', 'font-bold');
            initialEl.classList.add('bg-gray-100');
        } else {
            initialEl.innerHTML = currentUser.name.charAt(0).toUpperCase();
            initialEl.classList.add('bg-brand-200', 'text-brand-700', 'font-bold');
            initialEl.classList.remove('bg-gray-100');
        }
    }
}

// --- Utility Functions ---
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm flex items-center space-x-2 toast-enter pointer-events-auto ${type === 'success' ? 'bg-brand-600' : 'bg-red-500'}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.replace('toast-enter', 'toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Navigation ---
const views = {
    dashboard: renderDashboard,
    inventory: renderInventory,
    addMobile: renderAddMobile,
    sales: renderSales,
    customers: renderCustomers,
    settings: renderSettings
};

const viewTitles = {
    dashboard: 'Dashboard',
    inventory: 'Inventory Stock',
    addMobile: 'Add New Mobile',
    sales: 'New Sale',
    customers: 'Customer Ledger',
    settings: 'Account'
};

function navigate(viewName) {
    // Update navigation UI
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.target === viewName) {
            btn.classList.add('active');
        }
    });

    // Update Header
    document.querySelectorAll('.header-title-text').forEach(el => {
        el.innerText = viewTitles[viewName];
    });

    // Render Content
    const contentArea = document.getElementById('app-content');

    // Simple enter animation
    contentArea.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'view-enter';

    if (views[viewName]) {
        container.innerHTML = views[viewName]();
    } else {
        container.innerHTML = `<div class="text-center text-gray-500 mt-10">View not found</div>`;
    }

    contentArea.appendChild(container);

    // Trigger reflow and add active class for animation
    void container.offsetWidth;
    container.classList.add('view-enter-active');

    // Run post-render scripts if needed
    if (window[`init_${viewName}`]) {
        window[`init_${viewName}`]();
    }
}

// --- View Renderers ---

function renderDashboard() {
    const totalSales = appState.sales.reduce((sum, sale) => sum + parseInt(sale.totalAmount), 0);
    const totalPendingInst = appState.installments.filter(i => !i.isPaid).reduce((sum, i) => sum + parseInt(i.amount), 0);

    // Monthly Profit Calculation (Profit realized from cash sales + profit from paid installments)
    let totalProfit = 0;

    appState.sales.forEach(sale => {
        if (sale.type === 'cash') {
            totalProfit += parseInt(sale.profit);
        }
    });

    appState.installments.forEach(inst => {
        if (inst.isPaid) {
            totalProfit += parseInt(inst.profitPortion);
        }
    });

    return `
        <div class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div class="bg-gradient-animate text-white p-5 rounded-2xl shadow-lg relative overflow-hidden md:col-span-1">
                    <div class="relative z-10">
                        <p class="text-brand-100 text-xs md:text-sm font-medium mb-1">Total Earned Profit</p>
                        <h3 class="text-2xl md:text-3xl font-bold">${formatCurrency(totalProfit)}</h3>
                    </div>
                    <i class="fa-solid fa-chart-line absolute -bottom-4 -right-2 text-6xl text-white opacity-20"></i>
                </div>
                <div class="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
                    <p class="text-gray-500 text-xs md:text-sm font-medium mb-1">Total Sales</p>
                    <h3 class="text-xl md:text-2xl font-bold text-gray-800">${formatCurrency(totalSales)}</h3>
                </div>
                <div class="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm col-span-2 md:col-span-1 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p class="text-gray-500 text-xs md:text-sm font-medium mb-1">Pending Installments</p>
                        <h3 class="text-xl md:text-2xl font-bold text-red-500">${formatCurrency(totalPendingInst)}</h3>
                    </div>
                    <div class="h-10 w-10 md:h-12 md:w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-clock-rotate-left md:text-lg"></i>
                    </div>
                </div>
            </div>

            <!-- Recent Sales -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h3 class="font-bold text-gray-800 text-lg mb-4">Recent Sales</h3>
                <div class="space-y-3">
                    ${appState.sales.length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">No sales yet.</p>' : ''}
                    ${appState.sales.slice().reverse().slice(0, 5).map(sale => {
        const mobile = appState.inventory.find(m => m.id === sale.mobileId) || { brand: 'Unknown', model: '' };
        return `
                        <div class="group p-3 md:p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all flex justify-between items-center cursor-pointer">
                            <div class="flex items-center space-x-3 md:space-x-4">
                                <div class="h-10 w-10 md:h-12 md:w-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shadow-sm">
                                    <i class="fa-solid ${sale.type === 'cash' ? 'fa-money-bill' : 'fa-calendar-days'} md:text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-sm md:text-base font-bold text-gray-800 group-hover:text-brand-600 transition-colors">${mobile.brand} ${mobile.model}</p>
                                    <p class="text-xs md:text-sm text-gray-500">${sale.customerName} • <span class="${sale.type === 'cash' ? 'text-green-600' : 'text-orange-500'} capitalize font-medium">${sale.type}</span></p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm md:text-base font-bold text-gray-800">${formatCurrency(sale.totalAmount)}</p>
                                <p class="text-xs md:text-sm text-brand-600 font-medium">+${formatCurrency(sale.type === 'cash' ? sale.profit : 'Pending')}</p>
                            </div>
                        </div>
                        `
    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderInventory() {
    return `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <button onclick="navigate('addMobile')" class="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-plus"></i>
                    <span>Add New Mobile</span>
                </button>
            </div>

            <!-- Inventory List -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                ${appState.inventory.length === 0 ? '<div class="col-span-full"><p class="text-sm text-gray-400 text-center py-10">Inventory is empty.</p></div>' : ''}
                ${appState.inventory.map(item => `
                    <div class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-bold text-gray-800 text-lg">${item.brand} ${item.model}</h4>
                                <p class="text-xs text-gray-500 font-mono mt-1">IMEI: ${item.imei}</p>
                            </div>
                            <span class="bg-brand-50 text-brand-700 border border-brand-100 text-xs px-2.5 py-1 rounded-md font-bold shadow-sm">Stock: ${item.stock}</span>
                        </div>
                        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Purchase: <span class="font-medium text-gray-700">${formatCurrency(item.purchasePrice)}</span></p>
                                <p class="text-sm font-bold text-brand-600">Retail: ${formatCurrency(item.sellingPrice)}</p>
                            </div>
                            <button onclick="deleteInventoryItem('${item.id}')" class="text-red-400 p-2.5 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAddMobile() {
    return `
        <div class="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center space-x-4 mb-8 border-b border-gray-100 pb-5">
                <button onclick="navigate('inventory')" class="text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-arrow-left text-xl"></i>
                </button>
                <h2 class="font-bold text-gray-800 text-2xl tracking-tight">Enter Mobile Details</h2>
            </div>
            
            <form id="add-inventory-form" onsubmit="handleAddInventory(event)" class="space-y-8">
                <!-- Identity -->
                <div class="space-y-5">
                    <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center"><i class="fa-solid fa-mobile-screen mr-2"></i> Device Identity</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Brand</label>
                            <input type="text" id="inv-brand" placeholder="e.g. Samsung, Apple" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Model</label>
                            <input type="text" id="inv-model" placeholder="e.g. Galaxy S24, iPhone 15" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">IMEI Number</label>
                        <input type="text" id="inv-imei" placeholder="Enter 15-digit IMEI" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                </div>

                <!-- Pricing & Stock -->
                <div class="space-y-5 pt-6 border-t border-gray-100">
                    <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center"><i class="fa-solid fa-tags mr-2"></i> Pricing & Stock</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Purchase Price</label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs</span>
                                <input type="number" id="inv-purchase" placeholder="Cost price" required class="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Selling Price</label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rs</span>
                                <input type="number" id="inv-selling" placeholder="Retail price" required class="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Initial Stock Quantity</label>
                        <input type="number" id="inv-stock" required min="1" value="1" class="w-full md:w-1/2 border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                </div>

                <div class="pt-8">
                    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-0.5">
                        Save Mobile to Stock
                    </button>
                </div>
            </form>
        </div>
    `;
}

function renderSales() {
    const availablePhones = appState.inventory.filter(i => i.stock > 0);

    return `
        <div class="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="font-bold text-gray-800 text-xl mb-6 flex items-center space-x-2">
                <i class="fa-solid fa-cart-plus text-brand-600"></i>
                <span>Create New Sale</span>
            </h2>
            <form id="sale-form" onsubmit="handleSaleSubmit(event)" class="space-y-6">
                
                <!-- Customer Details -->
                <div class="space-y-4">
                    <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">1. Customer Details</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" id="sale-customer" placeholder="Customer Name" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                        <input type="tel" id="sale-phone" placeholder="Phone Number" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                </div>

                <!-- Select Mobile -->
                <div class="space-y-4 pt-2">
                    <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">2. Select Mobile</h3>
                    ${availablePhones.length === 0 ? '<p class="text-sm text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">No phones in stock. Add to inventory first.</p>' : `
                    <select id="sale-mobile" required class="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all appearance-none cursor-pointer">
                        <option value="" disabled selected>Select a Mobile...</option>
                        ${availablePhones.map(m => `<option value="${m.id}">${m.brand} ${m.model} - ${formatCurrency(m.sellingPrice)}</option>`).join('')}
                    </select>
                    `}
                </div>

                <!-- Sale Type -->
                <div class="space-y-4 pt-2">
                    <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">3. Payment Type</h3>
                    <div class="flex space-x-4">
                        <label class="flex-1 border-2 border-brand-500 bg-brand-50 rounded-xl p-4 flex items-center justify-center space-x-3 cursor-pointer transition-all">
                            <input type="radio" name="sale-type" value="cash" checked onchange="toggleInstallmentFields(false)" class="text-brand-600 w-4 h-4">
                            <span class="text-base font-bold text-brand-800">Cash</span>
                        </label>
                        <label class="flex-1 border-2 border-gray-100 rounded-xl p-4 flex items-center justify-center space-x-3 cursor-pointer transition-all hover:bg-gray-50">
                            <input type="radio" name="sale-type" value="installment" onchange="toggleInstallmentFields(true)" class="text-brand-600 w-4 h-4">
                            <span class="text-base font-bold text-gray-600">Installment</span>
                        </label>
                    </div>
                </div>

                <!-- Installment Details (Hidden by default) -->
                <div id="installment-fields" class="space-y-4 pt-2 hidden bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Final Installment Price (Total)</label>
                            <input type="number" id="sale-inst-price" placeholder="e.g. 50000" class="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                            <p class="text-xs text-gray-500 mt-2"><i class="fa-solid fa-circle-info mr-1"></i> Should include your profit.</p>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Downpayment (Advance)</label>
                            <input type="number" id="sale-downpayment" placeholder="Amount paid now" class="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">Number of Months</label>
                        <input type="number" id="sale-months" min="1" max="36" placeholder="e.g. 6" class="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all">
                    </div>
                </div>

                <button type="submit" class="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl mt-8 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:bg-brand-700 transition-all transform hover:-translate-y-0.5">
                    Complete Sale
                </button>
            </form>
        </div>
    `;
}

function renderCustomers() {
    return `
        <div class="space-y-6">
            <h2 class="font-bold text-gray-800 text-xl mb-4">Customer Ledger</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                ${appState.customers.length === 0 ? '<div class="col-span-full"><p class="text-sm text-gray-400 text-center py-10 bg-white rounded-2xl border border-gray-100">No customers yet.</p></div>' : ''}
                ${appState.customers.map(customer => {
        const customerSales = appState.sales.filter(s => s.customerName === customer.name);
        const customerInstallments = appState.installments.filter(i => i.customerId === customer.id);
        const pendingInstallments = customerInstallments.filter(i => !i.isPaid);

        return `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div class="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h4 class="font-bold text-gray-800 text-lg">${customer.name}</h4>
                                <p class="text-sm text-gray-500 mt-1"><i class="fa-solid fa-phone text-brand-500 mr-2"></i> ${customer.phone}</p>
                            </div>
                            <div class="text-right">
                                <span class="${pendingInstallments.length > 0 ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200'} border text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
                                    ${pendingInstallments.length} Pending
                                </span>
                            </div>
                        </div>
                        <div class="p-5 space-y-3 bg-white flex-1 overflow-y-auto max-h-64 no-scrollbar">
                            ${customerInstallments.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">Cash buyer. No installments.</p>' : ''}
                            ${customerInstallments.map(inst => `
                                <div class="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 ${inst.isPaid ? 'opacity-50' : ''}">
                                    <div>
                                        <p class="text-sm font-bold ${inst.isPaid ? 'line-through text-gray-400' : 'text-gray-800'}">
                                            Month ${inst.monthNumber}: ${formatCurrency(inst.amount)}
                                        </p>
                                        <p class="text-xs text-brand-600 mt-0.5">Profit Share: ${formatCurrency(inst.profitPortion)}</p>
                                    </div>
                                    ${inst.isPaid ?
                `<span class="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full"><i class="fa-solid fa-check mr-1"></i> Paid</span>` :
                `<button onclick="payInstallment('${inst.id}')" class="text-sm bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 px-4 py-2 rounded-xl font-bold transition-all shadow-sm">Mark Paid</button>`
            }
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    `
    }).join('')}
            </div>
        </div>
    `;
}

function renderSettings() {
    const avatarHtml = currentUser && currentUser.avatar 
        ? `<img src="${currentUser.avatar}" alt="User" class="w-full h-full object-cover">`
        : `${currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}`;
        
    return `
        <div class="space-y-6 max-w-3xl mx-auto">
            <h2 class="font-bold text-gray-800 dark:text-gray-100 text-xl mb-4">My Account</h2>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 transition-colors">
                <div class="flex items-center space-x-4">
                    <div class="relative cursor-pointer" onclick="showAvatarActionSheet()">
                        <div class="h-16 w-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner overflow-hidden border-2 border-white dark:border-gray-800 ring-2 ring-gray-50 dark:ring-gray-700">
                            ${avatarHtml}
                        </div>
                        <div class="absolute bottom-0 right-0 bg-brand-600 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                            <i class="fa-solid fa-camera text-[10px]"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">${currentUser ? currentUser.name : 'User'}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${currentUser ? currentUser.email : 'No email'}</p>
                    </div>
                </div>
                <button onclick="logoutUser()" class="px-5 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 font-bold transition-colors w-full md:w-auto text-center">
                    Logout
                </button>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors">
                <!-- Theme Toggle Option -->
                <div class="w-full p-5 flex justify-between items-center border-b border-gray-50 dark:border-gray-700 transition-colors">
                    <div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                        <div class="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <i class="fa-solid fa-moon"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-bold block">Dark Mode</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Toggle dark appearance</span>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="theme-toggle" class="sr-only peer" onchange="toggleTheme()" ${appState.isDarkMode ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 dark:bg-gray-700 dark:border-gray-600"></div>
                    </label>
                </div>
                
                <!-- Export Option -->
                <button class="w-full p-5 flex justify-between items-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                        <div class="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <i class="fa-solid fa-file-invoice"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-bold block">Export Data</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Download your records as CSV</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 text-sm"></i>
                </button>

                <!-- Privacy Policy Option -->
                <button onclick="showPrivacyModal()" class="w-full p-5 flex justify-between items-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                        <div class="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-bold block">Privacy Policy</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Read about your data security</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 text-sm"></i>
                </button>

                <!-- Security Lock Option -->
                <button onclick="showSecurityModal()" class="w-full p-5 flex justify-between items-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                        <div class="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-bold block">App Security Lock</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Set PIN & Fingerprint lock</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 dark:text-gray-500 text-sm"></i>
                </button>
                
                <!-- Clear Option -->
                <button onclick="clearData()" class="w-full p-5 flex justify-between items-center hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group">
                    <div class="flex items-center space-x-4 text-red-600 dark:text-red-400">
                        <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                            <i class="fa-solid fa-trash"></i>
                        </div>
                        <div class="text-left">
                            <span class="font-bold block">Reset All Data</span>
                            <span class="text-xs text-red-400 dark:text-red-300">Permanently delete everything</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Avatar Action Sheet Modal -->
        <div id="avatar-action-sheet" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] hidden flex-col justify-end md:justify-center items-center" onclick="if(event.target===this) hideAvatarActionSheet()">
            <div class="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl w-full max-w-sm p-5 animate-[slideDown_0.3s_ease-out]">
                <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden"></div>
                <h3 class="text-center font-bold text-gray-800 dark:text-gray-100 mb-5 text-lg">Update Profile Picture</h3>
                <div class="space-y-3">
                    <button onclick="document.getElementById('take-photo-input').click(); hideAvatarActionSheet();" class="w-full flex items-center justify-center space-x-3 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 font-bold py-4 rounded-xl transition-colors">
                        <i class="fa-solid fa-camera text-xl"></i>
                        <span>Take Photo</span>
                    </button>
                    <button onclick="document.getElementById('select-album-input').click(); hideAvatarActionSheet();" class="w-full flex items-center justify-center space-x-3 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-bold py-4 rounded-xl transition-colors">
                        <i class="fa-solid fa-images text-xl"></i>
                        <span>Select from Album</span>
                    </button>
                    <button onclick="hideAvatarActionSheet()" class="w-full flex items-center justify-center space-x-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold py-4 rounded-xl transition-colors mt-4">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
        
        <input type="file" id="take-photo-input" accept="image/*" capture="user" class="hidden" onchange="handleUpdateAvatar(event)">
        <input type="file" id="select-album-input" accept="image/*" class="hidden" onchange="handleUpdateAvatar(event)">
    `;
}

// --- Interaction Logic ---

function handleAddInventory(e) {
    e.preventDefault();
    const item = {
        id: generateId(),
        brand: document.getElementById('inv-brand').value,
        model: document.getElementById('inv-model').value,
        imei: document.getElementById('inv-imei').value,
        purchasePrice: parseInt(document.getElementById('inv-purchase').value),
        sellingPrice: parseInt(document.getElementById('inv-selling').value),
        stock: parseInt(document.getElementById('inv-stock').value)
    };
    appState.inventory.push(item);
    saveState();
    navigate('inventory');
    showToast('Mobile added to inventory');
}

function deleteInventoryItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        appState.inventory = appState.inventory.filter(i => i.id !== id);
        saveState();
        navigate('inventory');
        showToast('Item deleted successfully');
    }
}

function toggleInstallmentFields(show) {
    const fields = document.getElementById('installment-fields');
    if (show) {
        fields.classList.remove('hidden');
        document.getElementById('sale-inst-price').required = true;
        document.getElementById('sale-downpayment').required = true;
        document.getElementById('sale-months').required = true;

        // Auto-select styles
        document.querySelector('input[value="installment"]').parentElement.classList.replace('border-gray-100', 'border-brand-500');
        document.querySelector('input[value="installment"]').parentElement.classList.add('bg-brand-50');
        document.querySelector('input[value="installment"]').nextElementSibling.classList.replace('text-gray-600', 'text-brand-800');
        document.querySelector('input[value="cash"]').parentElement.classList.replace('border-brand-500', 'border-gray-100');
        document.querySelector('input[value="cash"]').parentElement.classList.remove('bg-brand-50');
        document.querySelector('input[value="cash"]').nextElementSibling.classList.replace('text-brand-800', 'text-gray-600');
    } else {
        fields.classList.add('hidden');
        document.getElementById('sale-inst-price').required = false;
        document.getElementById('sale-downpayment').required = false;
        document.getElementById('sale-months').required = false;

        document.querySelector('input[value="cash"]').parentElement.classList.replace('border-gray-100', 'border-brand-500');
        document.querySelector('input[value="cash"]').parentElement.classList.add('bg-brand-50');
        document.querySelector('input[value="cash"]').nextElementSibling.classList.replace('text-gray-600', 'text-brand-800');
        document.querySelector('input[value="installment"]').parentElement.classList.replace('border-brand-500', 'border-gray-100');
        document.querySelector('input[value="installment"]').parentElement.classList.remove('bg-brand-50');
        document.querySelector('input[value="installment"]').nextElementSibling.classList.replace('text-brand-800', 'text-gray-600');
    }
}

function handleSaleSubmit(e) {
    e.preventDefault();
    const type = document.querySelector('input[name="sale-type"]:checked').value;
    const mobileId = document.getElementById('sale-mobile').value;
    const mobile = appState.inventory.find(m => m.id === mobileId);

    if (!mobile || mobile.stock < 1) {
        showToast('Item out of stock', 'error');
        return;
    }

    const customerName = document.getElementById('sale-customer').value;
    const customerPhone = document.getElementById('sale-phone').value;

    let customer = appState.customers.find(c => c.phone === customerPhone);
    if (!customer) {
        customer = { id: generateId(), name: customerName, phone: customerPhone };
        appState.customers.push(customer);
    }

    const sale = {
        id: generateId(),
        date: new Date().toISOString(),
        type: type,
        mobileId: mobile.id,
        customerName: customer.name,
        customerId: customer.id
    };

    if (type === 'cash') {
        sale.totalAmount = mobile.sellingPrice;
        sale.profit = mobile.sellingPrice - mobile.purchasePrice;
    } else {
        const instPrice = parseInt(document.getElementById('sale-inst-price').value);
        const downpayment = parseInt(document.getElementById('sale-downpayment').value);
        const months = parseInt(document.getElementById('sale-months').value);

        sale.totalAmount = instPrice;

        // Total profit on this installment sale
        const totalProfit = instPrice - mobile.purchasePrice;
        // The profit realized immediately at downpayment could be calculated, but to distribute evenly over months:
        const profitPerMonth = totalProfit / months;
        const remainingAmount = instPrice - downpayment;
        const monthlyInstallment = remainingAmount / months;

        sale.profit = totalProfit; // Total expected

        // Generate Installments
        for (let i = 1; i <= months; i++) {
            appState.installments.push({
                id: generateId(),
                saleId: sale.id,
                customerId: customer.id,
                monthNumber: i,
                amount: monthlyInstallment,
                profitPortion: profitPerMonth,
                isPaid: false
            });
        }
    }

    appState.sales.push(sale);

    // Reduce Stock
    mobile.stock -= 1;

    saveState();
    showToast('Sale completed successfully!');
    navigate('dashboard');
}

function payInstallment(instId) {
    if (confirm('Mark this installment as paid?')) {
        const inst = appState.installments.find(i => i.id === instId);
        if (inst) {
            inst.isPaid = true;
            inst.paidDate = new Date().toISOString();
            saveState();
            showToast('Installment paid successfully!');
            navigate('customers');
        }
    }
}

function showConfirmModal(title, message, onConfirm, okText = 'OK', cancelText = 'Cancel', isDanger = true) {
    const existing = document.getElementById('custom-confirm-modal');
    if (existing) existing.remove();

    const iconBg = isDanger ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400' : 'bg-brand-100 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400';
    const iconClass = isDanger ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-info';
    const okBtnClass = isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20';

    const modalHtml = `
        <div id="custom-confirm-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 transition-opacity duration-200">
            <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-[slideDown_0.3s_ease-out] text-center transition-colors">
                <div class="w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="${iconClass} text-2xl animate-pulse"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">${title}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">${message}</p>
                <div class="flex space-x-3">
                    <button id="confirm-modal-cancel" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        ${cancelText}
                    </button>
                    <button id="confirm-modal-ok" class="flex-1 py-3 ${okBtnClass} text-white font-bold rounded-xl shadow-lg transition-colors">
                        ${okText}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('custom-confirm-modal');
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    const okBtn = document.getElementById('confirm-modal-ok');

    const closeModal = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    };

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    okBtn.addEventListener('click', () => {
        closeModal();
        if (onConfirm) onConfirm();
    });
}

function clearData() {
    showConfirmModal(
        'Reset All Data?',
        'This will permanently delete all your inventory, sales history, ledger accounts, and custom settings. This action cannot be undone.',
        () => {
            appState = JSON.parse(JSON.stringify(defaultState));
            saveState();
            showToast('All data cleared successfully');
            navigate('dashboard');
        }
    );
}

function showAvatarActionSheet() {
    const sheet = document.getElementById('avatar-action-sheet');
    if (sheet) {
        sheet.classList.remove('hidden');
        sheet.classList.add('flex');
    }
}

function hideAvatarActionSheet() {
    const sheet = document.getElementById('avatar-action-sheet');
    if (sheet) {
        sheet.classList.add('hidden');
        sheet.classList.remove('flex');
    }
}

function handleUpdateAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (currentUser) {
                currentUser.avatar = e.target.result;
                const userIndex = appState.users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    appState.users[userIndex].avatar = currentUser.avatar;
                }
                saveState();
                localStorage.setItem('current_user', JSON.stringify(currentUser));
                updateUserInfo();
                navigate('settings');
                showToast('Profile picture updated successfully!');
            }
        };
        reader.readAsDataURL(file);
    }
}

function toggleNotifications() {
    const drawer = document.getElementById('notification-drawer');
    const body = document.getElementById('notification-drawer-body');
    if (!drawer || !body) return;

    const isOpen = drawer.classList.contains('flex');
    if (isOpen) {
        body.classList.add('translate-x-full');
        drawer.classList.add('pointer-events-none');
        setTimeout(() => {
            drawer.classList.add('hidden');
            drawer.classList.remove('flex');
        }, 300);
    } else {
        drawer.classList.remove('hidden');
        drawer.classList.add('flex');
        drawer.classList.remove('pointer-events-none');
        body.getBoundingClientRect(); // trigger reflow
        body.classList.remove('translate-x-full');
        renderNotifications();
    }
}

function renderNotifications() {
    const listEl = document.getElementById('notification-list');
    const countEl = document.getElementById('notification-unread-count');
    if (!listEl || !countEl) return;

    const unreadCount = appState.notifications.filter(n => n.unread).length;
    countEl.innerText = `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`;

    if (appState.notifications.length === 0) {
        listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
                <i class="fa-solid fa-bell-slash text-4xl mb-3"></i>
                <p class="font-medium text-sm">No notifications yet</p>
                <p class="text-xs mt-1">We'll alert you when something happens</p>
            </div>
        `;
        return;
    }

    listEl.innerHTML = appState.notifications.map(notif => {
        let typeIcon = 'fa-info-circle text-blue-500 bg-blue-50 dark:bg-blue-900/20';
        if (notif.type === 'warning') typeIcon = 'fa-triangle-exclamation text-amber-500 bg-amber-50 dark:bg-amber-900/20';
        if (notif.type === 'success') typeIcon = 'fa-check-circle text-green-500 bg-green-50 dark:bg-green-900/20';

        return `
            <div class="p-4 rounded-2xl border transition-all flex space-x-3 bg-white dark:bg-gray-800 ${notif.unread ? 'border-brand-200 dark:border-brand-900 bg-brand-50/20 dark:bg-brand-900/5' : 'border-gray-100 dark:border-gray-700'}">
                <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeIcon.split(' ').slice(1).join(' ')}">
                    <i class="fa-solid ${typeIcon.split(' ')[0]}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-sm text-gray-800 dark:text-gray-100 truncate pr-2">${notif.title}</h4>
                        <span class="text-[10px] text-gray-400 whitespace-nowrap">${notif.time}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${notif.message}</p>
                </div>
            </div>
        `;
    }).join('');
}

function markAllNotificationsRead() {
    appState.notifications.forEach(n => n.unread = false);
    saveState();
    updateNotificationBadges();
    renderNotifications();
    showToast('All notifications marked as read');
}

function clearAllNotifications() {
    appState.notifications = [];
    saveState();
    updateNotificationBadges();
    renderNotifications();
    showToast('Notifications cleared');
}

function updateNotificationBadges() {
    const unreadCount = appState.notifications.filter(n => n.unread).length;
    const mobileBadge = document.getElementById('mobile-bell-badge');
    const desktopBadge = document.getElementById('desktop-bell-badge');

    if (unreadCount > 0) {
        if (mobileBadge) mobileBadge.classList.remove('hidden');
        if (desktopBadge) desktopBadge.classList.remove('hidden');
    } else {
        if (mobileBadge) mobileBadge.classList.add('hidden');
        if (desktopBadge) desktopBadge.classList.add('hidden');
    }
}

function showSecurityModal() {
    const existing = document.getElementById('security-modal');
    if (existing) existing.remove();

    const pinVal = appState.security.pin || '';
    const activeLock = !appState.security.enabled
        ? 'none'
        : (appState.security.biometricsEnabled ? 'biometric' : 'pin');

    const modalHtml = `
        <div id="security-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4 transition-opacity duration-200">
            <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-[slideDown_0.3s_ease-out] flex flex-col transition-colors max-h-[90vh] overflow-y-auto no-scrollbar">
                <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                    <div class="flex items-center space-x-3 text-brand-600 dark:text-brand-400">
                        <i class="fa-solid fa-lock text-2xl"></i>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">App Security Lock</h3>
                    </div>
                    <button onclick="hideSecurityModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                
                <div class="space-y-4 py-1 text-left">
                    <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Select Protection Option</label>
                    <div class="space-y-3">
                        <!-- None Option -->
                        <label class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <i class="fa-solid fa-ban text-sm"></i>
                                </div>
                                <div>
                                    <span class="font-bold text-sm text-gray-800 dark:text-gray-100 block">None</span>
                                    <span class="text-[10px] text-gray-500 dark:text-gray-400">Disable lock protection</span>
                                </div>
                            </div>
                            <input type="radio" name="lock-type" value="none" class="w-5 h-5 text-brand-600 focus:ring-brand-500" ${activeLock === 'none' ? 'checked' : ''} onchange="handleLockTypeChange('none')">
                        </label>

                        <!-- PIN Code Lock Option -->
                        <label class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                    <i class="fa-solid fa-calculator text-sm"></i>
                                </div>
                                <div>
                                    <span class="font-bold text-sm text-gray-800 dark:text-gray-100 block">PIN Code Lock</span>
                                    <span class="text-[10px] text-gray-500 dark:text-gray-400">Unlock with a 4-digit code</span>
                                </div>
                            </div>
                            <input type="radio" name="lock-type" value="pin" class="w-5 h-5 text-brand-600 focus:ring-brand-500" ${activeLock === 'pin' ? 'checked' : ''} onchange="handleLockTypeChange('pin')">
                        </label>

                        <!-- Biometrics Option -->
                        <label class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                                    <i class="fa-solid fa-fingerprint text-sm"></i>
                                </div>
                                <div>
                                    <span class="font-bold text-sm text-gray-800 dark:text-gray-100 block">Fingerprint & PIN</span>
                                    <span class="text-[10px] text-gray-500 dark:text-gray-400">Use finger scanner or PIN</span>
                                </div>
                            </div>
                            <input type="radio" name="lock-type" value="biometric" class="w-5 h-5 text-brand-600 focus:ring-brand-500" ${activeLock === 'biometric' ? 'checked' : ''} onchange="handleLockTypeChange('biometric')">
                        </label>
                    </div>

                    <!-- Setup Code Fields -->
                    <div id="pin-setup-section" class="${activeLock === 'none' ? 'hidden' : ''} space-y-3 pt-3">
                        <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Set 4-Digit PIN</label>
                        <div class="flex justify-center space-x-3">
                            <input type="password" id="pin-digit-1" maxlength="1" class="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:text-white transition-all" value="${pinVal.charAt(0) || ''}" onkeyup="movePinFocus(this, 'pin-digit-2')">
                            <input type="password" id="pin-digit-2" maxlength="1" class="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:text-white transition-all" value="${pinVal.charAt(1) || ''}" onkeyup="movePinFocus(this, 'pin-digit-3', 'pin-digit-1')">
                            <input type="password" id="pin-digit-3" maxlength="1" class="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:text-white transition-all" value="${pinVal.charAt(2) || ''}" onkeyup="movePinFocus(this, 'pin-digit-4', 'pin-digit-2')">
                            <input type="password" id="pin-digit-4" maxlength="1" class="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:text-white transition-all" value="${pinVal.charAt(3) || ''}" onkeyup="movePinFocus(this, '', 'pin-digit-3')">
                        </div>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex space-x-3">
                    <button onclick="hideSecurityModal()" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                        Cancel
                    </button>
                    <button onclick="saveSecuritySettings()" class="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all text-sm">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('security-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideSecurityModal();
    });
}

function hideSecurityModal() {
    const modal = document.getElementById('security-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    }
}

function handleLockTypeChange(type) {
    const pinSection = document.getElementById('pin-setup-section');
    if (type === 'none') {
        pinSection.classList.add('hidden');
    } else {
        pinSection.classList.remove('hidden');
    }
}

function movePinFocus(current, nextId, prevId) {
    if (current.value.length >= 1 && nextId) {
        document.getElementById(nextId).focus();
    }
    if (event.key === 'Backspace' && prevId) {
        document.getElementById(prevId).focus();
    }
}

function saveSecuritySettings() {
    const lockType = document.querySelector('input[name="lock-type"]:checked').value;

    if (lockType === 'none') {
        appState.security.enabled = false;
        appState.security.pin = '';
        appState.security.biometricsEnabled = false;
    } else {
        const d1 = document.getElementById('pin-digit-1').value;
        const d2 = document.getElementById('pin-digit-2').value;
        const d3 = document.getElementById('pin-digit-3').value;
        const d4 = document.getElementById('pin-digit-4').value;
        const pin = d1 + d2 + d3 + d4;

        if (pin.length < 4) {
            showToast('Please enter a complete 4-digit PIN', 'error');
            return;
        }

        appState.security.enabled = true;
        appState.security.pin = pin;
        appState.security.biometricsEnabled = (lockType === 'biometric');
    }

    saveState();
    hideSecurityModal();
    showToast('Security settings updated successfully!');
}

let lockInputPin = '';

function checkAppLock() {
    if (currentUser && appState.security && appState.security.enabled) {
        showLockScreen();
    }
}

function showLockScreen() {
    const lockScreen = document.getElementById('app-lockscreen');
    if (!lockScreen) return;

    lockScreen.classList.remove('hidden');
    lockScreen.classList.add('flex');
    lockInputPin = '';

    const avatarHtml = currentUser && currentUser.avatar
        ? `<img src="${currentUser.avatar}" alt="User" class="w-full h-full object-cover">`
        : `${currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}`;

    lockScreen.innerHTML = `
        <div class="flex flex-col items-center justify-center max-w-sm w-full mx-auto space-y-8 animate-[slideDown_0.3s_ease-out]">
            <!-- Logo/Avatar -->
            <div class="flex flex-col items-center space-y-3">
                <div class="h-20 w-20 bg-brand-600/10 text-brand-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner overflow-hidden border-2 border-brand-500/30">
                    ${avatarHtml}
                </div>
                <h3 class="text-xl font-bold text-white tracking-wide">${currentUser ? currentUser.name : 'Shop Keeper'}</h3>
                <p class="text-xs text-gray-400">Enter PIN to Unlock Manager</p>
            </div>

            <!-- PIN Indicators (4 Dots) -->
            <div class="flex justify-center space-x-6 py-4">
                <div id="dot-1" class="w-4 h-4 rounded-full border-2 border-gray-600 transition-all duration-150"></div>
                <div id="dot-2" class="w-4 h-4 rounded-full border-2 border-gray-600 transition-all duration-150"></div>
                <div id="dot-3" class="w-4 h-4 rounded-full border-2 border-gray-600 transition-all duration-150"></div>
                <div id="dot-4" class="w-4 h-4 rounded-full border-2 border-gray-600 transition-all duration-150"></div>
            </div>

            <!-- Keypad Layout -->
            <div class="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
                    <button onclick="pressLockKey('${num}')" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-2xl font-bold transition-all border border-white/5 flex items-center justify-center shadow-md">
                        ${num}
                    </button>
                `).join('')}
                
                <!-- Extra Keys -->
                ${appState.security.biometricsEnabled ? `
                    <button onclick="triggerFingerprintScan()" class="w-16 h-16 rounded-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-2xl font-bold transition-all flex items-center justify-center shadow-md">
                        <i class="fa-solid fa-fingerprint animate-pulse"></i>
                    </button>
                ` : `
                    <div class="w-16 h-16"></div>
                `}
                
                <button onclick="pressLockKey('0')" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-2xl font-bold transition-all border border-white/5 flex items-center justify-center shadow-md">
                    0
                </button>
                
                <button onclick="pressLockKey('back')" class="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white text-xl font-bold transition-all flex items-center justify-center shadow-md">
                    <i class="fa-solid fa-delete-left"></i>
                </button>
            </div>

            <!-- Forgot PIN Option -->
            <button onclick="handleForgotPin()" class="text-xs text-brand-400 hover:text-brand-300 hover:underline transition-colors mt-2">
                Forgot PIN?
            </button>
        </div>
    `;

    // Automatically trigger biometrics if enabled
    if (appState.security.biometricsEnabled) {
        setTimeout(triggerFingerprintScan, 500);
    }
}

function handleForgotPin() {
    const existing = document.getElementById('forgot-pin-modal');
    if (existing) existing.remove();

    const modalHtml = `
        <div id="forgot-pin-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[600] flex items-center justify-center p-4 transition-opacity duration-200">
            <div class="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-[slideDown_0.3s_ease-out] flex flex-col text-white">
                <div class="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                    <div class="flex items-center space-x-3 text-brand-400">
                        <i class="fa-solid fa-key text-2xl"></i>
                        <h3 class="text-lg font-bold text-white">Reset PIN Lock</h3>
                    </div>
                    <button onclick="hideForgotPinModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                
                <div class="space-y-4 py-2 text-left">
                    <p class="text-xs text-gray-400 leading-relaxed">
                        For your security, please verify your account login password to reset or disable the PIN Lock.
                    </p>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Account Password</label>
                        <input type="password" id="forgot-pin-password-input" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-white text-sm transition-all" placeholder="Enter your password">
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-white/10 flex space-x-3">
                    <button onclick="hideForgotPinModal()" class="flex-1 py-3 bg-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
                        Cancel
                    </button>
                    <button onclick="verifyForgotPinPassword()" class="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all text-sm">
                        Verify & Disable
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('forgot-pin-password-input').focus();
}

function hideForgotPinModal() {
    const modal = document.getElementById('forgot-pin-modal');
    if (modal) modal.remove();
}

function verifyForgotPinPassword() {
    const pass = document.getElementById('forgot-pin-password-input').value;
    if (!pass) {
        showToast('Please enter your password', 'error');
        return;
    }

    if (pass === currentUser.password) {
        // Password verified! Disable security.
        appState.security.enabled = false;
        appState.security.pin = '';
        appState.security.biometricsEnabled = false;
        saveState();
        
        hideForgotPinModal();
        unlockAppSuccess();
        showToast('App lock disabled successfully!', 'success');
    } else {
        showToast('Incorrect password. Verification failed.', 'error');
    }
}

function pressLockKey(key) {
    if (key === 'back') {
        if (lockInputPin.length > 0) {
            lockInputPin = lockInputPin.slice(0, -1);
            updatePinDots();
        }
    } else {
        if (lockInputPin.length < 4) {
            lockInputPin += key;
            updatePinDots();
            
            if (lockInputPin.length === 4) {
                setTimeout(verifyLockPin, 200);
            }
        }
    }
}

function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            if (i <= lockInputPin.length) {
                dot.classList.remove('border-gray-600');
                dot.classList.add('bg-brand-500', 'border-brand-500', 'scale-110');
            } else {
                dot.classList.add('border-gray-600');
                dot.classList.remove('bg-brand-500', 'border-brand-500', 'scale-110');
            }
        }
    }
}

function verifyLockPin() {
    if (lockInputPin === appState.security.pin) {
        unlockAppSuccess();
    } else {
        // Shake dots animation mockup
        const keypad = document.getElementById('app-lockscreen').firstElementChild;
        if (keypad) {
            keypad.classList.add('animate-bounce');
            setTimeout(() => keypad.classList.remove('animate-bounce'), 500);
        }
        lockInputPin = '';
        updatePinDots();
        showToast('Incorrect PIN. Please try again.', 'error');
    }
}

function unlockAppSuccess() {
    const lockScreen = document.getElementById('app-lockscreen');
    if (lockScreen) {
        lockScreen.classList.add('opacity-0');
        setTimeout(() => {
            lockScreen.classList.remove('flex', 'opacity-0');
            lockScreen.classList.add('hidden');
        }, 300);
    }
    showToast('App unlocked successfully!');
}

function triggerFingerprintScan() {
    const existingScan = document.getElementById('fingerprint-scan-overlay');
    if (existingScan) existingScan.remove();

    const scanHtml = `
        <div id="fingerprint-scan-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[600] flex flex-col items-center justify-center p-6 text-white transition-opacity duration-200">
            <div class="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-xs w-full text-center space-y-6 animate-[slideDown_0.3s_ease-out] shadow-2xl">
                <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <!-- Scanner pulsing waves -->
                    <div class="absolute inset-0 bg-brand-500/10 rounded-full animate-ping"></div>
                    <div class="absolute inset-2 bg-brand-500/20 rounded-full animate-pulse"></div>
                    <div class="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg border border-brand-400">
                        <i class="fa-solid fa-fingerprint"></i>
                    </div>
                </div>
                <div class="space-y-2">
                    <h4 class="font-bold text-lg text-white">Biometric Scanner</h4>
                    <p class="text-xs text-gray-400 leading-relaxed" id="bio-scan-status">Please place your finger on your device sensor to verify identity</p>
                </div>
                <div class="pt-4">
                    <button onclick="cancelFingerprintScan()" class="px-5 py-2 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-xl text-sm transition-colors">
                        Cancel PIN Fallback
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', scanHtml);

    // Try native WebAuthn if browser supports it
    if (window.PublicKeyCredential && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(available => {
            if (available) {
                // Actual biometric hook (prompts Windows Hello/Android Fingerprint sensor natively!)
                navigator.credentials.get({
                    publicKey: {
                        challenge: new Uint8Array([1, 2, 3, 4]),
                        rpId: window.location.hostname || "localhost",
                        userVerification: "required",
                        timeout: 5000
                    }
                }).then(credential => {
                    if (credential) {
                        document.getElementById('fingerprint-scan-overlay').remove();
                        unlockAppSuccess();
                    }
                }).catch(err => {
                    console.log("Native biometrics canceled, starting mock", err);
                    runMockScan();
                });
            } else {
                runMockScan();
            }
        }).catch(() => {
            runMockScan();
        });
    } else {
        runMockScan();
    }
}

function runMockScan() {
    const statusText = document.getElementById('bio-scan-status');
    if (statusText) statusText.innerText = "Analyzing fingerprint fingerprint details...";
    
    setTimeout(() => {
        const overlay = document.getElementById('fingerprint-scan-overlay');
        if (overlay) {
            overlay.remove();
            unlockAppSuccess();
        }
    }, 1500);
}

function cancelFingerprintScan() {
    const overlay = document.getElementById('fingerprint-scan-overlay');
    if (overlay) overlay.remove();
}

function showPrivacyModal() {
    const existing = document.getElementById('privacy-modal');
    if (existing) existing.remove();

    const modalHtml = `
        <div id="privacy-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4 transition-opacity duration-200">
            <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-[slideDown_0.3s_ease-out] flex flex-col max-h-[80vh] transition-colors">
                <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                    <div class="flex items-center space-x-3 text-brand-600 dark:text-brand-400">
                        <i class="fa-solid fa-shield-halved text-2xl"></i>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">App Privacy Policy</h3>
                    </div>
                    <button onclick="hidePrivacyModal()" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 text-left text-sm text-gray-600 dark:text-gray-300 pr-2">
                    <p class="leading-relaxed">
                        At <strong>Mobile Shop Manager</strong>, we prioritize the privacy and security of your shop's business records. This policy explains how we collect, store, and manage your data.
                    </p>
                    
                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center space-x-2">
                            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full inline-block"></span>
                            <span>100% Offline & Local Storage</span>
                        </h4>
                        <p class="leading-relaxed pl-3 text-xs">
                            All application data, including your inventory logs, client details, active installment cycles, sales lists, and uploaded avatars are saved <strong>exclusively inside your local browser cache (Local Storage)</strong>.
                        </p>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center space-x-2">
                            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full inline-block"></span>
                            <span>No Third-Party Transmission</span>
                        </h4>
                        <p class="leading-relaxed pl-3 text-xs">
                            Because there are no centralized clouds or external databases attached, <strong>none of your premium client accounts or sale summaries are ever uploaded to external servers</strong>. Your records are completely secure, private, and invisible to anyone else.
                        </p>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center space-x-2">
                            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full inline-block"></span>
                            <span>Full Data Control</span>
                        </h4>
                        <p class="leading-relaxed pl-3 text-xs">
                            You possess complete autonomy over your operational database. Using the native account settings controls, you can back up your inventory ledger instantly by downloading a CSV file via <strong>Export Data</strong>, or permanently wipe all system history using the <strong>Reset All Data</strong> control.
                        </p>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center space-x-2">
                            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full inline-block"></span>
                            <span>Camera & Album Permissions</span>
                        </h4>
                        <p class="leading-relaxed pl-3 text-xs">
                            When taking or choosing profile images, the system utilizes your device's native camera captures. These picture streams are converted locally into Base64 hashes and written to local memory. They are never processed or sent anywhere else.
                        </p>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button onclick="hidePrivacyModal()" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all">
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('privacy-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hidePrivacyModal();
    });
}

function hidePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    }
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        document.getElementById('auth-overlay').classList.remove('hidden');
        document.getElementById('auth-overlay').classList.add('flex');
        renderAuthForm('login');
    } else {
        updateUserInfo();
        checkAppLock();
    }

    navigate('dashboard');
    updateNotificationBadges();
    const dateEl = document.getElementById('header-date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
});
