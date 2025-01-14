$(document).ready(function () {
  // Slick slider initialization
  $('.custom-slider').slick({
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: false, // No default dots
    arrows: false, // Disable default arrows
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  })

  // Custom navigation buttons
  $('.custom-prev').on('click', function () {
    $('.custom-slider').slick('slickPrev')
  })

  $('.custom-next').on('click', function () {
    $('.custom-slider').slick('slickNext')
  })

  // Handling heart icon click
  const heartBadge = document.getElementById('heartBadge')
  const heartIcons = document.querySelectorAll('#cardHeartIcon')
  let likedCount = 0

  heartIcons.forEach((heartIcon) => {
    heartIcon.addEventListener('click', () => {
      if (!heartIcon.classList.contains('liked')) {
        heartIcon.classList.add('liked')
        likedCount++
      } else {
        heartIcon.classList.remove('liked')
        likedCount--
      }
      heartBadge.textContent = likedCount
      heartBadge.style.display = likedCount > 0 ? 'inline' : 'block'
    })
  })

  // Initially hide heart badge if no items are liked
  heartBadge.style.display = 'blo'

  const cartBadge = document.getElementById('cart-badge')
  const addToCartButtons = document.querySelectorAll('.btn-success')
  let cartItems = []

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()
      const productCard = button.closest('.card-body')
      const productName = productCard.querySelector('.cardheading a').textContent.trim()
      const productPriceText = productCard.querySelector('.text-dark').textContent.trim()
      const productImage = productCard.querySelector('img').src

      const price = parseFloat(productPriceText.replace('$', '').replace(',', '').trim())

      const existingProductIndex = cartItems.findIndex((item) => item.name === productName)
      if (existingProductIndex > -1) {
        cartItems[existingProductIndex].quantity++
      } else {
        const product = { name: productName, price, quantity: 1, image: productImage }
        cartItems.push(product)
      }

      cartBadge.textContent = cartItems.length
      updateCartDisplay()
    })
  })

  function updateCartDisplay () {
    const offcanvasBody = document.querySelector('.offcanvas-body')
    offcanvasBody.innerHTML = ''

    if (cartItems.length === 0) {
      offcanvasBody.innerHTML = `<p class="text-danger">Your shopping cart is empty!</p>`
    } else {
      let grandTotal = 0

      cartItems.forEach((item, index) => {
        const totalPrice = item.price * item.quantity
        grandTotal += totalPrice

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
                        <p class="text-center">Total: $${totalPrice.toFixed(2)}</p>
                    </div>
                    <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
                    </div>
                `
        offcanvasBody.insertAdjacentHTML('beforeend', productHTML)
      })

      offcanvasBody.insertAdjacentHTML(
        'beforeend',
        `<div class="mt-auto text-end">Grand Total:
                    <strong class="text-success">$${grandTotal.toFixed(2)}</strong>
                </div>`
      )

      const removeButtons = offcanvasBody.querySelectorAll('.remove-item')
      removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index
          cartItems.splice(index, 1)
          updateCartDisplay()
          cartBadge.textContent = cartItems.length
        })
      })

      const increaseButtons = offcanvasBody.querySelectorAll('.increase-quantity')
      const decreaseButtons = offcanvasBody.querySelectorAll('.decrease-quantity')

      increaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index
          increaseQuantity(index)
          updateCartDisplay()
        })
      })

      decreaseButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = button.dataset.index
          decreaseQuantity(index)
          updateCartDisplay()
        })
      })
    }
  }

  function increaseQuantity (index) {
    cartItems[index].quantity++
  }

  function decreaseQuantity (index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--
    }
  }

  updateCartDisplay()
})
