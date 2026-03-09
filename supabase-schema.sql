-- supabase-schema.sql
-- Paste this file contents into your Supabase SQL Editor to initialize your database!

-- 1. Create table for Food Items
CREATE TABLE IF NOT EXISTS public.food_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT NOT NULL, -- 'veg' or 'nonveg'
    category TEXT NOT NULL,
    image TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    badges TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Kaatha Users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    aadhar_url TEXT,
    kaatha_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    credit_limit NUMERIC DEFAULT 0,
    balance NUMERIC DEFAULT 0, -- Amount they owe
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'completed',
    payment_method TEXT NOT NULL, -- 'online', 'cash', 'kaatha'
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) - FOR PROTOTYPE WE ALLOW ALL
-- In a real app, you would restrict these significantly.
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on food_items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on food_items" ON public.food_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete on food_items" ON public.food_items FOR DELETE USING (true);
CREATE POLICY "Allow anon update on food_items" ON public.food_items FOR UPDATE USING (true);

CREATE POLICY "Allow anon select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on users" ON public.users FOR DELETE USING (true);

CREATE POLICY "Allow anon select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on orders" ON public.orders FOR DELETE USING (true);

-- 5. Seed some data for Food Items
INSERT INTO public.food_items (name, price, type, category, image, description, is_active, badges) VALUES 
('Crispy French Fries', 89, 'veg', 'starters', 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Classic salted potato fries, crispy on the outside and fluffy inside.', true, '{"Best Seller"}'),
('Chicken Wings (6 Pcs)', 159, 'nonveg', 'starters', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Deep-fried chicken wings tossed in our signature spicy sauce.', true, '{"🔥 Popular"}'),
('Paneer Tikka', 250, 'veg', 'starters', 'https://images.unsplash.com/photo-1599487405620-8e1008cb04db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Charcoal-grilled cottage cheese marinated in Indian spices.', true, '{"Chef Recommended"}'),
('Hyderabadi Chicken Dum Biryani', 140, 'nonveg', 'biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Authentic slow-cooked aromatic basmati rice layered with marinated chicken.', true, '{"Best Seller", "Chef Recommended"}');
