// js/db.js
// This file acts as an abstraction over our database. 
// It uses Supabase if configured, otherwise falls back to localStorage for a seamless testing experience.

const LOCAL_STORAGE_KEY = 'street_spicy_db';

// Default initial data for dummy database
const defaultFoodData = [
    { id: 1, name: "Crispy French Fries", price: 89, type: "veg", category: "starters", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Classic salted potato fries, crispy on the outside and fluffy inside.", is_active: true, badges: ["Best Seller"] },
    { id: 2, name: "Chicken Wings (6 Pcs)", price: 159, type: "nonveg", category: "starters", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Deep-fried chicken wings tossed in our signature spicy sauce.", is_active: true, badges: ["🔥 Popular"] },
    { id: 3, name: "Paneer Tikka", price: 250, type: "veg", category: "starters", image: "https://images.unsplash.com/photo-1599487405620-8e1008cb04db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Charcoal-grilled cottage cheese marinated in Indian spices.", is_active: true, badges: ["Chef Recommended"] },
    { id: 8, name: "Hyderabadi Chicken Dum Biryani", price: 140, type: "nonveg", category: "biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Authentic slow-cooked aromatic basmati rice layered with marinated chicken.", is_active: true, badges: ["Best Seller", "Chef Recommended"] },
    { id: 10, name: "Spicy Chicken Burger", price: 180, type: "nonveg", category: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Juicy grilled chicken patty with our secret spicy sauce, fresh lettuce and tomatoes.", is_active: true, badges: ["New"] },
];

class DatabaseService {
    constructor() {
        this.supabase = window.supabaseClient; // Set in supabase-config.js if available
        this.useLocal = !this.supabase;

        if (this.useLocal) {
            this.initLocalDb();
        }
    }

    initLocalDb() {
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
            const initialDb = {
                food_items: defaultFoodData,
                users: [
                    // Dummy User with Kaatha
                    { id: 'u1', phone_number: '9876543210', name: 'John Doe', aadhar_url: 'dummy.jpg', kaatha_status: 'approved', credit_limit: 5000, balance: 450, created_at: new Date().toISOString() },
                    { id: 'u2', phone_number: '9999999999', name: 'Jane Smith', aadhar_url: 'dummy2.jpg', kaatha_status: 'pending', credit_limit: 0, balance: 0, created_at: new Date().toISOString() }
                ],
                orders: [
                    { id: 1, user_id: 'u1', total_amount: 450, status: 'completed', payment_method: 'kaatha', items: [{ name: "Paneer Tikka", qty: 1 }], created_at: new Date().toISOString() }
                ]
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDb));
        }
    }

    getLocalDb() {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    }

    saveLocalDb(data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }

    // --- FOOD ITEMS --- //
    async getFoodItems() {
        if (this.useLocal) {
            return this.getLocalDb().food_items;
        } else {
            const { data, error } = await this.supabase.from('food_items').select('*').order('id', { ascending: true });
            if (error) throw error;
            return data;
        }
    }

    async addFoodItem(item) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            const newItem = {
                ...item,
                id: Date.now(),
                is_active: item.is_active !== undefined ? item.is_active : true,
                badges: item.badges || [],
            };
            db.food_items.push(newItem);
            this.saveLocalDb(db);
            return newItem;
        } else {
            const { data, error } = await this.supabase.from('food_items').insert([item]).select();
            if (error) throw error;
            return data[0];
        }
    }

    async updateFoodItem(id, updates) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            const index = db.food_items.findIndex(i => i.id == id);
            if (index !== -1) {
                db.food_items[index] = { ...db.food_items[index], ...updates };
                this.saveLocalDb(db);
                return db.food_items[index];
            }
        } else {
            const { data, error } = await this.supabase.from('food_items').update(updates).eq('id', id).select();
            if (error) throw error;
            return data[0];
        }
    }

    async deleteFoodItem(id) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            db.food_items = db.food_items.filter(i => i.id != id);
            this.saveLocalDb(db);
            return true;
        } else {
            const { error } = await this.supabase.from('food_items').delete().eq('id', id);
            if (error) throw error;
            return true;
        }
    }

    // --- KAATHA / USERS --- //
    async getUsers() {
        if (this.useLocal) return this.getLocalDb().users;
        const { data, error } = await this.supabase.from('users').select('*');
        if (error) throw error;
        return data;
    }

    async getUserByPhone(phone) {
        if (this.useLocal) {
            return this.getLocalDb().users.find(u => u.phone_number === phone);
        }
        const { data, error } = await this.supabase.from('users').select('*').eq('phone_number', phone).single();
        if (error && error.code !== 'PGRST116') throw error; // ignore not found
        return data;
    }

    async createUser(user) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            const newUser = {
                ...user,
                id: 'u_' + Date.now(),
                kaatha_status: 'pending',
                credit_limit: 0,
                balance: 0,
                created_at: new Date().toISOString()
            };
            db.users.push(newUser);
            this.saveLocalDb(db);
            return newUser;
        } else {
            const { data, error } = await this.supabase.from('users').insert([{
                ...user, kaatha_status: 'pending'
            }]).select();
            if (error) throw error;
            return data[0];
        }
    }

    async updateUser(id, updates) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            const index = db.users.findIndex(u => u.id == id);
            if (index !== -1) {
                db.users[index] = { ...db.users[index], ...updates };
                this.saveLocalDb(db);
                return db.users[index];
            }
        } else {
            const { data, error } = await this.supabase.from('users').update(updates).eq('id', id).select();
            if (error) throw error;
            return data[0];
        }
    }

    // --- ORDERS --- //
    async getOrders() {
        if (this.useLocal) return this.getLocalDb().orders;
        const { data, error } = await this.supabase.from('orders').select('*, users(name, phone_number)').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async createOrder(order) {
        if (this.useLocal) {
            const db = this.getLocalDb();
            const newOrder = {
                ...order,
                id: Date.now(),
                created_at: new Date().toISOString()
            };
            db.orders.push(newOrder);

            // If payment method is kaatha, update user balance
            if (order.payment_method === 'kaatha' && order.user_id) {
                const userIndex = db.users.findIndex(u => u.id === order.user_id);
                if (userIndex !== -1) {
                    db.users[userIndex].balance += order.total_amount;
                }
            }

            this.saveLocalDb(db);
            return newOrder;
        } else {
            const { data, error } = await this.supabase.from('orders').insert([order]).select();
            if (error) throw error;

            if (order.payment_method === 'kaatha' && order.user_id) {
                // Fetch current user
                const { data: userData } = await this.supabase.from('users').select('balance').eq('id', order.user_id).single();
                if (userData) {
                    await this.supabase.from('users').update({ balance: userData.balance + order.total_amount }).eq('id', order.user_id);
                }
            }
            return data[0];
        }
    }
}

window.db = new DatabaseService();
