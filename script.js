// Search Bar 

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("keyup", function () {
        let filter = searchInput.value.toLowerCase().trim();

        // Get all product cards, including dynamically loaded ones
        const productCards = document.querySelectorAll(".card");

        productCards.forEach((card) => {
            let productName = card.querySelector(".card-title").innerText.toLowerCase();

            if (productName.includes(filter)) {
                card.parentElement.style.display = "block"; // Show matching products
            } else {
                card.parentElement.style.display = "none"; // Hide non-matching products
            }
        });
    });
});


// Details
document.addEventListener("DOMContentLoaded", function () {
  const viewDetailButtons = document.querySelectorAll(".view-details");

  viewDetailButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior

          // Retrieve product details from button attributes
          const productDetails = {
              name: button.getAttribute("data-name"),
              price: button.getAttribute("data-price"),
              image: button.getAttribute("data-image"),
              description: button.getAttribute("data-description") || "No description available."
          };

          // Store product details in localStorage
          localStorage.setItem("selectedProduct", JSON.stringify(productDetails));

          // Redirect to the product details page
          window.location.href = "details.html";
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));

  if (productDetails) {
      document.getElementById("product-name").textContent = productDetails.name;
      document.getElementById("product-price").textContent = `$${productDetails.price}`;
      document.getElementById("product-image").src = productDetails.image;
      document.getElementById("product-description").textContent = productDetails.description;
  } else {
      // If no product is found, show a default message
      document.querySelector(".product-info").innerHTML = "<h2>Product not found</h2>";
  }
});

// Listings
// Function to Render Listings on Page Load
function displayListings() {
  const listingsContainer = document.getElementById("listingsContainer");
  if (!listingsContainer) return;

  const listings = JSON.parse(localStorage.getItem("listings")) || [];

  if (listings.length === 0) {
      listingsContainer.innerHTML = "<p>No listings found.</p>";
  } else {
      listings.forEach(listing => {
          const listingHTML = `
              <div class="col-md-3" style="padding-bottom: 2%;">
                  <div class="card">
                      <img src="${listing.image}" class="card-img-top" alt="${listing.name}">
                      <div class="card-body">
                          <h5 class="card-title">${listing.name}</h5>
                          <p class="card-text">${listing.price}</p>
                          <a href="details.html" class="btn btn-primary view-details" 
                              data-name="${listing.name}" 
                              data-price="${listing.price}" 
                              data-image="${listing.image}" 
                              data-description="${listing.description}">
                              View Details
                          </a>
                      </div>
                  </div>
              </div>
          `;
          listingsContainer.innerHTML += listingHTML;
      });

      // Rebind View Details buttons
      bindViewDetailsButtons();
  }
}

// Function to Append New Listings to Featured Items
function displayFeaturedListings() {
  const featuredItemsContainer = document.getElementById("featuredItemsContainer");
  if (!featuredItemsContainer) return;

  const listings = JSON.parse(localStorage.getItem("listings")) || [];

  // Append ALL listings without removing old ones
  listings.forEach(listing => {
      const listingHTML = `
          <div class="col-md-3" style="padding-bottom: 2%;">
              <div class="card">
                  <img src="${listing.image}" class="card-img-top" alt="${listing.name}">
                  <div class="card-body">
                      <h5 class="card-title">${listing.name}</h5>
                      <p class="card-text">$${listing.price}</p>
                      <a href="details.html" class="btn btn-primary view-details" 
                          data-name="${listing.name}" 
                          data-price="${listing.price}" 
                          data-image="${listing.image}" 
                          data-description="${listing.description}">
                          View Details
                      </a>
                  </div>
              </div>
          </div>
      `;
      featuredItemsContainer.innerHTML += listingHTML;
  });

  // Rebind View Details buttons
  bindViewDetailsButtons();
}

// Binds "View Details" button functionality
function bindViewDetailsButtons() {
  document.querySelectorAll(".view-details").forEach((button) => {
      button.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior

          // Retrieve product details from button attributes
          const productDetails = {
              name: button.getAttribute("data-name"),
              price: button.getAttribute("data-price"),
              image: button.getAttribute("data-image"),
              description: button.getAttribute("data-description") || "No description available."
          };

          // Store product details in localStorage
          localStorage.setItem("selectedProduct", JSON.stringify(productDetails));

          // Redirect to the product details page
          window.location.href = "details.html";
      });
  });
}

