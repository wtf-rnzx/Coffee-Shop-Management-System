$(document).ready(function ($) {
    "use strict";


    var book_table = new Swiper(".book-table-img-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 3,
            stretch: 2,
            depth: 100,
            modifier: 5,
            slideShadows: false,
        },
        loopAdditionSlides: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var team_slider = new Swiper(".team-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 2000,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    jQuery(".filters").on("click", function () {
        jQuery("#menu-dish").removeClass("bydefault_show");
    });
    $(function () {
        var filterList = {
            init: function () {
                $("#menu-dish").mixItUp({
                    selectors: {
                        target: ".dish-box-wp",
                        filter: ".filter",
                    },
                    animation: {
                        effects: "fade",
                        easing: "ease-in-out",
                    },
                    load: {
                        filter: ".all, .breakfast, .lunch, .dinner",
                    },
                });
            },
        };
        filterList.init();
    });

    jQuery(".menu-toggle").click(function () {
        jQuery(".main-navigation").toggleClass("toggled");
    });

    jQuery(".header-menu ul li a").click(function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Get the target section id from href
        const targetId = jQuery(this).attr("href");
        
        // Remove 'toggled' class from navigation
        jQuery(".main-navigation").removeClass("toggled");
        
        // Smooth scroll to target section
        jQuery('html, body').animate({
            scrollTop: jQuery(targetId).offset().top - 20 // Offset by 100px to account for header
        }, 200);
    });

    gsap.registerPlugin(ScrollTrigger);

    var elementFirst = document.querySelector('.site-header');
    ScrollTrigger.create({
        trigger: "body",
        start: "30px top",
        end: "bottom bottom",

        onEnter: () => myFunction(),
        onLeaveBack: () => myFunction(),
    });

    function myFunction() {
        elementFirst.classList.toggle('sticky_head');
    }

    var scene = $(".js-parallax-scene").get(0);
    var parallaxInstance = new Parallax(scene);


});


jQuery(window).on('load', function () {
    $('body').removeClass('body-fixed');

    //activating tab of filter
    let targets = document.querySelectorAll(".filter");
    let activeTab = 0;
    let old = 0;
    let dur = 0.4;
    let animation;

    for (let i = 0; i < targets.length; i++) {
        targets[i].index = i;
        targets[i].addEventListener("click", moveBar);
    }

    // initial position on first === All 
    gsap.set(".filter-active", {
        x: targets[0].offsetLeft,
        width: targets[0].offsetWidth
    });

    function moveBar() {
        if (this.index != activeTab) {
            if (animation && animation.isActive()) {
                animation.progress(1);
            }
            animation = gsap.timeline({
                defaults: {
                    duration: 0.4
                }
            });
            old = activeTab;
            activeTab = this.index;
            animation.to(".filter-active", {
                x: targets[activeTab].offsetLeft,
                width: targets[activeTab].offsetWidth
            });

            animation.to(targets[old], {
                color: "#0d0d25",
                ease: "none"
            }, 0);
            animation.to(targets[activeTab], {
                color: "#fff",
                ease: "none"
            }, 0);

        }

    }
});


