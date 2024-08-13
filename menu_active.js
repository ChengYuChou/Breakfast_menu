let totalAmount = 0;
const cartItems = {};

function addToCart(button) {
  const item = button.parentElement;
  const id = item.getAttribute('data-id');
  const name = item.querySelector('h2').textContent;
  const price = parseFloat(item.getAttribute('data-price'));
  const selectElement = item.querySelector('select');
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedDrink = selectedOption.textContent;

  if (!cartItems[id]) {
    cartItems[id] = { name, price, quantities: { [selectedDrink]: 1 } };
  } else {
    if (!cartItems[id].quantities[selectedDrink]) {
      cartItems[id].quantities[selectedDrink] = 1;
    } else {
      cartItems[id].quantities[selectedDrink]++;
    }
  }

  totalAmount += price;
  updateTotal();
  updateCart();
}

function decreaseQuantity(id, drink) {
  if (cartItems[id] && cartItems[id].quantities[drink] > 1) {
    cartItems[id].quantities[drink]--;
    totalAmount -= cartItems[id].price;
    updateTotal();
    updateCart();
  } else if (cartItems[id] && cartItems[id].quantities[drink] === 1) {
    totalAmount -= cartItems[id].price;
    delete cartItems[id].quantities[drink];
    if (Object.keys(cartItems[id].quantities).length === 0) {
      delete cartItems[id];
    }
    updateTotal();
    updateCart();
  }
}

function increaseQuantity(id, drink) {
  if (cartItems[id]) {
    if (!cartItems[id].quantities[drink]) {
      cartItems[id].quantities[drink] = 1;
    } else {
      cartItems[id].quantities[drink]++;
    }
    totalAmount += cartItems[id].price;
    updateTotal();
    updateCart();
  }
}

function updateCart() {
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';

  for (const id in cartItems) {
    const { name, price, quantities } = cartItems[id];
    for (const drink in quantities) {
      const quantity = quantities[drink];
      const cartItem = document.createElement('li');
      cartItem.innerHTML = `
        ${name} (${drink}) - 
        <button class="decrease" onclick="decreaseQuantity('${id}', '${drink}')">-</button>
        <span class="cart-quantity">${quantity}</span>
        <button class="increase" onclick="increaseQuantity('${id}', '${drink}')">+</button>
        個
        <span class="cart-price">$${(price * quantity).toFixed(2)}</span>
      `;
      cartList.appendChild(cartItem);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('menuButton');
  const menu = document.querySelector('.menu');

  menuButton.addEventListener('click', function() {
      menu.classList.toggle('show');
  });
});

function updateTotal() {
  const totalElement = document.getElementById('totalAmount');
  totalElement.textContent = '$' + totalAmount.toFixed(2);
}