// IMAGE UPLOAD FUNCTIONALITY IN NEW LISTING PAGE
document.getElementById('imageInput')?.addEventListener('change', function(event) {
const file = event.target.files[0];
const previewImage = document.getElementById('previewImage');
const uploadText = document.getElementById('uploadText');
const removeButton = document.getElementById('removeImage');

if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.classList.remove('hidden');
        uploadText.classList.add('hidden');
        removeButton.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}
});

// REMOVE IMAGE FUNCTIONALITY
function removeImage() {
document.getElementById('imageInput').value = '';
document.getElementById('previewImage').src = '';
document.getElementById('previewImage').classList.add('hidden');
document.getElementById('uploadText').classList.remove('hidden');
document.getElementById('removeImage').classList.add('hidden');
}

// SUBMIT NEW LISTING AND SAVE TO LOCAL STORAGE
document.getElementById("listingForm")?.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent page reload

  // Get user inputs
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const imageInput = document.getElementById("imageInput").files[0];

  if (!name || !price || !description || !imageInput) {
      alert("Please fill in all fields and upload an image.");
      return;
  }

  // Read image as Base64
  const reader = new FileReader();
  reader.readAsDataURL(imageInput);
  reader.onload = function () {
      const imageUrl = reader.result;

      // Create a new product object
      const newListing = {
          name: name,
          price: price,
          description: description,
          image: imageUrl
      };

      // Get existing listings from localStorage or initialize an empty array
      const listings = JSON.parse(localStorage.getItem("listings")) || [];
      
      // Add the new listing to the END
      listings.push(newListing);

      // Save back to localStorage
      localStorage.setItem("listings", JSON.stringify(listings));

      // Redirect to index page so the new listing is appended at the bottom
      setTimeout(() => {
          window.location.href = "index.html";
      }, 500);
  };
});

// Load Listings on Page Load
document.addEventListener("DOMContentLoaded", function () {
  displayListings();
  displayFeaturedListings();
});

// Cart
// Function to Add Product to Cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in cart (based on name)
  let existingProduct = cart.find(item => item.name === product.name);
  
  if (existingProduct) {
      alert("This item is already in the cart.");
  } else {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Item added to cart!");
      updateCartCount();
  }
}

// Function to Display Cart Items in `cart.html` with Proper Layout
function displayCartItems() {
  const cartContainer = document.getElementById("cartContainer");
  const checkoutButtonContainer = document.getElementById("checkoutButtonContainer");
  const totalAmountElement = document.getElementById("totalAmount");

  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";

  let totalAmount = 0;

  if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      checkoutButtonContainer.style.display = "none"; // Hide checkout if empty
  } else {
      cart.forEach(item => {
          totalAmount += parseFloat(item.price); // Sum up prices

          const cartItemHTML = `
              <div class="row align-items-center mb-3 p-3 border rounded shadow-sm">
                  <div class="col-md-2 text-center">
                      <img src="${item.image}" class="img-fluid rounded" alt="${item.name}" style="max-width: 100px;">
                  </div>
                  <div class="col-md-6">
                      <h5 class="mb-1">${item.name}</h5>
                      <p class="mb-1 text-muted">${item.description}</p>
                      <p class="mb-1 text-primary"><strong>$${item.price}</strong></p>
                  </div>
                  <div class="col-md-4 text-end">
                      <button class="btn btn-danger btn-sm remove-from-cart" data-name="${item.name}">Remove</button>
                  </div>
              </div>
          `;
          cartContainer.innerHTML += cartItemHTML;
      });

      checkoutButtonContainer.style.display = "block"; // Show checkout button
  }

  // Update total amount
  totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;

  bindRemoveFromCartButtons();
}

// Re-run function on page load
document.addEventListener("DOMContentLoaded", function () {
  displayCartItems();
});




// Function to Remove Item from Cart
function bindRemoveFromCartButtons() {
  document.querySelectorAll(".remove-from-cart").forEach(button => {
      button.addEventListener("click", function () {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const productName = this.getAttribute("data-name");

          // Remove the item from cart
          cart = cart.filter(item => item.name !== productName);
          localStorage.setItem("cart", JSON.stringify(cart));

          alert("Item removed from cart.");
          displayCartItems();
          updateCartCount();
      });
  });
}

// Function to Handle Checkout and Redirect to `checkout.html`
function bindCheckoutButton() {
  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
      checkoutButton.addEventListener("click", function () {
          // Redirect user to checkout page
          window.location.href = "checkout.html";
      });
  }
}

// Function to Update Cart Count in Navigation Bar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

