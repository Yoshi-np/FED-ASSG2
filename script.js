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

// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("featuredItemsContainer"); // Parent container

    container.addEventListener("click", function (event) {
        const button = event.target.closest(".view-details"); // Check if a .view-details button was clicked

        if (button) {
            event.preventDefault(); // Prevent default link behavior

            // Retrieve product details from button attributes
            const productDetails = {
                name: button.getAttribute("data-name"),
                price: button.getAttribute("data-price"),
                image: button.getAttribute("data-image"),
                description: button.getAttribute("data-description") || "No description available.",
                id: button.getAttribute("data-id")

            };
            

            // Store product details in localStorage
            localStorage.setItem("selectedProduct", JSON.stringify(productDetails));
            console.log(localStorage)

            // Redirect to the product details page
            window.location.href = "details.html";
        }
    });
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




// Load Listings on Page Load
document.addEventListener("DOMContentLoaded", function () {
  displayListings();
  displayFeaturedListings();
});

// Re-run function on page load
document.addEventListener("DOMContentLoaded", function () {
  displayCartItems();
});




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

// Function to confirm checkout and show animation
function confirmCheckout() {
    console.log("Checkout initiated..."); // Debugging log

    // Hide checkout form
    const checkoutContainer = document.querySelector(".card.p-4.shadow");
    if (checkoutContainer) {
        checkoutContainer.style.display = "none";
    }

    // Show success animation container
    const animationContainer = document.getElementById("success-animation-container");
    animationContainer.style.display = "block";

    // Load Lottie animation dynamically
    const lottieContainer = document.getElementById("lottie-animation");
    lottieContainer.innerHTML = ""; // Clear existing animation (prevents duplication)

    lottie.loadAnimation({
        container: lottieContainer, // Div container
        renderer: "svg",
        loop: false, // Play once
        autoplay: true,
        path: "https://lottie.host/5018eabf-6fd3-42e2-943d-6186d5e3e9e5/FK2vRQSoHC.json" // ✅ Valid Lottie JSON URL
    });

    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();

    // Redirect to home after animation completes
    setTimeout(() => {
        window.location.href = "index.html";
    }, 4000); // Redirect after 4 seconds
}


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
            const user = localStorage.getItem("loggedInUser");

            if (!user) {
                alert("Please sign in before proceeding to checkout.");
                window.location.href = "sign-in.html";
            } else {
                window.location.href = "checkout.html";
            }
        });
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const signInLink = document.querySelector('nav ul li a[href="sign-in.html"]');

    if (user && signInLink) {
        // Change text to "Sign Out"
        signInLink.textContent = "Sign Out";
        signInLink.href = "#"; // Prevent navigation

        // Add event listener to log out when clicked
        signInLink.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent page reload
            localStorage.removeItem("loggedInUser"); // Remove user data
            alert("You have been signed out.");
            location.reload(); // Refresh page
        });
    }
});

// Lottie Animation
// Function to confirm checkout and show animation
function confirmCheckout() {
    // Hide checkout form
    document.getElementById("checkout-container").style.display = "none";
    
    // Show success animation
    document.getElementById("success-animation-container").style.display = "block";
    
    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();
    
    // Redirect to home after animation plays
    setTimeout(() => {
        window.location.href = "index.html";
    }, 6000);
}

document.getElementById("clearButton").addEventListener("click", function () {
    localStorage.clear();
    alert("Local Storage Cleared!");
});
