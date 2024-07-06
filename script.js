// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClS4zP63hQipphS-FzNzmCpNsXb6SDdkc",
    authDomain: "jolly-uniforms.firebaseapp.com",
    projectId: "jolly-uniforms",
    storageBucket: "jolly-uniforms.appspot.com",
    messagingSenderId: "17335535863",
    appId: "1:17335535863:web:42f53ed271796ac4852bf2",
    measurementId: "G-GE79K2PX5M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to Firebase Database
const database = firebase.database();
const productsRef = database.ref('products');

// Get the navbar-toggler element
const navbarToggler = document.getElementById('navbar-toggler');

// Add an event listener to detect when the navbar is opened
navbarToggler.addEventListener('click', function () {
    // Hide the navbar-toggler-icon after it has been clicked
    this.style.display = 'none';
});

// Ensure the navbar brand toggle visibility
const navbarBrand = document.querySelector('.navbar-brand.ml-2');
navbarToggler.addEventListener('click', function () {
    // Toggle the hidden class on the navbar-brand element
    navbarBrand.classList.toggle('hidden');
});

// Add event listeners for DOM content loaded and window resize
window.addEventListener('DOMContentLoaded', checkWidth);
window.addEventListener('resize', checkWidth);

// Document ready function with jQuery
$(document).ready(function() {
    $('#itemDetailsModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    $('#modal-close-button').on('click', function() {
        $('#itemDetailsModal').modal('hide');
    });

    $('#itemDetailsModal').on('hide.bs.modal', function (e) {
        if (!confirm("Are you sure you want to close the modal?")) {
            e.preventDefault();
        }
    });
});

// Function to check the width and apply sticky navbar
function checkWidth() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    if (viewportWidth <= 767) {
        document.getElementById('navbar').classList.add('sticky');
    } else {
        document.getElementById('navbar').classList.remove('sticky');
    }
}

// Functions to show and hide dropdown
function showDropdown() {
    document.getElementById("navbarDropdown").setAttribute("aria-expanded", "true");
    document.getElementById("dropdownMenu").classList.add("show");
}

function hideDropdown() {
    document.getElementById("navbarDropdown").setAttribute("aria-expanded", "false");
    document.getElementById("dropdownMenu").classList.remove("show");
}

// Functions to show and hide loader
function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('main-content').classList.add('hidden');
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
}

// Functions to show and hide navbar and footer
function hideNavbar() {
    document.getElementById('navbar').style.display = 'none';
}

function showNavbar() {
    document.getElementById('navbar').style.display = 'block';
}

function hideFooter() {
    document.getElementById('footer').classList.add('hidden');
}

function showFooter() {
    document.getElementById('footer').classList.remove('hidden');
}

// Display loader on page start loading
showLoader();
hideNavbar();

// Get the review form element
const reviewForm = document.getElementById('review-form');

// Add event listener for form submission
reviewForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const reviewName = document.getElementById('review-name').value;
    const reviewText = document.getElementById('review-text').value;
    const productId = document.getElementById('modal-product-id').value; // Retrieve the current product ID

    if (reviewName && reviewText && productId) {
        const reviewRef = database.ref('products/' + productId + '/reviews');
        const newReview = {
            name: reviewName,
            text: reviewText,
            timestamp: firebase.database.ServerValue.TIMESTAMP // Add a timestamp
        };
        reviewRef.push(newReview)
            .then(() => {
                alert('Review submitted successfully!');
                document.getElementById('review-name').value = ''; // Clear the name input
                document.getElementById('review-text').value = ''; // Clear the textarea
                loadProductReviews(productId); // Reload the reviews
            })
            .catch(error => {
                console.error('Error submitting review: ', error);
                alert('Failed to submit review. Please try again.');
            });
    }
});

// Function to shuffle an array using the Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// Cart counter logic
let cartCount = 0;
const cartCounter = document.getElementById('cart-counter');

