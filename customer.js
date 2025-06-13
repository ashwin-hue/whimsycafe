document.addEventListener('DOMContentLoaded', async () => {
    // Load drinks from server
    const response = await fetch('/api/drinks');
    const drinks = await response.json();

    const drinksContainer = document.getElementById('drinks-container');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.querySelector('.close');
    const floatingCart = document.getElementById('floating-cart');
    const cartSection = document.getElementById('cart');
    const closeCartBtn = document.getElementById('close-cart');
    const toast = document.getElementById('toast');

    let cart = [];

    // Display drinks
    drinks.forEach(drink => {
        const drinkElement = document.createElement('div');
        drinkElement.className = 'drink';
        drinkElement.innerHTML = `
            <img src="${drink.imageUrl}" alt="${drink.name}" loading="lazy">
            <h3>${drink.name}</h3>
            <p>${drink.description}</p>
            <span class="price">₹${drink.price.toFixed(2)}</span>
            <button class="add-to-cart" data-id="${drink._id}">
                <i class="fas fa-plus"></i> Add to Order
            </button>
        `;
        drinksContainer.appendChild(drinkElement);
    });

    // Add to cart
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const drinkId = e.target.getAttribute('data-id');
            const drink = drinks.find(d => d._id === drinkId);
            cart.push(drink);
            updateCart();
            showToast(`${drink.name} added to your order!`);
        }
    });

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>₹${item.price.toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItem);
            total += item.price;
        });

        cartTotal.textContent = total.toFixed(2);
        document.querySelector('.cart-count').textContent = cart.length;

        floatingCart.style.display = cart.length > 0 ? 'flex' : 'none';
    }

    function showToast(message) {
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    floatingCart.addEventListener('click', () => {
        cartSection.classList.toggle('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSection.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        modal.style.display = 'flex';
        cartSection.classList.remove('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const order = {
            customerName: form[0].value,
            phone: form[1].value,
            address: form[2].value,
            items: cart,
            total: parseFloat(cartTotal.textContent),
            date: new Date()
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });

            if (response.ok) {
                showToast('Order placed successfully! We will confirm soon.');
                cart = [];
                updateCart();
                modal.style.display = 'none';
                form.reset();
            }
        } catch (err) {
            console.error('Error placing order:', err);
            showToast('Error placing order. Please try again.');
        }
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ✅ HAMBURGER MENU LOGIC
    const hamburger = document.getElementById("hamburg-menu");
    const mobileMenu = document.getElementById("hm-links");

    hamburger.addEventListener("click", () => {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle("active");

        // Change icon
        hamburger.innerHTML = mobileMenu.classList.contains("active")
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu if click outside
    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove("active");
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});
