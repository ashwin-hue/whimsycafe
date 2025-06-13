document.addEventListener('DOMContentLoaded', async () => {
    // Login functionality
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUserDisplay = document.getElementById('currentUser');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        loginModal.style.display = 'flex';
    } else {
        loginModal.style.display = 'none';
        currentUserDisplay.textContent = 'Admin';
    }
    
    // Login handler
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in real app, use proper authentication)
        if (username === 'admin' && password === 'whimsy123') {
            localStorage.setItem('isLoggedIn', 'true');
            loginModal.style.display = 'none';
            currentUserDisplay.textContent = 'Admin';
            loadOrders();
        } else {
            alert('Invalid credentials.');
        }
    });
    
    // Logout handler
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        loginModal.style.display = 'flex';
        currentUserDisplay.textContent = 'Not logged in';
    });
    
    // Manual refresh
    refreshBtn.addEventListener('click', () => {
        loadOrders();
    });
    
    const ordersContainer = document.getElementById('orders-container');
    
    async function loadOrders() {
        if (localStorage.getItem('isLoggedIn') !== 'true') return;
        
        try {
            // Show loading state
            ordersContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading orders...</div>';
            
            const response = await fetch('https://whimsy-api.onrender.com/api/orders');
            const orders = await response.json();
            
            ordersContainer.innerHTML = '';
            
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>No current orders</p>';
                return;
            }
            
            orders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order';
                orderElement.innerHTML = `
                    <div class="order-header">
                        <h3>Order #${order._id.toString().slice(-6)}</h3>
                        <span>${new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div class="order-details">
                        <p><strong><i class="fas fa-user"></i> Customer:</strong> ${order.customerName}</p>
                        <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${order.phone}</p>
                        <p><strong><i class="fas fa-map-marker-alt"></i> Address:</strong> ${order.address}</p>
                    </div>
                    <div class="order-items">
                        <h4><i class="fas fa-utensils"></i> Items:</h4>
                      <ul>
                          ${(Array.isArray(order.items) ? order.items : []).map(item => 
                          `<li>${item.name || 'Unnamed item'} - ₹${(item.price ?? 0).toFixed(2)}</li>`
                          ).join('')}
                      </ul>


                    </div>
                    <div class="order-total">
                       <strong>Total:</strong> ₹${(order.total ?? 0).toFixed(2)}
                    </div>
                    <button class="complete-btn" data-id="${order._id}">
                        <i class="fas fa-check-circle"></i> Order Complete
                    </button>
                `;
                ordersContainer.appendChild(orderElement);
            });
        } catch (error) {
            console.error('Error loading orders:', error);
            ordersContainer.innerHTML = '<p class="error">Error loading orders. Please try again.</p>';
        }
    }
    
    // Complete order
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('complete-btn') || e.target.closest('.complete-btn')) {
            const button = e.target.classList.contains('complete-btn') ? e.target : e.target.closest('.complete-btn');
            const orderId = button.getAttribute('data-id');
            
            try {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                button.disabled = true;
                
                const response = await fetch(`https://whimsy-api.onrender.com/api/orders/${orderId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    // Add animation to removed order
                    const orderElement = button.closest('.order');
                    orderElement.style.transform = 'translateX(100%)';
                    orderElement.style.opacity = '0';
                    orderElement.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        loadOrders();
                    }, 300);
                }
            } catch (err) {
                console.error('Error completing order:', err);
                button.innerHTML = '<i class="fas fa-check-circle"></i> Order Complete';
                button.disabled = false;
                alert('Error completing order. Please try again.');
            }
        }
    });
    
    // Load orders initially and refresh every 30 seconds
    if (isLoggedIn) {
        loadOrders();
        setInterval(loadOrders, 30000);
    }
    
    // Add new order button (placeholder functionality)
    document.getElementById('addOrderBtn').addEventListener('click', () => {
        alert('Add new order functionality would go here');
    });
});
