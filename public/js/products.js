const socket = io();

const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");





async function getOrCreateCartId() {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        try {
            const response = await fetch("/api/carts", { method: "POST" });
            const data = await response.json();
            
           
            cartId = data.payload?._id || data._id; 
            
            if (cartId) {
                localStorage.setItem("cartId", cartId);
                console.log("Nuevo carrito vinculado:", cartId);
            }
        } catch (error) {
            console.error("Error al inicializar el carrito:", error);
        }
    }
    return cartId;
}


window.addToCart = async (productId) => {
    const cartId = await getOrCreateCartId();
    
    if (!cartId) {
        return Swal.fire("Error", "No se pudo identificar tu carrito", "error");
    }

    try {
        
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            Swal.fire({
                title: "¡Agregado!",
                text: "Producto añadido al carrito",
                icon: "success",
                timer: 1000,
                showConfirmButton: false
            });
        } else {
            Swal.fire("Error", "No se pudo agregar al carrito", "error");
        }
    } catch (error) {
        console.log("Error en la petición:", error);
    }
};

/*RENDERIZADO DE PRODUCTOS*/


const createProductCard = (product) => {
    return `
    <div class="col" id="product-card-${product._id}">
      <div class="card h-100 shadow-sm border-info">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">ID: ${product._id}</h6>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>Precio: $${product.price}</strong></p>
          
          <button class="btn btn-success btn-sm w-100 mb-2" onclick="addToCart('${product._id}')">
            Agregar al Carrito
          </button>

          <button class="btn btn-danger btn-sm w-100" onclick="deleteProduct('${product._id}')">
            Eliminar Producto
          </button>
        </div>
      </div>
    </div>`;
};

/*  GESTIÓN DE PRODUCTOS */

if (productForm) {
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const productData = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: Number(document.getElementById("price").value),
            code: document.getElementById("code").value,
            stock: Number(document.getElementById("stock").value),
            category: document.getElementById("category").value,
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                productForm.reset();
                Swal.fire("Éxito", "Producto creado", "success");
            }
        } catch (error) {
            console.error("Error al enviar formulario:", error);
        }
    });
}

window.deleteProduct = async (productId) => {
    try {
        const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
        if (response.ok) Swal.fire("Eliminado", "Producto borrado del servidor", "success");
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
};

/*WEBSOCKETS*/

socket.on("productAdded", (product) => {
    if (productsContainer) {
        productsContainer.insertAdjacentHTML("afterbegin", createProductCard(product));
    }
});

socket.on("productDeleted", (productId) => {
    const card = document.getElementById(`product-card-${productId}`);
    if (card) card.remove();
});


document.addEventListener("DOMContentLoaded", () => {
    const cartNavLink = document.getElementById("cart-nav-link"); 
    if (cartNavLink) {
        cartNavLink.addEventListener("click", (e) => {
            const cartId = localStorage.getItem("cartId");
            if (cartId) {
                e.preventDefault();
                window.location.href = `/cart?cid=${cartId}`;
            }
        });
    }
});
window.showDetails = (title, description, category, stock) => {
    Swal.fire({
        title: `<strong>${title}</strong>`,
        icon: 'info',
        html: `
            <div style="text-align: left;">
                <p><strong>Descripción:</strong> ${description}</p>
                <p><strong>Categoría:</strong> ${category}</p>
                <p><strong>Stock disponible:</strong> ${stock} unidades</p>
            </div>
        `,
        showCloseButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3085d6',
    });
};