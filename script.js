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
                productCard.classList.add('col-md-3', 'product-card'); // Add product-card class
                productCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <div class="d-flex justify-content-center">
                    <a href="image">
                        <img src="${childData.image}" class="card-img-top" alt="${childData.name}" style="height: 200px; object-fit: contain;"> <!-- Set fixed height and object-fit -->
                    </a>
                        </div>
                        <div class="card-body d-flex flex-column">
                        <div class="card-title-box"><h6 class="card-title">${childData.name}</h6></div>
                        <!-- <p class="card-text">${childData.description}</p> -->
                        <div class="d-flex justify-content-between align-items-end mt-auto">
                            <p class="card-text"><span style="color: red; font-size: 15px; font-weight: bold;">From Kshs. ${childData.price}</span></p> <!-- Apply styling to price text -->
                            <div class="d-flex justify-content-between align-items-end mt-auto">
                                <span class="cart-icon">
                                    <a href="cart-url" style="margin-right: 10px;">
                                        <img src="images/addcart.png" alt="Add Cart" style="height: 25px;" class="cart-img">
                                    </a>                
                                </span> <!-- Cart Icon -->
                                <span class="ml-2 whatsapp-icon">
                                    <a href="whatsapp-url">
                                        <img src="images/whatsapp.png" alt="WhatsApp Logo" style="height: 25px;" class="whatsapp-img">
                                    </a>
                                </span> <!-- WhatsApp Logo -->
                            </div>
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

// Call the function to display products when the page loads
window.onload = () => {
    displayProducts();
   
};