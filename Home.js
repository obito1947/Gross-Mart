document.addEventListener('DOMContentLoaded', function() {
    // Get the carousel containers and navigation buttons
    const carouselContainer1 = document.getElementById('carousel1');
    const prevButton1 = document.getElementById('prev-btn1');
    const nextButton1 = document.getElementById('next-btn1');

    const carouselContainer2 = document.getElementById('carousel2');
    const prevButton2 = document.getElementById('prev-btn2');
    const nextButton2 = document.getElementById('next-btn2');

    // Set the number of items to move at a time
    const itemsToMove = 1;

    // Initialize the current indices
    let currentIndex1 = 0;
    let currentIndex2 = 0;

    // Calculate the total number of items in each carousel
    const totalItems1 = carouselContainer1.children.length;
    const totalItems2 = carouselContainer2.children.length;

    // Calculate the max index for each carousel
    const maxIndex1 = totalItems1 - itemsToMove;
    const maxIndex2 = totalItems2 - itemsToMove;

    // Function to move the first carousel to the next set of items
    function moveNext1() {
        if (currentIndex1 < maxIndex1) {
            currentIndex1 += itemsToMove;
            carouselContainer1.style.transform =`translateX(-${currentIndex1 * 100}%)`;
        }
    }

    // Function to move the first carousel to the previous set of items
    function movePrev1() {
        if (currentIndex1 > 0) {
            currentIndex1 -= itemsToMove;
            carouselContainer1.style.transform =`translateX(-${currentIndex1 * 100}%)`;
        }
    }

    // Function to move the second carousel to the next set of items
    function moveNext2() {
        if (currentIndex2 < maxIndex2) {
            currentIndex2 += itemsToMove;
            carouselContainer2.style.transform =`translateX(-${currentIndex2 * 100}%)`;
        }
    }

    // Function to move the second carousel to the previous set of items
    function movePrev2() {
        if (currentIndex2 > 0) {
            currentIndex2 -= itemsToMove;
            carouselContainer2.style.transform = `translateX(-${currentIndex2 * 100}%)`;
        }
    }

    // Add event listeners to the navigation buttons
    prevButton1.addEventListener('click', movePrev1);
    nextButton1.addEventListener('click', moveNext1);

    prevButton2.addEventListener('click', movePrev2);
    nextButton2.addEventListener('click', moveNext2);
});

// Global object to store products and their quantities
let cartDictionary = {};

// Load cart from local storage if available
window.onload = function () {
    if (localStorage.getItem('cart')) {
        cartDictionary = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();

        // Restore quantity controls for each item in the cart
        Object.values(cartDictionary).forEach(product => {
            const productCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
            if (productCard) {
                showQuantityControls(productCard, product.id, product.quantity);
                productCard.querySelector('.add-btn').style.display = 'none'; // Hide add button
            }
        });
    }
};

// Function to handle adding products to the cart
function addToCart(button) {
    // Extract product details
    const productCard = button.closest('.product-card');
    const brand = productCard.querySelector('.brand').innerText;
    const productName = productCard.querySelector('.product-name').innerText.trim();
    const weightSelect = productCard.querySelector('select').value;

    // Convert price from string to integer (strip currency symbols and commas)
    const priceWithoutMRP = parseInt(productCard.querySelector('.price').lastChild.textContent.trim().replace(/[₹,]/g, ''), 10);
    const mrpPrice = parseInt(productCard.querySelector('.mrp-price').textContent.trim().replace(/[₹,]/g, ''), 10);
    
    const imageUrl = productCard.querySelector('img').src;

    // Generate a unique ID by combining product name and weight
    const productId = `${productName}-${weightSelect}`.replace(/\s+/g, '-').toLowerCase();

    // Create a dictionary to store product info and add it to the cartDictionary
    if (!cartDictionary[productId]) {
        cartDictionary[productId] = {
            id: productId,
            brand,
            productName,
            weightSelect,
            priceWithoutMRP,  // Store as an integer
            mrpPrice,         // Store as an integer
            imageUrl,
            quantity: 1 // Set initial quantity to 1
        };
    } else {
        // Increment the quantity if the product already exists in the cart
        cartDictionary[productId].quantity++;
    }

    // Debugging line to display the dictionary
    console.log('Product added to cart:', cartDictionary[productId]);

    // Show adding animation
    button.textContent = 'Adding...';
    setTimeout(() => {
        button.style.display = 'none';
        showQuantityControls(productCard, productId, cartDictionary[productId].quantity); // Pass initial quantity
        openPopup(); // Show cart popup after adding item
    }, 500);

    updateCartCount();
}

