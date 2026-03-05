const foodData = [
  {
    id: 1,
    name: "Crispy French Fries",
    price: 89,
    type: "veg",
    category: "starters",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Classic salted potato fries, crispy on the outside and fluffy inside.",
    badges: ["Best Seller"]
  },
  {
    id: 2,
    name: "Chicken Wings (6 Pcs)",
    price: 159,
    type: "nonveg",
    category: "starters",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Deep-fried chicken wings tossed in our signature spicy sauce.",
    badges: ["🔥 Popular"]
  },
  {
    id: 3,
    name: "Paneer Tikka",
    price: 250,
    type: "veg",
    category: "starters",
    image: "https://images.unsplash.com/photo-1599487405620-8e1008cb04db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Charcoal-grilled cottage cheese marinated in Indian spices.",
    badges: ["Chef Recommended"]
  },
  {
    id: 4,
    name: "Veg Manchurian",
    price: 150,
    type: "veg",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Crispy vegetable balls tossed in dark soy and garlic sauce.",
    badges: []
  },
  {
    id: 5,
    name: "Chicken 65",
    price: 200,
    type: "nonveg",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Spicy, deep-fried chicken bites with curry leaves and green chilies.",
    badges: ["🔥 Spicy"]
  },
  {
    id: 6,
    name: "Double Egg Maggi",
    price: 90,
    type: "nonveg",
    category: "street food",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Classic street-style Maggi noodles enriched with double egg scramble.",
    badges: []
  },
  {
    id: 7,
    name: "The Chicken Pasta",
    price: 100,
    type: "nonveg",
    category: "street food",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Penne pasta cooked with tender chicken pieces in a creamy, spicy sauce.",
    badges: []
  },
  {
    id: 8,
    name: "Hyderabadi Chicken Dum Biryani",
    price: 140,
    type: "nonveg",
    category: "biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Authentic slow-cooked aromatic basmati rice layered with marinated chicken.",
    badges: ["Best Seller", "Chef Recommended"]
  },
  {
    id: 9,
    name: "Hyderabadi Veg Dum Biryani",
    price: 150,
    type: "veg",
    category: "biryani",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Flavor-packed rice preparation layered with mixed vegetables and spices.",
    badges: []
  },
  {
    id: 10,
    name: "Spicy Chicken Burger",
    price: 180,
    type: "nonveg",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Juicy grilled chicken patty with our secret spicy sauce, fresh lettuce and tomatoes.",
    badges: ["New"]
  },
  {
    id: 11,
    name: "Crispy Veggie Burger",
    price: 130,
    type: "veg",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Crunchy potato and peas patty topped with cheese and eggless mayo.",
    badges: []
  },
  {
    id: 12,
    name: "Chicken Tikka Roll",
    price: 120,
    type: "nonveg",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Succulent chicken tikka wrapped in a soft roomali roti with mint chutney.",
    badges: ["🔥 Popular"]
  },
  {
    id: 13,
    name: "Chocolate Lava Cake",
    price: 110,
    type: "veg",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Warm chocolate cake with a gooey, molten chocolate center.",
    badges: ["Limited Offer"]
  },
  {
    id: 14,
    name: "Mango Lassi",
    price: 80,
    type: "veg",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1546889814-232120e2eaf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Refreshing yogurt-based drink blended with sweet tropical mangoes.",
    badges: []
  },
  {
    id: 15,
    name: "Chicken Pepperoni Pizza",
    price: 299,
    type: "nonveg",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Classic pizza topped with mozzarella cheese and spicy chicken pepperoni slices.",
    badges: ["Best Seller"]
  },
  {
    id: 16,
    name: "Farmhouse Margherita",
    price: 249,
    type: "veg",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a30536?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Loaded with fresh bell peppers, onions, tomatoes, and gooey cheese.",
    badges: []
  },
  {
    id: 17,
    name: "Kadai Paneer",
    price: 220,
    type: "veg",
    category: "street food",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Cottage cheese cooked with bell peppers in a freshly ground spicy masala.",
    badges: []
  },
  {
    id: 18,
    name: "Butter Chicken Masala",
    price: 230,
    type: "nonveg",
    category: "street food",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82bea3d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Tender chicken cooked in a rich, creamy, and mildly sweet tomato gravy.",
    badges: ["Chef Recommended"]
  },
  {
    id: 19,
    name: "Golden Prawns",
    price: 280,
    type: "nonveg",
    category: "starters",
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Batter-fried crispy prawns served with sweet chili dip.",
    badges: ["Premium"]
  },
  {
    id: 20,
    name: "Tandoori Chicken (Half)",
    price: 250,
    type: "nonveg",
    category: "starters",
    image: "https://images.unsplash.com/photo-1599487405620-8e1008cb04db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Classic bone-in chicken marinated in yogurt and spices, roasted in a clay oven.",
    badges: ["🔥 Popular"]
  }
];

window.appFoodData = foodData;
