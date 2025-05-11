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
  }

  clearCart() {
    this.cart = [];
    sessionStorage.removeItem(STORAGE_KEYS.CART);
    this.updateDisplay();
    this.updateCartCount();
  }

  calculateTotal() {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
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
        alert('Item added to the cart');
      });
    });

    // Cart button
    const cartBtn = document.querySelector('.cart-button');
    cartBtn?.addEventListener('click', () => {
      const modal = document.getElementById('cartModal');
      this.cart = this.loadCart();
      this.updateDisplay();
      modal.style.display = 'block';
    });

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