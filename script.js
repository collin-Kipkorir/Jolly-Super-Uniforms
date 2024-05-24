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

// Fetch products from Firebase
const productsRef = database.ref('products');

// Get the navbar-toggler element
const navbarToggler = document.getElementById('navbar-toggler');

// Add an event listener to detect when the navbar is opened
navbarToggler.addEventListener('click', function () {
    // Hide the navbar-toggler-icon after it has been clicked
    this.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', checkWidth);
window.addEventListener('resize', checkWidth);

function checkWidth() {
    // Get the viewport width
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if viewport width is less than or equal to 767px (mobile view)
    if (viewportWidth <= 767) {
        // Add sticky class to the navbar
        document.getElementById('navbar').classList.add('sticky');
    } else {
        // Remove sticky class from the navbar
        document.getElementById('navbar').classList.remove('sticky');
    }
}

function showDropdown() {
    document.getElementById("navbarDropdown").setAttribute("aria-expanded", "true");
    document.getElementById("dropdownMenu").classList.add("show");
}

function hideDropdown() {
    document.getElementById("navbarDropdown").setAttribute("aria-expanded", "false");
    document.getElementById("dropdownMenu").classList.remove("show");
}

/// Function to show loader and hide content
function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('main-content').classList.add('hidden');
}

// Function to hide loader and show content
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
}

// Function to hide the navbar
function hideNavbar() {
    document.getElementById('navbar').style.display = 'none';
}

// Function to show the navbar
function showNavbar() {
    document.getElementById('navbar').style.display = 'block';
}

// Function to hide the footer
function hideFooter() {
    document.getElementById('footer').classList.add('hidden');
}

// Function to show the footer
function showFooter() {
    document.getElementById('footer').classList.remove('hidden');
}

// Call the function to display loader when the page starts loading
showLoader();
hideNavbar();
// Get the review form element
const reviewForm = document.getElementById('review-form');

// Add event listener for form submission
reviewForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const reviewText = document.getElementById('review-text').value;
    const productId = document.getElementById('modal-product-id').value; // Retrieve the current product ID

    if (reviewText && productId) {
        const reviewRef = database.ref('products/' + productId + '/reviews');
        reviewRef.push(reviewText)
            .then(() => {
                alert('Review submitted successfully!');
                document.getElementById('review-text').value = ''; // Clear the textarea
                loadProductReviews(productId); // Reload the reviews
            })
            .catch(error => {
                console.error('Error submitting review: ', error);
                alert('Failed to submit review. Please try again.');
            });
    }
});
// Modify the displayProducts function to pass product_id to addItemToCart function
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
            // Loop through the array of child data
            childDataArray.forEach((childData) => {
                hideLoader();
                showFooter();
                showNavbar();
                // Create product card for each product
                const productCard = document.createElement('div');
                productCard.classList.add('col-6', 'col-md-3', 'product-card'); // Add responsive classes for mobile and desktop view
                productCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <div class="d-flex justify-content-center">
                        <a href="#" onclick="logProductID('${childData.key}')" data-toggle="modal" data-target="#itemDetailsModal">
                            <img src="${childData.image}" class="card-img-top" alt="${childData.name}" style="height: 200px; object-fit: contain;"> <!-- Set fixed height and object-fit -->
                        </a>
                    </div>
                
                    <div class="card-body d-flex flex-column">
                        <div class="card-title-box"><h6 class="card-title">${childData.name}</h6></div>
                        <div> <p class="card-text"><span style="color: red; font-size: 14px; font-weight: bold;">From Kshs. ${childData.price}</span></p></div> <!-- Apply styling to price text -->

                        <div class="d-flex justify-content-end align-items-end mt-auto" style="margin-top: auto;">
                        <span class="cart-icon">
                            <!-- Add event listener to cart icon -->
                            <a href="add to cart" style="margin-right: 10px;">
                                <img src="images/addcart.png" alt="Add Cart" style="height: 25px;" class="cart-img">
                            </a>
                        </span> <!-- Cart Icon -->
                        <span class="ml-2 whatsapp-icon">
                            <a href="whatsapp://send?phone=+254723914386&text=Hello%20I%20would%20like%20to%20chat">
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
// Function to retrieve product details by ID
function getProductDetails(productId) {
    const productRef = firebase.database().ref('products/' + productId);
    productRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const productData = snapshot.val();
            // Populate modal with product details
            const modalProductImage = document.getElementById('modal-product-image');
            const modalProductName = document.getElementById('modal-product-name');
            const modalProductDescription = document.getElementById('modal-product-description');
            const modalProductPrice = document.getElementById('modal-product-price');
            const modalProductSpecs = document.getElementById('modal-product-specs');
            const modalProductReviewsList = document.getElementById('modal-product-reviews-list');
            const modalProductId = document.getElementById('modal-product-id'); // Get the hidden input field

            // Check if modal elements exist before setting their properties
            if (modalProductImage && modalProductName && modalProductDescription && modalProductPrice && modalProductSpecs && modalProductReviewsList && modalProductId) {
                modalProductImage.src = productData.image;
                modalProductName.textContent = productData.name;
                modalProductDescription.textContent = productData.description;
                modalProductPrice.textContent = `From Kshs. ${productData.price}`;
                modalProductSpecs.textContent = productData.specifications || "No specifications available.";
                modalProductId.value = productId; // Set the product ID in the hidden input field

                // Populate reviews
                loadProductReviews(productId);
            } else {
                console.error("One or more modal elements not found.");
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
    const reviewsRef = database.ref('products/' + productId + '/reviews');
    const modalProductReviewsList = document.getElementById('modal-product-reviews-list');
    reviewsRef.once('value').then((snapshot) => {
        modalProductReviewsList.innerHTML = ''; // Clear existing reviews
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const review = childSnapshot.val();
                const reviewItem = document.createElement('li');
                reviewItem.textContent = review;
                modalProductReviewsList.appendChild(reviewItem);
            });
        } else {
            modalProductReviewsList.innerHTML = '<li>No reviews available.</li>';
        }
    }).catch((error) => {
        console.error("Error fetching reviews: ", error);
    });
}
// Function to log product ID when item image is clicked and retrieve product details
function logProductID(productId) {
    console.log("Product ID:", productId);
    // Retrieve product details by ID
    getProductDetails(productId);
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
    Price: ${productPrice}
    Size: ${selectedSize}
    Quantity: ${quantity}
    ${productImage}`;

    const whatsappUrl = `https://wa.me/254723914386?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});


// Call the function to display products when the page loads
window.onload = () => {
    displayProducts();
};