document.addEventListener("DOMContentLoaded", function () {
  // Navigation Toggle
  const bar = document.getElementById("bar");
  const close = document.getElementById("close");
  const nav = document.getElementById("navbar");
  const cartLink = document.querySelector("#lg-bag a"); // Cart icon link

  if (bar) {
      bar.addEventListener("click", () => {
          nav.classList.add("active");
      });
  }

  if (close) {
      close.addEventListener("click", () => {
          nav.classList.remove("active");
      });
  }

  // Show popup if cart is empty when clicking cart icon
  if (cartLink) {
      cartLink.addEventListener("click", function (event) {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          if (cart.length === 0) {
              event.preventDefault(); // Stop navigation
              alert("Your cart is empty!");
          }
      });
  }

  // Load the cart when the page loads
  loadCart();

  // Handle adding items to cart
  let cartButtons = document.querySelectorAll(".bx-cart");
  cartButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
          let product = event.target.closest(".pro");
          addToCart(product);
      });
  });

  // Handle cart quantity changes & remove items
  let cartTable = document.querySelector(".cart-items");
  if (cartTable) {
      cartTable.addEventListener("click", function (event) {
          if (event.target.classList.contains("cart-quantity")) {
              updateCart();
          }
          if (event.target.classList.contains("remove-item")) {
              removeItem(event.target);
          }
      });
  }

  // Handle Purchase button
  let purchaseButton = document.querySelector(".btn-purchase");
  if (purchaseButton) {
      purchaseButton.addEventListener("click", function () {
          alert("Thank you for your purchase!");
          localStorage.removeItem("cart");
          loadCart();
      });
  }
});

// Function to add a product to cart
function addToCart(product) {
  let title = product.querySelector("h5").innerText;
  let price = product.querySelector("h4").innerText.replace("₹", "").trim();
  let imageSrc = product.querySelector("img").src;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingItem = cart.find((item) => item.title === title);

  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ title, price, imageSrc, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
  loadCart();
}

// Function to load cart items into the cart table
function loadCart() {
  let cartTable = document.querySelector(".cart-items");
  let totalPriceElement = document.querySelector(".cart-total-price");

  if (!cartTable || !totalPriceElement) return;

  cartTable.innerHTML = "";
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;

  cart.forEach((item, index) => {
      let row = document.createElement("tr");
      row.innerHTML = `
          <td><img src="${item.imageSrc}" width="50"> ${item.title}</td>
          <td>₹${item.price}</td>
          <td><input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-index="${index}"></td>
          <td><button class="remove-item btn btn-danger" data-index="${index}">Remove</button></td>
      `;
      cartTable.appendChild(row);
      totalPrice += item.price * item.quantity;
  });

  totalPriceElement.innerText = `₹${totalPrice}`;
}

// Function to update cart when quantity changes
function updateCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let quantityInputs = document.querySelectorAll(".cart-quantity");

  quantityInputs.forEach((input) => {
      let index = input.getAttribute("data-index");
      cart[index].quantity = parseInt(input.value);
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Function to remove an item from cart
function removeItem(button) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let index = button.getAttribute("data-index");

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}
