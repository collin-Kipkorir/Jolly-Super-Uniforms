document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  // Log the cart object to the console to verify its structure
  console.log("Retrieved cart:", cart);

  // Get the cart items container and the cart counter element
  const cartItemsList = document.getElementById("cart-items-list");
  const cartCounter = document.getElementById("cart-counter"); // Assuming you have a cart counter element with this ID

  // Initialize total price
  let totalPrice = 0;

  // Function to render the cart
  function renderCart() {
    cartItemsList.innerHTML = ""; // Clear the current list

    // Check if the cart is empty
    if (Object.keys(cart).length === 0) {
      cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
      console.log("Cart is empty");
    } else {
      // Iterate over each item in the cart and inject the HTML content
      for (const productId in cart) {
        if (cart.hasOwnProperty(productId)) {
          const item = cart[productId];

          // Log each item to the console
          console.log("Processing item:", item);

          // Calculate the total price
          totalPrice += item.price * item.count;

          // Create the cart item HTML
          const cartItemHTML = `
                        <div class="cart-item" data-product-id="${productId}">
                            <div class="item-image-container">
                                <img src="${item.image}" alt="${
            item.name
          }" class="item-image">
                            </div>
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.count}</p>
                            </div>
                            <div class="item-price" style="color: red;">
                                KSh ${item.price * item.count}
                            </div>
                            <button class="btn-delete" data-product-id="${productId}">Delete</button>
                        </div>
                    `;

          // Append the cart item HTML to the cart items list
          cartItemsList.innerHTML += cartItemHTML;
        }
      }

      // Update the total price in the DOM
      document.getElementById("total-amount").textContent = `KSh ${totalPrice}`;
    }

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".btn-delete");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        deleteItemFromCart(productId);
      });
    });

    // Update the cart counter with the number of unique items
    updateCartCounter();
  }

  // Function to delete an item from the cart
  function deleteItemFromCart(productId) {
    if (cart[productId]) {
      delete cart[productId];
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(`Item with ID ${productId} removed from cart`);

      // Recalculate total price
      totalPrice = 0;
      for (const id in cart) {
        if (cart.hasOwnProperty(id)) {
          totalPrice += cart[id].price * cart[id].count;
        }
      }

      // Update the total price in the DOM
      document.getElementById("total-amount").textContent = `KSh ${totalPrice}`;

      // Re-render the cart
      renderCart();
    }
  }

  // Function to update the cart counter
  function updateCartCounter() {
    const uniqueItemCount = Object.keys(cart).length;
    cartCounter.textContent = uniqueItemCount;
    localStorage.setItem("cartCount", uniqueItemCount);
  }

  // Initial render of the cart and counter update
  renderCart();
  updateCartCounter();
});
