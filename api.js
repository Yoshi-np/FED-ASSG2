
  
  document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "https://fedassg2-b98f.restdb.io/rest/items"; 
    const API_KEY = "67a82110600a70a125de5be7"; 
    async function fetchItems() {
        try {
            const response = await fetch(API_URL, {
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
                               data-description="${item.description}">
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
                Cart: []
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
                console.log("Checking user credentials..."); // Debugging log

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

