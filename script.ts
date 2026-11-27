
type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  specs: string[];
};

type CartItem = {
  productId: number;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    brand: "Apple",
    description: "Apple iPhone 16 Pro with a premium titanium design and advanced camera.",
    price: 3299,
    image: "img/iphone-16-pro.png",
    specs: ["Apple A18 Pro", "6.3-inch display", "48MP camera", "Titanium design"]
  },
  {
    id: 2,
    name: "iPhone 16",
    brand: "Apple",
    description: "Powerful iPhone with a beautiful display and advanced camera.",
    price: 2399,
    image: "img/iphone-16.png",
    specs: ["Apple A18", "6.1-inch display", "48MP camera", "USB-C"]
  },
  {
    id: 3,
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    description: "Samsung flagship with an advanced camera and large display.",
    price: 3599,
    image: "img/samsung-ultra.png",
    specs: ["Snapdragon 8 Elite", "6.9-inch display", "200MP camera", "5000mAh battery"]
  },
  {
    id: 4,
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    description: "Compact flagship smartphone with powerful performance.",
    price: 2499,
    image: "img/samsung-s25.png",
    specs: ["Snapdragon 8 Elite", "6.2-inch display", "50MP camera", "4000mAh battery"]
  },
  {
    id: 5,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    description: "Premium smartphone designed for photography and performance.",
    price: 2999,
    image: "img/xiaomi-15.png",
    specs: ["Snapdragon 8 Elite", "6.73-inch display", "Leica camera system", "5410mAh battery"]
  },
  {
    id: 6,
    name: "Xiaomi 14T Pro",
    brand: "Xiaomi",
    description: "Powerful smartphone with fast charging and an advanced camera.",
    price: 1799,
    image: "img/xiaomi-15.png",
    specs: ["MediaTek Dimensity 9300+", "6.67-inch display", "50MP camera", "5000mAh battery"]
  },
  {
    id: 7,
    name: "iPhone 15",
    brand: "Apple",
    description: "iPhone with Dynamic Island and an advanced dual camera.",
    price: 1899,
    image: "img/iphone-15.png",
    specs: ["Apple A16 Bionic", "6.1-inch display", "48MP camera", "USB-C"]
  },
  {
    id: 8,
    name: "Samsung Galaxy A56",
    brand: "Samsung",
    description: "Modern Samsung smartphone with a bright display and long-lasting battery.",
    price: 1199,
    image: "img/samsung-s25.png",
    specs: ["Exynos 1580", "6.7-inch display", "50MP camera", "5000mAh battery"]
  }
];

let cart: CartItem[] = JSON.parse(localStorage.getItem("mobi-shopping-cart") || "[]");

const productsGrid = document.querySelector<HTMLDivElement>("#productsGrid");
const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
const filterButtons = document.querySelector<HTMLDivElement>("#filterButtons");
const emptyMessage = document.querySelector<HTMLElement>("#emptyMessage");

const cartButton = document.querySelector<HTMLButtonElement>("#cartButton");
const closeCart = document.querySelector<HTMLButtonElement>("#closeCart");
const cartPanel = document.querySelector<HTMLDivElement>("#cartPanel");
const cartOverlay = document.querySelector<HTMLDivElement>("#cartOverlay");
const cartItems = document.querySelector<HTMLDivElement>("#cartItems");
const cartCount = document.querySelector<HTMLElement>("#cartCount");
const cartTotal = document.querySelector<HTMLElement>("#cartTotal");
const checkoutButton = document.querySelector<HTMLButtonElement>("#checkoutButton");
const checkoutMessage = document.querySelector<HTMLElement>("#checkoutMessage");

const menuButton = document.querySelector<HTMLButtonElement>("#menuButton");
const siteNavigation = document.querySelector<HTMLElement>("#navigation");

function formatPrice(price: number): string {
  return `${price.toLocaleString("ka-GE")} ₾`;
}

function saveCart(): void {
  localStorage.setItem("mobi-shopping-cart", JSON.stringify(cart));
  renderCart();
}

function renderProducts(category = "ყველა", search = ""): void {
  if (!productsGrid) return;

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === "ყველა" || product.brand === category;
    const matchesSearch = `${product.name} ${product.brand}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  productsGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <a class="product-card-link" href="product.html?id=${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <span class="product-category">${product.brand}</span>
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-bottom">
            <span class="product-price">${formatPrice(product.price)}</span>
          </div>
        </div>
      </a>
      <button class="add-button" data-product-id="${product.id}">კალათაში დამატება</button>
    </article>
  `).join("");

  if (emptyMessage) {
    emptyMessage.hidden = filteredProducts.length > 0;
  }

  productsGrid.querySelectorAll<HTMLButtonElement>(".add-button").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.productId));
    });
  });
}

