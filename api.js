const API_URL = "https://fedassg2-b98f.restdb.io/rest"; 
const API_KEY = "67a82110600a70a125de5be7"; 
  
document.addEventListener("DOMContentLoaded", async function () {
    // const API_URL = "https://fedassg2-b98f.restdb.io/rest/items"; 
    // const API_KEY = "67a82110600a70a125de5be7"; 
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
                //delete
                // console.log("Checking user credentials..."); // Debugging log
                // const response = await fetch("https://fedassg2-b98f.restdb.io/rest/myuser/67a895d8bb50491a0001570a", {
                //         method: "GET",
                //         headers: {
                //             "x-apikey": "67a82110600a70a125de5be7", // Replace with your actual RestDB API Key
                //             "Content-Type": "application/json"
                //         }
                //     });
                // const user = await response.json();
                // console.log("User retrieved:", user); // Debugging log
                // // Store user details in localStorage (to keep user logged in)
                // localStorage.setItem("loggedInUser", JSON.stringify(user));

                // // Redirect to homepage after login
                // alert("Sign-in successful! Redirecting to homepage.");
                // window.location.href = "index.html";
                // Fetch all users from RestDB.io
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
    // const API_URL = "https://fedassg2-b98f.restdb.io/rest/myuser"; 
    // const API_KEY = "67a82110600a70a125de5be7"; 
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