// Check if cartCounter element exists
if (cartCounter) {
    console.log("Cart counter element found");

    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-to-cart')) {
        //     cartCount++;
        //     cartCounter.textContent = cartCount;
        //     console.log(`Cart count updated: ${cartCount}`);

        //     const productCard = event.target.closest('.product-card');
        //     const productId = productCard.getAttribute('data-product-id');
        //     const productName = productCard.querySelector('.card-title').textContent;
        //     const productImage = productCard.querySelector('img').src;
        //     const productPrice = productCard.querySelector('.card-text span').textContent;

        //     console.log(`Product added to cart: ${productName}, ID: ${productId}`);

        //     // Update the cart modal with product details (example code, update according to your modal structure)
        //     const cartModal = document.getElementById('cartModal');
        //     const cartItemsContainer = cartModal.querySelector('.cart-items');
        //     const newItem = document.createElement('div');
        //     newItem.classList.add('cart-item');
        //     newItem.innerHTML = `
        //         <img src="${productImage}" alt="${productName}" style="height: 50px;">
        //         <span>${productName}</span>
        //         <span>${productPrice}</span>
        //         <span>Quantity: 1</span>
        //     `;
        //     cartItemsContainer.appendChild(newItem);
        }
    });
} else {
    console.error("Cart counter element not found.");
}

// Function to display products
function displayProducts() {
    const productList = document.getElementById('product-list');

    // Clear existing product list
    productList.innerHTML = '';
    productsRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const childDataArray = []; // Array to store child data
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                childDataArray.push({ key: childSnapshot.key, ...childData }); // Push each product into the array with its key
            });

            // Shuffle the array of child data
            const shuffledChildDataArray = shuffleArray(childDataArray);

            shuffledChildDataArray.forEach((childData) => {
                hideLoader();
                showFooter();
                showNavbar();
                // Create product card for each product
                const productCard = document.createElement('div');
                productCard.classList.add('col-6', 'col-md-3', 'product-card'); // Add responsive classes for mobile and desktop view
                productCard.setAttribute('data-product-id', childData.key); // Set data attribute
                productCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <div class="d-flex justify-content-center">
                        <a href="#" onclick="getProductDetails('${childData.key}')">
                            <img src="${childData.image}" class="card-img-top" alt="${childData.name}" style="height: 200px; object-fit: contain;"> <!-- Set fixed height and object-fit -->
                        </a>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="card-title-box"><h6 class="card-title">${childData.name}</h6></div>
                        <div><p class="card-text"><span style="color: red; font-size: 14px; font-weight: bold;">From Kshs. ${childData.price}</span></p></div> <!-- Apply styling to price text -->
                        <div class="d-flex justify-content-end align-items-end mt-auto" style="margin-top: auto;">
                            <span class="cart-icon">
                                <!-- Add event listener to cart icon -->
                                 <a href="#" onclick="addItemtoCart('${childData.image}', '${childData.description}', '${childData.price}')">
                                    <img src="images/addcart.png" alt="WhatsApp Logo" style="height: 25px;" class="whatsapp-img">
                                </a>
                            </span> <!-- Cart Icon -->
                            <span class="ml-2 whatsapp-icon">
                                <!-- Add event listener to WhatsApp icon -->
                                <a href="#" onclick="openWhatsAppChat('${childData.image}', '${childData.description}', '${childData.price}')">
                                    <img src="images/whatsapp.png" alt="WhatsApp Logo" style="height: 25px;" class="whatsapp-img">
                                </a>
                            </span> <!-- WhatsApp Logo -->
                        </div>
                    </div>
                </div>`;
                productList.appendChild(productCard);

               
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error fetching products: ", error);
    });
}
function addItemtoCart(image, description, price){
    console.log (description + " Item Added");
}

// Call the function to display products when the page loads
window.onload = () => {
    displayProducts();
};


// Function to open WhatsApp chat with product details
function openWhatsAppChat(image, description, price) {
    event.preventDefault(); // Prevent the default link behavior

    const message = `Hello, I would like to inquire about:
    ${description}
    Price: ${price}
    ${image}`;

    const whatsappUrl = `https://wa.me/254723914386?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Function to load product reviews
function loadProductReviews(productId) {
    const reviewsRef = firebase.database().ref('products/' + productId + '/reviews');
    const productReviewsList = document.getElementById('product-reviews-list');
    reviewsRef.once('value').then((snapshot) => {
        productReviewsList.innerHTML = ''; // Clear existing reviews
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const review = childSnapshot.val();
                const reviewItem = document.createElement('li');
                reviewItem.innerHTML = `<strong>${review.name}</strong>: ${review.text} <br><small>${new Date(review.timestamp).toLocaleString()}</small>`;
                productReviewsList.appendChild(reviewItem);
            });
        } else {
            productReviewsList.innerHTML = '<li>No reviews available.</li>';
        }
    }).catch((error) => {
        console.error("Error fetching reviews: ", error);
    });
}