// Attach "Add to Cart" Button Click Event in `details.html`
document.addEventListener("DOMContentLoaded", function () {
  // Ensure Cart Count Updates Across Pages
  updateCartCount();

  // If we're on details.html, attach event to Add to Cart button
  const addToCartButton = document.querySelector(".btn-primary.btn-lg");
  if (addToCartButton) {
      addToCartButton.addEventListener("click", function () {
          const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));
          if (productDetails) {
              addToCart(productDetails);
          }
      });
  }

  // Display Cart Items if on Cart Page
  displayCartItems();
});

// Clear local storage
/*
if (!sessionStorage.getItem("firstLoad")) {
    localStorage.clear();  // Clear localStorage on first load
    sessionStorage.setItem("firstLoad", "true"); // Set session flag
}
*/

// Chats
// Sample Chat Data
const chats = [
    { id: 1, name: "Customer Support", messages: ["Welcome to MokeShop!", "How can we be of assistance today?"] },
    { id: 2, name: "John Doe", messages: ["Hello!", "Is this for sale?"] },
    { id: 3, name: "Jane Smith", messages: ["Hey!", "Is the product still available?"] },
    { id: 4, name: "Yoshihiro", messages: ["The price is fixed", "$1 for the slavs"] }
];

let activeChatId = null; // Track current chat

// Display Chat List
function loadChats() {
    const chatList = document.getElementById("chatList");
    chatList.innerHTML = "";

    chats.forEach(chat => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = chat.name;
        li.onclick = () => openChat(chat.id);
        chatList.appendChild(li);
    });
}

// Open Chat
function openChat(chatId) {
    activeChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    document.getElementById("chatHeader").textContent = chat.name;
    
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    chat.messages.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("chat-bubble", "received");
        div.textContent = msg;
        chatMessages.appendChild(div);
    });
}

// Send Message
function sendMessage() {
    if (!activeChatId) return alert("Select a chat first!");
    
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (message === "") return;

    // Add Message to UI
    const chatMessages = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.classList.add("chat-bubble", "sent");
    div.textContent = message;
    chatMessages.appendChild(div);

    // Save Message
    const chat = chats.find(c => c.id === activeChatId);
    chat.messages.push(message);

    input.value = ""; // Clear Input
}

// Load Chats on Page Load
document.addEventListener("DOMContentLoaded", loadChats);

// Sign in and Sign up
document.addEventListener("DOMContentLoaded", function () {
    // Sign Up Form Handling
    const signUpForm = document.querySelector("#signUpForm");
    if (signUpForm) {
        signUpForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form behavior

            // Get user input values
            const email = document.querySelector("#exampleInputEmail1").value;
            const username = document.querySelector("#exampleInputUsername1").value;
            const password = document.querySelector("#exampleInputPassword1").value;

            if (email && username && password) {
                // Store user data in localStorage
                localStorage.setItem("userEmail", email);
                localStorage.setItem("username", username);
                localStorage.setItem("userPassword", password);

                alert("Sign Up successful! Redirecting to Home Page.");
                signUpForm.submit(); // Allow the form to actually submit
                window.location.href = "index.html"; // Redirect to Home
            } else {
                alert("Please fill in all fields.");
            }
        });
    }

    // Sign In Form Handling
    const signInForm = document.querySelector("#signInForm");
    if (signInForm) {
        signInForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form behavior

            // Get user input values
            const email = document.querySelector("#exampleInputEmail1").value;
            const password = document.querySelector("#exampleInputPassword1").value;

            // Retrieve stored credentials
            const storedEmail = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword");

            if (email === storedEmail && password === storedPassword) {
                alert("Sign In successful! Redirecting to Home Page.");
                signInForm.submit(); // Allow the form to actually submit
                window.location.href = "index.html"; // Redirect to Home
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("welcomeUser").innerText = `Welcome, ${username}!`;
    }
});

// minor changes perchance
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve and display the username in the navbar
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("welcomeUser").innerText = `Welcome, ${username}!`;
    }
});

// Ensure cart count updates across pages
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
});

// Attach event listener to checkout button
document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            const username = localStorage.getItem("username");

            if (!username) {
                alert("Please sign in before proceeding to checkout.");
                window.location.href = "sign-in.html";
            } else {
                window.location.href = "checkout.html";
            }
        });
    }
});

// Function to clear cart after successful checkout
document.addEventListener("DOMContentLoaded", function () {
    const confirmCheckoutButton = document.querySelector(".btn-primary.btn-sm");
    if (confirmCheckoutButton) {
        confirmCheckoutButton.addEventListener("click", function () {
            alert("Thank you for your purchase! Your order has been placed.");
            localStorage.removeItem("cart"); // Clear the cart
            updateCartCount();
            window.location.href = "index.html"; // Redirect back to home
        });
    }
});
