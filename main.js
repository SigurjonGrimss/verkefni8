import { createCartLine, showCartContent } from './lib/ui.js'; //base formatið, showcart items
import { formatPrice } from './lib/helpers.js'; //Tekið út úr ui.js skjalinu 


const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/**
 * Bæta vöru í körfu
 * @param  {Product} product
 * @param {number} quantity 
 */
function addProductToCart(product, quantity) {
  const cartTableBodyElement = document.querySelector('.cart table tbody');
  
  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart table');
    return;
  }
  
  // hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  const existingCartLine = cartTableBodyElement.querySelector(`tr[data-product-id="${product.id}"]`);
  
  if (existingCartLine) { // Ef nægilegt magn er til, þá er hægt að uppfæra fjöldann
    const quantityElement = existingCartLine.querySelector('.quantity');
    const totalElement = existingCartLine.querySelector('.total');
    
    const currentQuantity = parseInt(quantityElement.textContent, 10);
    const newQuantity = currentQuantity + quantity;

    quantityElement.textContent = newQuantity;
    totalElement.textContent = formatPrice(product.price * newQuantity);
  } else {
    const cartLine = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(cartLine);
  }

  // Innihald körfunnar ásamt magni við hverja uppfærsu á sjálfri körfunni
  showCartContent(true);
  
  updateCartTotal();
}
function updateCartTotal() {
  const cartTableBodyElement = document.querySelector('.cart table tbody');
  
  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart table');
    return;
  }

  const totalElement = document.querySelector('.cart tfoot .price');
  if (!totalElement) {
    console.warn('fann ekki .cart tfoot .price');
    return;
  }

  let total = 0;

  
  const cartLines = cartTableBodyElement.querySelectorAll('tr');
  for (const cartLine of cartLines) {
    const quantityElement = cartLine.querySelector('.quantity');
    const priceElement = cartLine.querySelector('.total .price');

    if (quantityElement && priceElement) {
      const quantity = parseInt(quantityElement.textContent, 10);
      const price = parseInt(priceElement.textContent.replace(' kr.-', '').replace('.', ''), 10);
      total += quantity * price;
    }
  }

  totalElement.textContent = formatPrice(total);
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr');

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product) {
    return;
  }

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantityInput = parent.querySelector('input[type="number"]');
  const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// TODO bæta við event handler á form sem submittar pöntun