function renderProductDetails(): void {
  const productId = Number(new URLSearchParams(window.location.search).get("id"));
  const product = products.find(item => item.id === productId);

  const detailImage = document.querySelector<HTMLImageElement>("#detailImage");
  const detailBrand = document.querySelector<HTMLElement>("#detailBrand");
  const detailName = document.querySelector<HTMLElement>("#detailName");
  const detailDescription = document.querySelector<HTMLElement>("#detailDescription");
  const detailPrice = document.querySelector<HTMLElement>("#detailPrice");
  const breadcrumbName = document.querySelector<HTMLElement>("#breadcrumbName");
  const specList = document.querySelector<HTMLElement>("#specList");
  const detailAddButton = document.querySelector<HTMLButtonElement>("#detailAddButton");
  const detailNotice = document.querySelector<HTMLElement>("#detailNotice");
  const productDetail = document.querySelector<HTMLElement>(".product-detail");

  if (!product) {
    if (productDetail) {
      productDetail.innerHTML = "<h2>პროდუქტი ვერ მოიძებნა</h2><a href='index.html'>მთავარ გვერდზე დაბრუნება</a>";
    }
    return;
  }

  if (detailImage) {
    detailImage.src = product.image;
    detailImage.alt = product.name;
  }

  if (detailBrand) detailBrand.textContent = product.brand;
  if (detailName) detailName.textContent = product.name;
  if (detailDescription) detailDescription.textContent = product.description;
  if (detailPrice) detailPrice.textContent = formatPrice(product.price);
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  if (specList) {
    specList.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join("");
  }

  detailAddButton?.addEventListener("click", () => {
    addToCart(product.id);

    if (detailNotice) {
      detailNotice.textContent = "პროდუქტი წარმატებით დაემატა კალათაში";
      detailNotice.hidden = false;
    }
  });
}

function addToCart(productId: number): void {
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  saveCart();
}

function changeQuantity(productId: number, change: number): void {
  const item = cart.find(item => item.productId === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.productId !== productId);
  }

  saveCart();
}

function removeFromCart(productId: number): void {
  cart = cart.filter(item => item.productId !== productId);
  saveCart();
}

function renderCart(): void {
  if (!cartItems || !cartCount || !cartTotal) return;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = String(totalQuantity);
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">თქვენი კალათა ცარიელია</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.productId);
    if (!product) return "";

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p class="cart-item-price">${formatPrice(product.price)}</p>
          <div class="cart-item-actions">
            <button class="quantity-button" data-action="decrease" data-id="${product.id}">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-button" data-action="increase" data-id="${product.id}">+</button>
            <button class="remove-button" data-action="remove" data-id="${product.id}">წაშლა</button>
          </div>
        </div>
        <span class="cart-item-subtotal">${formatPrice(product.price * item.quantity)}</span>
      </div>
    `;
  }).join("");

  cartItems.querySelectorAll<HTMLButtonElement>("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;

      if (action === "increase") changeQuantity(id, 1);
      if (action === "decrease") changeQuantity(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

function openCart(): void {
  cartPanel?.classList.add("open");
  cartOverlay?.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCartPanel(): void {
  cartPanel?.classList.remove("open");
  cartOverlay?.classList.remove("open");
  document.body.classList.remove("cart-open");
}

function setupFilters(): void {
  if (!filterButtons) return;

  const brandButtons = document.querySelectorAll<HTMLButtonElement>(".brand-logo");

  function applyFilter(category: string): void {
    filterButtons?.querySelectorAll<HTMLButtonElement>(".filter-button").forEach(button => {
      button.classList.toggle("active", button.dataset.category === category);
    });

    brandButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.brand === category);
    });

    renderProducts(category, searchInput?.value || "");
  }

  filterButtons.querySelectorAll<HTMLButtonElement>(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.category || "ყველა");
    });
  });

  brandButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.brand || "ყველა";

      applyFilter(category);

      document.querySelector("#catalog")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

searchInput?.addEventListener("input", () => {
  const activeFilter = filterButtons?.querySelector<HTMLButtonElement>(".filter-button.active");
  const category = activeFilter?.dataset.category || "ყველა";

  renderProducts(category, searchInput.value);
});

cartButton?.addEventListener("click", openCart);
closeCart?.addEventListener("click", closeCartPanel);
cartOverlay?.addEventListener("click", closeCartPanel);

menuButton?.addEventListener("click", () => {
  siteNavigation?.classList.toggle("open");
});

checkoutButton?.addEventListener("click", () => {
  if (cart.length === 0) {
    if (checkoutMessage) checkoutMessage.textContent = "თქვენი კალათა ცარიელია";
    return;
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "შეკვეთა წარმატებით გაფორმდა!";
  }

  cart = [];
  saveCart();
});

if (document.body.dataset.page === "home") {
  renderProducts();
  setupFilters();
}

if (document.body.dataset.page === "product") {
  renderProductDetails();
}

renderCart();
