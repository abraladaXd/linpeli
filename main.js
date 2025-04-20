// Seleção de elementos DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const testimonialDots = document.querySelectorAll('.testi-dot');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.testi-prev');
const nextBtn = document.querySelector('.testi-next');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const cartIcons = document.querySelectorAll('.fa-shopping-cart');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const modalAddToCartBtn = document.querySelector('.add-to-cart-btn');
const quantityBtns = document.querySelectorAll('.quantity-btn');
const quantityInput = document.querySelector('.quantity-input');
const sizeOptions = document.querySelectorAll('.size-option');
const colorOptions = document.querySelectorAll('.color-option');
const checkoutBtn = document.querySelector('.checkout-btn');
const newsletterForm = document.querySelector('.newsletter-form');

// Estado do carrinho
let cart = [];
let currentSlide = 0;

// ------ Event Listeners ------

// Menu responsivo
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.style.display = hamburger.classList.contains('active') ? 'block' : 'none';
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Links de navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Fecha o menu mobile se estiver aberto
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.style.display = 'none';
        }

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ------ Filtro de produtos ------
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class de todos os botões
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Adiciona active class no botão clicado
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filtra os produtos
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ------ Controles do Slider de Depoimentos ------
function showSlide(n) {
    // Remove a classe active de todos os slides
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    // Ajusta o índice do slide se necessário
    if (n >= testimonialSlides.length) currentSlide = 0;
    if (n < 0) currentSlide = testimonialSlides.length - 1;
    
    // Mostra o slide atual
    testimonialSlides[currentSlide].classList.add('active');
    testimonialDots[currentSlide].classList.add('active');
}

// Inicializa o slider
showSlide(currentSlide);

// Event listeners para controles do slider
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
    });
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto play do slider a cada 5 segundos
setInterval(() => {
    currentSlide++;
    showSlide(currentSlide);
}, 5000);

// ------ Modal de produto ------
function openProductModal(product) {
    // Preencher o modal com os dados do produto
    const modalTitle = productModal.querySelector('h2');
    const modalPrice = productModal.querySelector('.modal-product-price');
    const modalImage = productModal.querySelector('.modal-product-image img');
    
    if (product) {
        modalTitle.textContent = product.title || 'Camisa Performance Pro';
        modalPrice.textContent = product.price || 'R$ 189,90';
        // Mantém a imagem placeholder se não houver imagem real
    }
    
    productModal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Impede rolagem da página
}

function closeProductModal() {
    productModal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Restaura rolagem da página
}

// Event listeners para abrir/fechar o modal de produto
document.querySelectorAll('.overlay-btn .fa-eye').forEach((btn, index) => {
    btn.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = productCards[index];
        const productTitle = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        openProductModal({
            title: productTitle,
            price: productPrice
        });
    });
});

if (closeModal) {
    closeModal.addEventListener('click', closeProductModal);
}

// Fechar o modal ao clicar fora dele
overlay.addEventListener('click', () => {
    closeProductModal();
    closeCartSidebar();
});

// ------ Carrinho de compras ------
function openCartSidebar() {
    cartSidebar.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Impede rolagem da página
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    if (!hamburger.classList.contains('active') && productModal.style.display !== 'block') {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Restaura rolagem da página
    }
}

function updateCart() {
    // Atualiza o contador de itens no carrinho
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Atualiza o conteúdo do carrinho
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmptyElement = document.querySelector('.cart-empty');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (cart.length === 0) {
        if (cartEmptyElement) cartEmptyElement.style.display = 'flex';
        totalPriceElement.textContent = 'R$ 0,00';
        return;
    }
    
    if (cartEmptyElement) cartEmptyElement.style.display = 'none';
    
    // Limpa o conteúdo atual
    while (cartItemsContainer.childElementCount > 1) {
        cartItemsContainer.removeChild(cartItemsContainer.lastChild);
    }
    
    // Adiciona os itens do carrinho
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace('R$', '').replace(',', '.').trim());
        const itemTotal = price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="/api/placeholder/80/80" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>Tamanho: ${item.size} | Cor: ${item.color}</p>
                <div class="cart-item-price">
                    <span>${item.price}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Atualiza o preço total
    totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    
    // Adiciona event listeners para os botões de quantidade
    document.querySelectorAll('.cart-item .quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            
            if (btn.classList.contains('plus')) {
                cart[index].quantity++;
            } else if (btn.classList.contains('minus')) {
                cart[index].quantity--;
                
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
            
            updateCart();
        });
    });
    
    // Adiciona event listeners para os botões de remover
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Event listeners para o carrinho
cartIcons.forEach(icon => {
    icon.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        openCartSidebar();
    });
});

if (closeCart) {
    closeCart.addEventListener('click', closeCartSidebar);
}

// Adicionar ao carrinho dos cards de produto
addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = productCards[index];
        const productTitle = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Adiciona o item ao carrinho
        cart.push({
            title: productTitle,
            price: productPrice,
            quantity: 1,
            size: 'M', // Padrão
            color: 'Preto' // Padrão
        });
        
        updateCart();
        openCartSidebar();
    });
});

// Adicionar ao carrinho do modal
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
        const modalTitle = productModal.querySelector('h2').textContent;
        const modalPrice = productModal.querySelector('.modal-product-price').textContent;
        
        // Pega as cores e tamanhos selecionados
        const selectedSize = document.querySelector('.size-option.selected').textContent;
        const selectedColorEl = document.querySelector('.color-option.selected');
        const selectedColor = selectedColorEl.style.backgroundColor === 'rgb(0, 0, 0)' ? 'Preto' :
                             selectedColorEl.style.backgroundColor === 'rgb(255, 255, 255)' ? 'Branco' : 
                             'Cinza';
        
        const quantity = parseInt(quantityInput.value || 1);
        
        // Adiciona o item ao carrinho
        cart.push({
            title: modalTitle,
            price: modalPrice,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        });
        
        updateCart();
        closeProductModal();
        openCartSidebar();
    });
}

// ------ Quantidade no modal ------
quantityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        
        if (btn.classList.contains('plus')) {
            quantityInput.value = currentValue + 1;
        } else if (btn.classList.contains('minus') && currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
});

// ------ Seleção de tamanho e cor ------
sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        sizeOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// ------ Checkout ------
// Modificação na função de checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
          alert('Seu carrinho está vazio!');
          return;
      }
      
      // Preparar a mensagem para o WhatsApp
      let mensagem = "Olá! Gostaria de comprar os seguintes produtos:\n\n";
      
      // Adicionar itens do carrinho à mensagem
      cart.forEach(item => {
          mensagem += `- ${item.title} (${item.size}, ${item.color}) - ${item.quantity}x ${item.price}\n`;
      });
      
      // Adicionar total do carrinho
      const totalElement = document.querySelector('.total-price');
      mensagem += `\nTotal: ${totalElement.textContent}`;
      
      // Adicionar mensagem de encerramento
      mensagem += "\n\nPoderia me ajudar com esta compra?";
      
      // Codificar a mensagem para URL
      const mensagemCodificada = encodeURIComponent(mensagem);
      
      // Número de telefone (inclui o código do país +55)
      const telefone = "5512988844634";
      
      // URL para WhatsApp
      const urlWhatsApp = `https://wa.me/${telefone}?text=${mensagemCodificada}`;
      
      // Redirecionar para o WhatsApp
      window.open(urlWhatsApp, '_blank');
  });
}