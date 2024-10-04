document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {}; // Load cart from local storage
    
    const cartContainer = document.querySelector('.cart-container');
    const addressContainer = document.querySelector('.address-management');
    const subtotalElement = document.getElementById('subtotal');
    const platformElement = document.getElementById('platform');
    const totalElement = document.getElementById('Total');
    const savingsElement = document.getElementById('savings');
    const checkoutButton = document.querySelector('.checkout-btn');
    const defaultPlatformFee = 20; // Fixed platform fee
    const cartItemsContainer = document.querySelector('.cart-items');

    // Function to update the cart display and summary
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear previous cart items

        let subtotal = 0;
        let totalSavings = 0;

        // Check if cart has items
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            updateSummary(0, 0); // Reset summary if no items
            alert('Your cart is empty. Please add items to proceed.');
            return;
        }

        for (let id in cart) {
            const item = cart[id];
           
            const mrpPrice = parseFloat(item.mrpPrice);
            const sellingPrice = parseFloat(item.priceWithoutMRP); // Price without MRP
            const quantity = item.quantity;
            const productTotal = sellingPrice * quantity;
            const savings = (mrpPrice - sellingPrice) * quantity;

            subtotal += productTotal;
            totalSavings += savings;

            // Insert each cart item
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${id}">
                    <img src="${item.imageUrl}" alt="${item.productName}" class="product-image">
                    <div class="product-details">
                        <p class="brand">${item.brand}</p>
                        <p class="product-name">${item.productName}</p>
                        <p class="product-price">MRP: ₹${mrpPrice.toFixed(2)}</p>
                        <p class="selling-price">Selling Price: ₹${sellingPrice.toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="decrease-btn" onclick="decreaseQuantity('${id}')">-</button>
                        <span id="quantity-${id}">${quantity}</span>
                        <button class="increase-btn" onclick="increaseQuantity('${id}')">+</button>
                    </div>
                    <div class="total-price">
                        <p>Total: ₹<span id="product-total-${id}">${productTotal.toFixed(2)}</span></p>
                    </div>
                </div>
            `;
        }

        updateSummary(subtotal, totalSavings);
    }

    // Function to update the summary section
    function updateSummary(subtotal, totalSavings) {
        let platformFee = subtotal > 0 ? defaultPlatformFee : 0; // Display platform fee only if subtotal > 0
        const total = subtotal + platformFee;

        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        platformElement.textContent = `₹${platformFee.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
        savingsElement.textContent = `₹${totalSavings.toFixed(2)}`;
    }

    // Function to increase quantity
    window.increaseQuantity = function(id) {
        cart[id].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        updateCartDisplay(); // Refresh the cart display
    };

    // Function to decrease quantity
    window.decreaseQuantity = function(id) {
        if (cart[id].quantity > 1) {
            cart[id].quantity -= 1;
        } else {
            delete cart[id];
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        updateCartDisplay(); // Refresh the cart display
    };

   // Event listener for the checkout button
checkoutButton.addEventListener('click', function() {
    // Check if the cart is empty
    if (Object.keys(cart).length === 0) {
        // Display alert if the cart is empty
        alert('Your cart is empty. Please add items to proceed.');
    } else {
        // If the cart is not empty, proceed to the address container
        cartContainer.style.display = 'none'; // Hide the cart container
        addressContainer.style.display = 'block'; // Show the address container
    }
});


    // Initialize the cart display on page load
    updateCartDisplay();
});



//  Script for Address Container
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const fixedContainer = document.querySelector('.fixed-bottom-container');
    const addressManagement = document.querySelector('.address-management');
    const savedAddresses = document.querySelector('.saved-addresses');
    const newAddressForm = document.getElementById('new-address-form');
    const paymentContainer = document.querySelector('#payment-container');
    const confirmSavedAddressButton = document.querySelector('.saved-addresses .save-btn'); // Saved addresses "Confirm Address"
    const confirmNewAddressButton = document.getElementById('confirm-address-btn'); // New address "Confirm Address"

    // Show the new address form and hide saved addresses when clicking "+ Add New Address"
    document.getElementById('show-new-address-form').addEventListener('click', function() {
        newAddressForm.style.display = 'block';
        savedAddresses.style.display = 'none';
    });

    // Confirm and proceed with a saved address
    confirmSavedAddressButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission if button is inside a form
        const selectedAddress = savedAddresses.querySelector('input[type="radio"]:checked');
        if (selectedAddress) {
            // Hide the address management container
            addressManagement.style.display = 'none';
            // Show the payment container
            paymentContainer.style.display = 'block';
        } else {
            alert("Please select a saved address before confirming.");
        }
    });

    // Handle form submission from the new address form
    confirmNewAddressButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        // Assuming form validation has been done at this point
        if (validateNewAddressForm()) {
            // Hide the new address form and show payment container
            addressManagement.style.display = 'none';
            paymentContainer.style.display = 'block';
        } else {
            alert("Please fill out all required fields.");
        }
    });

    // Helper function to validate new address form
    function validateNewAddressForm() {
        const requiredFields = newAddressForm.querySelectorAll('input[required], textarea[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                return false;
            }
        }
        return true;
    }

    // Add a "Go Back" button in the new address form
    const goBackButtonInForm = document.createElement('button');
    goBackButtonInForm.textContent = 'Go Back';
    goBackButtonInForm.type = 'button';
    goBackButtonInForm.className = 'go-back-btn';
    newAddressForm.appendChild(goBackButtonInForm);

    // Add a "Go Back" button in the saved addresses section
    const goBackButtonInSavedAddresses = document.createElement('button');
    goBackButtonInSavedAddresses.textContent = 'Go Back';
    goBackButtonInSavedAddresses.type = 'button';
    goBackButtonInSavedAddresses.className = 'go-back-btn';
    savedAddresses.appendChild(goBackButtonInSavedAddresses);

    // Go back to the saved addresses when clicking "Go Back" in the new address form
    goBackButtonInForm.addEventListener('click', function() {
        newAddressForm.style.display = 'none';
        savedAddresses.style.display = 'block';
    });

    // Go back to the cart container when clicking "Go Back" in the saved addresses section
    goBackButtonInSavedAddresses.addEventListener('click', function() {
        addressManagement.style.display = 'none';
        cartContainer.style.display = 'block';
        fixedContainer.style.display = 'block';
    });

    // Ensure the containers are initially hidden as needed
    addressManagement.style.display = 'none';
    paymentContainer.style.display = 'none';
});

document.querySelector('.continue-btn').addEventListener('click', function() {
    // Hide the payment container
    document.querySelector('#payment-container').style.display = 'none';
    
    // Show the confirmation container
    document.querySelector('#confirmation-container').style.display = 'block';

    // Delete the cart from local storage
    localStorage.removeItem('cart');

    // Trigger confetti fireworks
    const duration = 5 * 1000; // Duration of confetti in milliseconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Left side fireworks
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      // Right side fireworks
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
});

// script for home button
document.getElementById("go-home-btn").addEventListener("click", function() {
    window.location.href = "Home.html"; // Redirect to home page
});