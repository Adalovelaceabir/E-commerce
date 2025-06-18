// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation.",
        price: 99.99,
        image: "https://via.placeholder.com/300x300?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Feature-rich smartwatch with fitness tracking.",
        price: 199.99,
        image: "https://via.placeholder.com/300x300?text=Smartwatch"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        description: "Portable speaker with 20-hour battery life.",
        price: 79.99,
        image: "https://via.placeholder.com/300x300?text=Speaker"
    },
    {
        id: 4,
        name: "Laptop Backpack",
        description: "Durable backpack with USB charging port.",
        price: 49.99,
        image: "https://via.placeholder.com/300x300?text=Backpack"
    },
    {
        id: 5,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with silent clicks.",
        price: 29.99,
        image: "https://via.placeholder.com/300x300?text=Mouse"
    },
    {
        id: 6,
        name: "External Hard Drive",
        description: "1TB portable hard drive with USB 3.0.",
        price: 59.99,
        image: "https://via.placeholder.com/300x300?text=Hard+Drive"
    }
];

// Shopping cart
let cart = [];

// DOM elements
const productGrid = document.querySelector('.product-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const checkoutBtn = document.querySelector('.checkout-btn');

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        
        updateCart();
    }
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
    } else {
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Add to cart button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    // Close cart
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Click outside cart to close
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Cart item interactions
    cartItems.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id') || 
                          e.target.parentElement.getAttribute('data-id'));
        
        if (e.target.classList.contains('remove-item') || 
            e.target.parentElement.classList.contains('remove-item')) {
            removeFromCart(productId);
        } else if (e.target.classList.contains('minus')) {
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity - 1);
        } else if (e.target.classList.contains('plus')) {
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity + 1);
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your purchase!');
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty!');
        }
    });
});