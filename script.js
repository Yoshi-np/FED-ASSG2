// Search Bar 

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const productCards = document.querySelectorAll(".col-md-3");

  searchInput.addEventListener("keyup", function () {
      let filter = searchInput.value.toLowerCase().trim();

      productCards.forEach((card) => {
          let productName = card.querySelector(".card-title").innerText.toLowerCase();

          if (productName.includes(filter)) {
              card.style.display = "block"; // Show matching products
          } else {
              card.style.display = "none"; // Hide non-matching products
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
      document.getElementById("product-price").textContent = productDetails.price;
      document.getElementById("product-image").src = productDetails.image;
      document.getElementById("product-description").textContent = productDetails.description;
  } else {
      // If no product is found, show a default message
      document.querySelector(".product-info").innerHTML = "<h2>Product not found</h2>";
  }
});

// Listings
document.getElementById('imageInput').addEventListener('change', function(event) {
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

function removeImage() {
  const imageInput = document.getElementById('imageInput');
  const previewImage = document.getElementById('previewImage');
  const uploadText = document.getElementById('uploadText');
  const removeButton = document.getElementById('removeImage');

  imageInput.value = ''; // Reset file input
  previewImage.src = '';
  previewImage.classList.add('hidden');
  uploadText.classList.remove('hidden');
  removeButton.classList.add('hidden');
}