// Function to display product details
function getProductDetails(productId) {
    const productRef = firebase.database().ref('products/' + productId);
    productRef.once('value').then((snapshot) => {
        const productData = snapshot.val();
        if (productData) {
            // Update the modal with product details
            const productImage = document.getElementById('product-image');
            const productName = document.getElementById('product-name');
            const productDescription = document.getElementById('product-description');
            const productPrice = document.getElementById('product-price');
            const productSpecs = document.getElementById('product-specs');
            const productIdInput = document.getElementById('product-id');

            if (productImage && productName && productDescription && productPrice && productSpecs && productIdInput) {
                productImage.src = productData.image;
                productName.textContent = productData.name;
                productDescription.textContent = productData.description;
                productPrice.textContent = `From Kshs. ${productData.price}`;
                productIdInput.value = productId;

                // Populate specifications
                if (typeof productData.specifications === 'string') {
                    const specificationsArray = productData.specifications.split(',');
                    productSpecs.innerHTML = specificationsArray.map(spec => `<li>${spec.trim()}</li>`).join('');
                } else if (Array.isArray(productData.specifications)) {
                    productSpecs.innerHTML = productData.specifications.map(spec => `<li>${spec}</li>`).join('');
                } else {
                    productSpecs.innerHTML = "<p>No specifications available.</p>";
                }

                // Populate reviews
                // Populate reviews
                loadProductReviews(productId);

                // Show the product details container and hide the main content
                document.getElementById('main-content').classList.add('hidden');
                document.getElementById('product-details-container').classList.remove('hidden');
            } else {
                console.error("One or more container elements not found.");
            }
        } else {
            console.log("Product does not exist");
        }
    }).catch((error) => {
        console.error("Error fetching product details: ", error);
    });
}
// Function to load product reviews
function loadProductReviews(productId) {
    const reviewsRef = firebase.database().ref('products/' + productId + '/reviews');
    const productReviewsList = document.getElementById('product-reviews-list');
    reviewsRef.once('value').then((snapshot) => {
        productReviewsList.innerHTML = ''; // Clear existing reviews
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const review = childSnapshot.val();
                const reviewItem = document.createElement('li');
                reviewItem.innerHTML = `<strong>${review.name}</strong>: ${review.text} <br><small>${new Date(review.timestamp).toLocaleString()}</small>`;
                productReviewsList.appendChild(reviewItem);
            });
        } else {
            productReviewsList.innerHTML = '<li>No reviews available.</li>';
        }
    }).catch((error) => {
        console.error("Error fetching reviews: ", error);
    });
}


// Event listener for the WhatsApp button to dynamically construct the URL with product details
document.getElementById('whatsapp-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default link behavior

    const productImage = document.getElementById('modal-product-image').src;
    const productDescription = document.getElementById('modal-product-description').textContent;
    const productPrice = document.getElementById('modal-product-price').textContent;
    const selectedSize = document.getElementById('product-size').value;
    const quantity = document.getElementById('product-quantity').value;

    const message = `Hello, I would like to inquire about :
    ${productDescription}
    , ${productPrice}
   , ${selectedSize}
    , ${quantity}
    ${productImage}`;

    const whatsappUrl = `https://wa.me/254723914386?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});
function inquireOnWhatsApp() {
    // Example: Retrieve product details from specific elements
    const productDescription = document.getElementById('product-description').textContent;
    const productName = document.getElementById('product-name').textContent;
    const productPrice = document.getElementById('product-price').textContent;

// Construct the message
const message = `Hi there!

I'm interested in the ${productName} listed on your website.
Could you provide more details \n

Thanks!`;


    // Encode the message to be URL-friendly
    const encodedMessage = encodeURIComponent(message);

    // Construct the WhatsApp URL with the encoded message
    const whatsappUrl = `https://wa.me/254723914386?text=${encodedMessage}`;

    // Open the WhatsApp URL in a new tab/window
    window.open(whatsappUrl, '_blank');
}

// Add event listener to the WhatsApp button
document.getElementById('whatsapp-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    inquireOnWhatsApp(); // Call the function to handle the WhatsApp inquiry
});


// Call the function to display products when the page loads
window.onload = () => {
    displayProducts();
};

