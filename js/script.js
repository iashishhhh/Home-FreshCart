document.addEventListener('DOMContentLoaded', function () {
  // Handling heart icon click
  const heartBadge = document.getElementById('heartBadge');
  const heartIcons = document.querySelectorAll('#cardHeartIcon');
  let likedCount = 0;
  let wishlistItems = []; // Array to store liked items

  heartIcons.forEach((heartIcon) => {
    heartIcon.addEventListener('click', () => {
      const productCard = heartIcon.closest('.card-body');
      
      // Ensure that the productCard exists
      const productNameElement = productCard?.querySelector('.cardheading a');
      const productName = productNameElement ? productNameElement.textContent.trim() : 'Unknown Product';
      
      const productPriceText = productCard.querySelector('.text-dark').textContent.trim();
      const productImage = productCard.querySelector('img').src;

      const price = parseFloat(productPriceText.replace('$', '').replace(',', '').trim());

      // Check if the product is already in the wishlist
      const existingProductIndex = wishlistItems.findIndex((item) => item.name === productName);

      if (!heartIcon.classList.contains('liked')) {
        heartIcon.classList.add('liked');
        likedCount++;

        if (existingProductIndex === -1) {
          wishlistItems.push({ name: productName, price, image: productImage });
        }
      } else {
        heartIcon.classList.remove('liked');
        likedCount--;

        if (existingProductIndex > -1) {
          wishlistItems.splice(existingProductIndex, 1);
        }
      }

      heartBadge.textContent = likedCount;
      heartBadge.style.display = likedCount > 0 ? 'inline' : 'none';

      updateWishlistModal(); 
    });
  });

  heartBadge.style.display = 'none';

  function updateWishlistModal() {
    const wishlistBody = document.querySelector('.wishlist-modal-body');
    wishlistBody.innerHTML = ''; // Clear current wishlist items

    if (wishlistItems.length === 0) {
      wishlistBody.innerHTML = `<p class="text-danger text-center">Your wishlist is empty!</p>`;
    } else {
      wishlistItems.forEach((item, index) => {
        const productHTML = `
          <div class="modal-body wishlist-modal-body">
            <div class="col-12 mb-3">
              <div class="row align-items-center">
                <!-- Product Image -->
                <div class="col-auto">
                  <img src="${item.image}" alt="${item.name}" class="wishlist-item-image img-fluid"
                    style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <!-- Product Name -->
                <div class="col text-center">
                  <p class="m-0 fw-bold">${item.name}</p>
                </div>
                <!-- Product Price -->
                <div class="col">
                  <p class="m-0 text-primary fw-semibold">$${item.price.toFixed(2)}</p>
                </div>
                <!-- Buttons -->
                <div class="col">
                  <div class="d-flex justify-content-end gap-3 w-100">
                    <button class="btn btn-sm add-to-cart py-2 px-3 text-white bg-success" data-index="${index}">Add to Cart</button>
                    <button class="btn btn-sm remove-from-wishlist py-2 px-3 text-white bg-danger" data-index="${index}">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        wishlistBody.insertAdjacentHTML('beforeend', productHTML);
      });
    }

    // Add event listeners for remove and add to cart buttons
    const removeButtons = wishlistBody.querySelectorAll('.remove-from-wishlist');
    removeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        wishlistItems.splice(index, 1); // Remove the item from the wishlist
        updateWishlistModal(); // Update the modal
      });
    });

    const addToCartButtons = wishlistBody.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        const item = wishlistItems[index];
        addItemToCart(item); // Add the item to the cart
      });
    });
  }

  // Add item to cart
  const cartBadge = document.getElementById('cart-badge');
  const addToCartButtons = document.querySelectorAll('.btn-success');
  let cartItems = [];

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Check if button is inside wishlist modal
      const isWishlistButton = button.classList.contains('add-to-cart');
      if (isWishlistButton) {
        // Get item directly from wishlistItems array using button's data-index
        const index = button.dataset.index;
        const item = wishlistItems[index];
        if (item) {
          addItemToCart(item);
        }
        return;
      }

      // Regular product card handling
      const productCard = button.closest('.card-body');
      if (!productCard) {
        // console.warn('Product card not found');
        return;
      }

      const productNameElement = productCard.querySelector('.cardheading a');
      if (!productNameElement) {
        console.warn('Product name element not found');
        return;
      }
      const productName = productNameElement.textContent.trim();

      const priceElement = productCard.querySelector('.text-dark');
      if (!priceElement) {
        console.warn('Price element not found');
        return;
      }
      const productPriceText = priceElement.textContent.trim();

      const imageElement = productCard.querySelector('img');
      if (!imageElement) {
        console.warn('Image element not found');
        return;
      }
      const productImage = imageElement.src;

      const price = parseFloat(productPriceText.replace('$', '').replace(',', '').trim());

      const existingProductIndex = cartItems.findIndex((item) => item.name === productName);
      if (existingProductIndex > -1) {
        cartItems[existingProductIndex].quantity++;
      } else {
        const product = { name: productName, price, quantity: 1, image: productImage };
        cartItems.push(product);
      }

      cartBadge.textContent = cartItems.length;
      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    const offcanvasBody = document.querySelector('.offcanvas-body');
    offcanvasBody.innerHTML = '';

    if (cartItems.length === 0) {
      offcanvasBody.innerHTML = `<p class="text-danger text-center">Your shopping cart is empty!</p>`;
    } else {
      let grandTotal = 0;

      cartItems.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        grandTotal += totalPrice;

        const productHTML = `
          <div class="d-flex justify-content-between align-items-center cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 100px; object-fit: cover; margin-right: 10px;">
            <div class="d-flex flex-column">
              <p>${item.name}</p>
              <p class="price text-center" data-price="${item.price}">$${item.price.toFixed(2)}</p>
              <div class="text-center">
                <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">+</button>
              </div>
            </div>
            <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
          </div>
        `;
        offcanvasBody.insertAdjacentHTML('beforeend', productHTML);
      });

      offcanvasBody.insertAdjacentHTML(
        'beforeend',
        `<div class="mt-auto text-end">Grand Total: <strong class="text-success">$${grandTotal.toFixed(2)}</strong></div>`
      );

      const removeButtons = offcanvasBody.querySelectorAll('.remove-item');
      removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index;
          cartItems.splice(index, 1);
          updateCartDisplay();
          cartBadge.textContent = cartItems.length;
        });
      });

      const increaseButtons = offcanvasBody.querySelectorAll('.increase-quantity');
      const decreaseButtons = offcanvasBody.querySelectorAll('.decrease-quantity');

      increaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index;
          increaseQuantity(index);
          updateCartDisplay();
        });
      });

      decreaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index;
          decreaseQuantity(index);
          updateCartDisplay();
        });
      });
    }
  }

  function increaseQuantity(index) {
    cartItems[index].quantity++;
  }

  function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
    }
  }

  // Add item to the cart directly from wishlist
  function addItemToCart(item) {
    const existingProductIndex = cartItems.findIndex((cartItem) => cartItem.name === item.name);
    if (existingProductIndex > -1) {
      cartItems[existingProductIndex].quantity++;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    cartBadge.textContent = cartItems.length;
    updateCartDisplay();
  }

  updateCartDisplay();
});


// for timer days
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 1360);

function updateCountdown() {
  const now = new Date();
  const timeDifference = targetDate - now;

  if (timeDifference <= 0) {
    // If countdown is over, set all values to 0
    document.querySelectorAll('.timer').forEach(timer => {
      timer.querySelector('.days').textContent = "0";
      timer.querySelector('.hours').textContent = "0";
      timer.querySelector('.minutes').textContent = "0";
      timer.querySelector('.seconds').textContent = "0";
    });
    return;
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  document.querySelectorAll('.timer').forEach(timer => {
    timer.querySelector('.days').textContent = days;
    timer.querySelector('.hours').textContent = hours;
    timer.querySelector('.minutes').textContent = minutes;
    timer.querySelector('.seconds').textContent = seconds;
  });
}

setInterval(updateCountdown, 1000);
updateCountdown();


//token expire 
document.getElementById("logoutBtn").addEventListener("click", function (event) {
  event.preventDefault();

  localStorage.removeItem("authToken"); 

  window.location.href = "loginsite.html";
});