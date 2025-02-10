const API_URL = "https://fedassg2-b98f.restdb.io/rest"; 
const API_KEY = "67a82110600a70a125de5be7"; 
  
document.addEventListener("DOMContentLoaded", async function () {
    async function fetchItems() {
        try {
            const response = await fetch(API_URL+"/items", {
                method: "GET",
                headers: {
                    "x-apikey": API_KEY,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const items = await response.json();
            displayItems(items);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    function displayItems(items) {
        const container = document.getElementById("featuredItemsContainer");
        container.innerHTML = ""; // Clear existing hardcoded content

        items.forEach(item => {
            const itemHTML = `
                <div class="col-md-3" style="padding-bottom: 2%;">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">$${item.price}</p>
                            <a href="details.html" class="btn btn-primary view-details" 
                                data-name="${item.name}" 
                                data-price="${item.price}" 
                                data-image="${item.image}" 
                                data-description="${item.description}"
                                data-id="${item._id}">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
    }
    fetchItems();
});

document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUpForm");

    if (signUpForm) {
        signUpForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            console.log("Form Submitted!"); // Debugging log

            // Get input values
            const email = document.getElementById("exampleInputEmail1")?.value.trim();
            const username = document.getElementById("exampleInputUsername1")?.value.trim();
            const password = document.getElementById("exampleInputPassword1")?.value.trim();

            // Validate fields (basic check)
            if (!email || !username || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            // Prepare user data object
            const userData = {
                Email: email,
                username: username,
                Password: password,
                cart: [],
                purchasehistory: []
            };

            try {
                console.log("Sending request...", userData); // Debugging log

                // Send data to RestDB.io
                const response = await fetch("https://fedassg2-b98f.restdb.io/rest/myuser", {
                    method: "POST",
                    headers: {
                        "x-apikey": "67a82110600a70a125de5be7",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    throw new Error(`Signup failed: ${response.statusText}`);
                }

                const result = await response.json();
                console.log("User created:", result);

                // Store user in localStorage (to simulate login session)
                localStorage.setItem("loggedInUser", JSON.stringify(result));

                // Redirect to home page after signup
                alert("Signup successful! Redirecting to homepage.");
                window.location.href = "index.html";

            } catch (error) {
                console.error("Signup Error:", error);
                alert("Error signing up. Please try again.");
            }
        });
    } else {
        console.error("SignUp Form Not Found in DOM");
    }
});


document.addEventListener("DOMContentLoaded", function () {

    const signInForm = document.getElementById("signInForm");

    if (signInForm) {
        signInForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            console.log("Sign-In Form Submitted!"); // Debugging log

            // Get input values
            const email = document.getElementById("exampleInputEmail1")?.value.trim();
            const password = document.getElementById("exampleInputPassword1")?.value.trim();

            // Validate fields (basic check)
            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            try {
                const response = await fetch("https://fedassg2-b98f.restdb.io/rest/myuser", {
                    method: "GET",
                    headers: {
                        "x-apikey": "67a82110600a70a125de5be7", // Replace with your actual RestDB API Key
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error fetching users: ${response.statusText}`);
                }

                const users = await response.json();
                console.log("Users retrieved:", users); // Debugging log

                // Find user by email and check password
                const foundUser = users.find(user => user.Email === email && user.Password === password);

                if (foundUser) {
                    console.log("Login successful! User:", foundUser);

                    // Store user details in localStorage (to keep user logged in)
                    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

                    // Redirect to homepage after login
                    alert("Sign-in successful! Redirecting to homepage.");
                    window.location.href = "index.html";
                } else {
                    alert("Invalid email or password. Please try again.");
                }

            } catch (error) {
                console.error("Sign-in Error:", error);
                alert("Error signing in. Please try again.");
            }
        });
    } else {
        console.error("Sign-In Form Not Found in DOM");
    }
});

// Function to Fetch Logged-in User's Cart from RestDB.io
async function getUserCart() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return [];

    try {
        const response = await fetch(`${API_URL}/myuser/${user._id}`, {
            method: "GET",
            headers: {
                "x-apikey": API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch cart");

        const userData = await response.json();
        return userData.cart || [];
    } catch (error) {
        console.error("Error fetching cart:", error);
        return [];
    }
}

// Function to Update User's Cart in RestDB.io
async function updateUserCart(cart) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("You need to be signed in to add items to the cart.");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/myuser/${user._id}`, {
            method: "PATCH",
            headers: {
                "x-apikey": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cart }) // Updating only the cart field
        });

        if (!response.ok) throw new Error("Failed to update cart");

        console.log("Cart updated in RestDB:", await response.json());
        updateCartCount(); // Refresh cart count in UI

    } catch (error) {
        console.error("Error updating cart:", error);
    }
}

// Function to Add Product to Cart (Triggered by Button Click)
async function addToCart() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("You must be signed in to add items to the cart.");
        return;
    }

    const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!productDetails) {
        alert("No product selected.");
        return;
    }

    let cart = await getUserCart();

    // Check if product already exists in cart (based on name)
    let existingProduct = cart.find(item => item.name === productDetails.name);

    if (existingProduct) {
        alert("This item is already in the cart.");
    } else {
        cart.push(productDetails); // Add new item to cart array
        await updateUserCart(cart); // Save updated cart to RestDB
        alert("Item added to cart!");
    }
}

// Function to Update Cart Count in Navigation Bar
async function updateCartCount() {
    let cart = await getUserCart();
    const cartCountElement = document.getElementById("cart-count");
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    } else {
        console.error("Cart count element not found.");
    }
}


// Attach "Add to Cart" Button Click Event in `details.html`
window.onload = async function () {

    await updateCartCount();

    // Get the "Add to Cart" button using its ID
    const addToCartButton = document.getElementById("addtocartbutton");
    if (addToCartButton) {
        addToCartButton.addEventListener("click", async function () {
            await addToCart();
        });
    } else {
        console.error("Add to Cart button not found.");
    }

    // Display Selected Product Details on `details.html`
    const productDetails = JSON.parse(localStorage.getItem("selectedProduct"));
    if (productDetails) {
        document.getElementById("product-name").textContent = productDetails.name;
        document.getElementById("product-price").textContent = `$${productDetails.price}`;
        document.getElementById("product-image").src = productDetails.image;
        document.getElementById("product-description").textContent = productDetails.description;
    }

};

// Redirects button "back to home" back to home
function goHome() {
    window.location.href = "index.html"; // Redirects to the homepage
}

async function updatePurchaseHistory(purchases){

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("You need to be signed in to purchase items.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/myuser/${user._id}`, {
            method: "GET",
            headers: {
                "x-apikey": API_KEY,
                "Content-Type": "application/json"
            },
        });
        
        if (!response.ok) throw new Error("Failed to update purchases");

        const userData = await response.json();
        console.log("User retrieved:", userData); // Debugging log

        purchasehistory = userData.purchasehistory;



    } catch (error) {
        console.error("Error retrieving purchase history:", error);
    }

    //append purchases to purchase history
    purchasehistory.push(purchases); // Add new item to cart array

    try {
        const response = await fetch(`${API_URL}/myuser/${user._id}`, {
            method: "PATCH",
            headers: {
                "x-apikey": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({purchasehistory}) // Updating only the purchasehistory field
        });

        if (!response.ok) throw new Error("Failed to update purchases");

        console.log("purchase history updated in RestDB:", await response.json());

    } catch (error) {
        console.error("Error updating purchase history:", error);
    }
}

async function uploadImage(file) {
    if (!file) {
        console.error("No file selected.");
        return null;
    }

    const filename = file.name; // Extract filename
    const imagePath = `./images/${filename}`; // Format path as required

    console.log("Formatted Image Path:", imagePath);
    
    return imagePath; // Simply return the path (not actually uploading)
}

document.getElementById("feedback-form")?.addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const sellerName = document.getElementById("seller-name").value.trim();
    const feedbackText = document.getElementById("feedback").value.trim();
    const imageInput = document.getElementById("imageUpload").files[0]; // Get the selected file

    if (!sellerName || !feedbackText || !imageInput) {
        alert("Please fill in all fields and upload an image.");
        return;
    }

    try {
        const imagePath = await uploadImage(imageInput); // Get the image path

        // Create the feedback object
        const feedbackData = {
            sellerusername: sellerName,
            feedback: feedbackText,
            image: imagePath // Store the formatted image path
        };

        console.log("Submitting Feedback:", feedbackData); // Debugging log

        // Send feedback data to RestDB
        const response = await fetch("https://fedassg2-b98f.restdb.io/rest/feedback", {
            method: "POST",
            headers: {
                "x-apikey": "67a82110600a70a125de5be7",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit feedback: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Feedback submitted:", result);
        alert("Feedback submitted successfully!");

        // Redirect to feedback page
        window.location.href = "index.html";

    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Error submitting feedback. Please try again.");
    }
});


document.getElementById("listingForm")?.addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    // Get user inputs
    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value.trim()); // Convert price to number
    const description = document.getElementById("productDescription").value.trim();
    const imageInput = document.getElementById("imageInput").files[0]; // Get file from input

    // Validate inputs
    if (!name || !price || !description || !imageInput) {
        alert("Please fill in all fields and upload an image.");
        return;
    }

    // Generate correct image path (assume images are stored in '/images/' folder)
    const imagePath = `./images/${imageInput.name}`;

    // Create a new product object
    const newListing = {
        name: name,
        price: price,
        description: description,
        image: imagePath // Store correct image path
    };

    try {
        // Send new listing to RestDB
        const response = await fetch("https://fedassg2-b98f.restdb.io/rest/items", {
            method: "POST",
            headers: {
                "x-apikey": "67a82110600a70a125de5be7", // Your API Key
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newListing)
        });

        if (!response.ok) {
            throw new Error(`Failed to save listing: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Listing added:", result);

        // Show success message
        alert("Successfully Added Listing!");

        // Redirect to index page after a short delay
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);

    } catch (error) {
        console.error("Error saving listing:", error);
        alert("Error saving listing. Please try again.");
    }
});

async function displayCartItems() {
    const cartContainer = document.getElementById("cartContainer");
    const checkoutButtonContainer = document.getElementById("checkoutButtonContainer");
    const totalAmountElement = document.getElementById("totalAmount");
  
    if (!cartContainer) return;
  
    let cart = await getUserCart();
  
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
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}" style="max-width: 200px;">
                    </div>
                    <div class="col-md-6">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="mb-1 text-muted">${item.description}</p>
                        <p class="mb-1 text-primary"><strong>$${item.price}</strong></p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remove</button>
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

// Function to Remove Item from Cart
function bindRemoveFromCartButtons() {
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", async function () {
          let cart = await getUserCart();
          const productid = this.getAttribute("data-id");
  
          // Remove the item from cart
          cart = cart.filter(item => item.id !== productid);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateUserCart(cart);
  
  
          alert("Item removed from cart.");
          displayCartItems();
          updateCartCount();
        });
    });
  }

  
document.addEventListener("DOMContentLoaded", function () {
    const confirmCheckoutButton = document.querySelector(".btn-primary.btn-sm");
    
    if (confirmCheckoutButton) {
        confirmCheckoutButton.addEventListener("click", async function () {
            alert("Thank you for your purchase! Your order has been placed.");
            
            let cart = await getUserCart(); // Fetch the current cart
            let purchases = [...cart]; // Copy current cart items

            if (purchases.length === 0) {
                alert("Your cart is empty. Add items before checkout.");
                return;
            }

            // Save purchase history before clearing cart
            await updatePurchaseHistory(purchases);

            // Clear cart from database
            await updateUserCart([]); // Set cart to empty array in RestDB

            // Clear localStorage cart
            localStorage.removeItem("cart");

            alert("Your cart has been cleared!");
            updateCartCount(); // Update UI Cart Count

            // Redirect back to home AFTER database update
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        });
    }
});
