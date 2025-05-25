// Constants
const STORAGE_KEYS = {
  CART: 'cartItems',
  CONTACTS: 'contacts'
};

// Cart Management Class
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.initializeEventListeners();
    this.updateCartCount();
  }

  loadCart() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CART) || '[]');
  }

  saveCart() {
    sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
  }

  addItem(product) {
    this.cart.push(product);
    this.saveCart();
    this.updateDisplay();
    this.updateCartCount();
    
    // Update cart iframe if it exists
    const cartIframe = document.getElementById('cartIframe');
    if (cartIframe && cartIframe.contentWindow) {
      cartIframe.contentWindow.postMessage('updateCart', '*');
    }
  }

  clearCart() {
    this.cart.clear();
    sessionStorage.clear();
    this.updateDisplay();
    this.updateCartCount();
    this.saveCart();

  }

  calculateTotal() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount.textContent !== undefined) {
      cartCount.textContent = this.cart.length;
    }
  }

  updateDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = this.cart
      .map(item => `<p>${item.name} - $${item.price}</p>`)
      .join('');

    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
      totalElement.textContent = this.calculateTotal().toFixed(2);
    }
  }

  initializeEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', () => {
        const product = {
          name: button.dataset.product,
          price: parseFloat(button.dataset.price)
        };
        this.addItem(product);
        
        // Preload the iframe when an item is added to ensure it's ready
        const cartIframe = document.getElementById('cartIframe');
        if (cartIframe) {
          // Force iframe reload to ensure it has the latest cart data
          cartIframe.src = cartIframe.src;
        }
        
        alert('Item added to the cart');
      });
    });

    // Cart button - Show iframe instead of modal
    const cartBtn = document.querySelector('.cart-button');
    cartBtn?.addEventListener('click', () => {
      // Show iframe container
      const iframeContainer = document.getElementById('cartIframeContainer');
      iframeContainer.style.display = 'flex';
      
      // Notify iframe to update cart
      const cartIframe = document.getElementById('cartIframe');
      if (cartIframe.contentWindow) {
        cartIframe.contentWindow.postMessage('updateCart', '*');
      }
    });

    // Close iframe button
    const closeIframeBtn = document.getElementById('closeIframe');
    closeIframeBtn?.addEventListener('click', () => {
      document.getElementById('cartIframeContainer').style.display = 'none';
    });

    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
      if (event.data === 'cartUpdated') {
        // Update cart count when cart is updated from iframe
        sessionStorage.removeItem(STORAGE_KEYS.CART);
        this.cart = this.loadCart(); // Reload cart data from storage
        this.updateCartCount();
        
        // Double-check that the cart count is updated correctly
        const cartCount = document.querySelector('.cart-count');
        if (cartCount && this.cart.length === 0) {
          cartCount.textContent = '0';
        }
      } else if (event.data === 'closeCart') {
        // Close iframe when order is processed
        this.cart = this.loadCart(); // Reload cart data from storage
        this.updateCartCount();
        
        // Double-check that the cart count is updated correctly
        const cartCount = document.querySelector('.cart-count');
        if (cartCount && this.cart.length === 0) {
          cartCount.textContent = '0';
        }
        
        document.getElementById('cartIframeContainer').style.display = 'none';
      }
    });

    // For backward compatibility - keep modal functionality
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    clearCartBtn?.addEventListener('click', () => {
      if (this.cart.length === 0) {
        alert('No items to clear');
        return;
      }
      this.clearCart();
      alert('Cart cleared');
      document.getElementById('cartModal').style.display = 'none';
    });

    // Process order button
    const processOrderBtn = document.getElementById('processOrderBtn');
    processOrderBtn?.addEventListener('click', () => {
      if (this.cart.length === 0) {
        alert('Cart is empty');
        return;
      }
      alert('Thank you for your order');
      this.clearCart();
      document.getElementById('cartModal').style.display = 'none';
    });
    
    // View Cart button in gallery page
    const viewCartBtn = document.getElementById('viewCartBtn');
    viewCartBtn?.addEventListener('click', () => {
      // Show iframe container
      const iframeContainer = document.getElementById('cartIframeContainer');
      iframeContainer.style.display = 'flex';
      
      // Notify iframe to update cart
      const cartIframe = document.getElementById('cartIframe');
      if (cartIframe.contentWindow) {
        cartIframe.contentWindow.postMessage('updateCart', '*');
      }
    });
  }
}

// Newsletter Management Class
class NewsletterManager {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput.value) {
          alert('Thank you for subscribing');
          emailInput.value = '';
        }
      });
    });
  }
}

// Contact Form Management Class
class ContactFormManager {
  constructor() {
    this.initializeEventListeners();
  }

  saveContact(formData) {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    contacts.push(formData);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }

  initializeEventListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value,
          timestamp: new Date().toISOString()
        };
        
        this.saveContact(formData);
        alert('Thank you for your message');
        contactForm.reset();
      });
    }
  }
}

// Modal Management Class
class ModalManager {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('cartModal');
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}

// Initialize all managers
document.addEventListener('DOMContentLoaded', () => {
  new CartManager();
  new NewsletterManager();
  new ContactFormManager();
  new ModalManager();
});