// Function to save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartDictionary));
}

// Function to create quantity controls
function showQuantityControls(productCard, productId, quantity) {
    const qtyControls = document.createElement('div');
    qtyControls.classList.add('qty-controls');
    qtyControls.innerHTML = `
        <button class="decrease-btn" onclick="decreaseQuantity('${productId}', this)">-</button>
        <span id="quantity-${productId}">${quantity}</span> <!-- Set initial quantity -->
        <button class="increase-btn" onclick="increaseQuantity('${productId}', this)">+</button>
    `;
    productCard.appendChild(qtyControls);
}

// Function to increase quantity
function increaseQuantity(productId, button) {
    // Check if the product exists in the cart
    if (cartDictionary[productId]) {
        let product = cartDictionary[productId];

        // Increment the quantity
        product.quantity++;

        // Update the quantity display
        const quantitySpan = document.querySelector(`#quantity-${productId}`);
        quantitySpan.textContent = product.quantity;
    } else {
        console.error(`Product with ID "${productId}" not found in cart.`);
    }

    updateCartCount();
}

// Function to decrease quantity
function decreaseQuantity(productId, button) {
    let product = cartDictionary[productId];

    if (product && product.quantity > 1) {
        // Decrease the quantity
        product.quantity--;

        // Update the quantity display
        const quantitySpan = document.querySelector(`#quantity-${productId}`);
        quantitySpan.textContent = product.quantity;
    } else {
        // Remove product if quantity is 1 and decrease is clicked
        delete cartDictionary[productId];
        button.parentElement.remove();

        // Show 'Add' button again
        const addButton = button.closest('.product-card').querySelector('.add-btn');
        addButton.style.display = 'inline-block';
        addButton.textContent = 'Add';
    }

    updateCartCount();
}

// Function to update the cart count (based on the total number of unique items in the cart)
function updateCartCount() {
    let itemCount = Object.keys(cartDictionary).length;
    document.getElementById('cart-count').textContent = itemCount;
    document.getElementById('cartCountNumber').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
}

// Function to open the cart popup
function openPopup() {
    document.getElementById('cartPopup').style.display = 'block';
}

// Function to close the cart popup
function closePopup() {
    document.getElementById('cartPopup').style.display = 'none';
}

// Attach event listeners to the cart icon and "View Basket" button
document.getElementById('cart-icon').addEventListener('click', saveCartToLocalStorage);
document.getElementById('view-basket').addEventListener('click', saveCartToLocalStorage);


document.addEventListener('DOMContentLoaded', function () {
    const categoryBtn = document.getElementById('categoryBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const categoryOptions = document.querySelectorAll('.category-option');
    const categoryContents = document.querySelectorAll('.category-content');
    const arrow = document.getElementById('arrow');
    const rightOptions = document.querySelectorAll('.right-option');

    // Open/close dropdown with animation
    categoryBtn.addEventListener('click', function () {
        if (dropdownMenu.classList.contains('show')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    // Open dropdown
    function openDropdown() {
        dropdownMenu.style.display = 'flex';
        setTimeout(() => {
            dropdownMenu.classList.add('show');
            arrow.innerHTML = '▲';
        }, 10);
    }

    // Close dropdown
    function closeDropdown() {
        dropdownMenu.classList.remove('show');
        arrow.innerHTML = '▼';
        setTimeout(() => {
            dropdownMenu.style.display = 'none';
        }, 300);
    }

    // Handle hover effect on categories and make left side buttons clickable
    categoryOptions.forEach(option => {
        option.addEventListener('mouseover', function () {
            const category = option.getAttribute('data-category');
            categoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === category) {
                    content.classList.add('active');
                }
            });
        });

        // Handle click on left panel options
        option.addEventListener('click', function () {
            closeDropdown(); // Close dropdown when a left panel item is clicked
        });
    });

    // Handle click on right panel options
    rightOptions.forEach(option => {
        option.addEventListener('click', function () {
            closeDropdown(); // Close dropdown when an item is clicked
        });
    });

    // Close dropdown when clicked outside
    document.addEventListener('click', function (event) {
        if (!categoryBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            closeDropdown();
        }
    });
});