document.addEventListener('DOMContentLoaded', function() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.querySelector('.user-menu');

    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItems = document.querySelector('.cart-items');
    const cartNumber = document.querySelector('.cart-number');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    let cart = [];

    // Toggle cart dropdown
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        // Check if click is on remove button or its children
        const isRemoveButton = e.target.closest('.remove-item');
        
        // Only close if click is outside cart and not on remove button
        if (!cartDropdown.contains(e.target) && 
            !cartBtn.contains(e.target) && 
            !isRemoveButton) {
            cartDropdown.classList.remove('active');
        }
    });

    // Add to cart functionality
    document.querySelectorAll('.dish-add-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dishBox = this.closest('.dish-box');
            const title = dishBox.querySelector('.h3-title').textContent;
            const priceElement = dishBox.querySelector('.dist-bottom-row b') || 
                               dishBox.querySelector('.dish-info + .dist-bottom-row b');
            const price = priceElement ? priceElement.textContent : '₱ 0';
            const img = dishBox.querySelector('.dist-img img').src;

            addToCart({ title, price, img });
        });
    });

    function addToCart(item) {
        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem.title === item.title);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        updateCartUI();
    }

    function updateCartUI() {
        // Update cart number
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartNumber.textContent = totalQuantity;

        // Update cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <button onclick="event.stopPropagation(); updateQuantity(${cart.indexOf(item)}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="event.stopPropagation(); updateQuantity(${cart.indexOf(item)}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="event.stopPropagation(); removeFromCart(${cart.indexOf(item)})">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Update total
        const total = cart.reduce((sum, item) => {
            const priceMatch = item.price.match(/\d+/);
            const price = priceMatch ? parseInt(priceMatch[0]) : 0;
            return sum + (price * item.quantity);
        }, 0);
        totalAmount.textContent = `₱ ${total}`;

        // Enable/disable checkout button
        if (cart.length > 0) {
            checkoutBtn.removeAttribute('disabled');
        } else {
            checkoutBtn.setAttribute('disabled', 'disabled');
        }
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    window.updateQuantity = function(index, change) {
        const item = cart[index];
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart.splice(index, 1);
        }
        
        updateCartUI();
    }

    // Checkout button click handler
    checkoutBtn.addEventListener('click', function() {
        // Hide cart dropdown
        cartDropdown.classList.remove('active');
        
        // Create and show checkout modal
        const checkoutModal = createCheckoutModal();
        document.body.appendChild(checkoutModal);
    });

    function createCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        
        const orderSummary = cart.map(item => {
            const priceMatch = item.price.match(/\d+/);
            const price = priceMatch ? parseInt(priceMatch[0]) : 0;
            return `
                <div class="checkout-item">
                    <span>${item.title} x${item.quantity}</span>
                    <span>₱ ${price * item.quantity}</span>
                </div>
            `;
        }).join('');

        const total = cart.reduce((sum, item) => {
            const priceMatch = item.price.match(/\d+/);
            const price = priceMatch ? parseInt(priceMatch[0]) : 0;
            return sum + (price * item.quantity);
        }, 0);

        modal.innerHTML = `
            <div class="checkout-content">
                <div class="checkout-header">
                    <h2>Checkout</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="checkout-body">
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        ${orderSummary}
                        <div class="checkout-total">
                            <strong>Total:</strong>
                            <strong>₱ ${total}</strong>
                        </div>
                    </div>

                    <form id="payment-form" class="payment-form">
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="address">Delivery Address</label>
                            <textarea id="address" required></textarea>
                        </div>
                        
                        <div class="payment-methods">
                            <h3>Payment Method</h3>
                            <div class="payment-options">
                                <label>
                                    <input type="radio" name="payment" value="cash" checked>
                                    Cash on Delivery
                                </label>
                                <label>
                                    <input type="radio" name="payment" value="card">
                                    Credit/Debit Card
                                </label>
                            </div>
                        </div>

                        <div id="card-payment-fields" style="display: none;">
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number" maxlength="16">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiry">Expiry Date</label>
                                    <input type="text" id="expiry" placeholder="MM/YY">
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV</label>
                                    <input type="text" id="cvv" maxlength="3">
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="place-order-btn">Place Order</button>
                    </form>
                </div>
            </div>
        `;

        // Close modal handler
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Payment method toggle
        const paymentInputs = modal.querySelectorAll('input[name="payment"]');
        const cardFields = modal.querySelector('#card-payment-fields');
        
        paymentInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                cardFields.style.display = e.target.value === 'card' ? 'block' : 'none';
            });
        });

        // Form submission handler
        modal.querySelector('#payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically:
            // 1. Validate all inputs
            // 2. Process payment if card is selected
            // 3. Send order to your backend
            
            // For now, we'll just show a success message and clear the cart
            alert('Order placed successfully!');
            cart = [];
            updateCartUI();
            modal.remove();
        });

        return modal;
    }
});


