let cartId = localStorage.getItem("cartId");


const createCart = async () => {
  try {
    const response = await fetch("/api/carts", { method: "POST" });
    const data = await response.json();
    
    cartId = data.payload ? data.payload._id : data._id;
    localStorage.setItem("cartId", cartId);
    return cartId;
  } catch (err) {
    console.error("Error creando carrito:", err);
    return null;
  }
};


const ensureCart = async () => {
  if (!cartId || cartId === "undefined") {
    await createCart();
  }
  return cartId;
};


const addToCart = async (productId) => {
  try {
    const cart = await ensureCart();
    if (!cart) {
      Swal.fire("Error", "No se pudo obtener el carrito", "error");
      return;
    }

    
    const response = await fetch(`/api/carts/${cart}/product/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        timer: 1200,
        showConfirmButton: false,
      });
      
      if (document.getElementById("cart")) renderCart();
    } else {
      const errData = await response.json();
      Swal.fire("Error", errData.message || "No se pudo agregar", "error");
    }
  } catch (error) {
    console.error("Error agregando producto:", error);
    Swal.fire("Error", "Ocurrió un problema de red", "error");
  }
};


const removeFromCart = async (productId) => {
  try {
    const cart = await ensureCart();
    
    
    const response = await fetch(`/api/carts/${cart}/product/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        timer: 1000,
        showConfirmButton: false,
      });
      
      
      if (document.getElementById("cart")) {
          renderCart();
      } else {
          location.reload(); 
      }
    }
  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
};


const getCart = async () => {
  if (!cartId) return null;
  try {
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) throw new Error("No se pudo obtener el carrito");
    const data = await response.json();
    return data.payload || data;
  } catch (err) {
    console.error("Error obteniendo carrito:", err);
    return null;
  }
};


const renderCart = async () => {
  const cartDiv = document.getElementById("cart");
  if (!cartDiv) return;

  const cart = await getCart();
  if (!cart || !cart.products || cart.products.length === 0) {
    cartDiv.innerHTML = "<p class='text-muted'>Tu carrito está vacío</p>";
    return;
  }

  cartDiv.innerHTML = cart.products
    .map(item => `
      <div class="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
        <p class="m-0">${item.product.title} - <strong>Cant: ${item.quantity}</strong></p>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.product._id}')">Eliminar</button>
      </div>
    `).join("");
};

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
window.checkout = async () => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    
    const { value: formValues } = await Swal.fire({
        title: 'Finalizar Compra',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre">
            <input id="swal-input2" class="swal2-input" placeholder="Apellido">
            <input id="swal-input3" class="swal2-input" placeholder="Email">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                nombre: document.getElementById('swal-input1').value,
                apellido: document.getElementById('swal-input2').value,
                email: document.getElementById('swal-input3').value
            }
        }
    });

    
    if (formValues) {
      console.log("Enviando email al servidor:", formValues.email);
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                
                body: JSON.stringify({ email: formValues.email }) 
            });

            const result = await response.json();

            if (result.status === "success") {
                
                await Swal.fire({
                    title: '¡Compra Exitosa!',
                    icon: 'success',
                    html: `
                        <p><strong>ID de Compra:</strong> ${result.ticket.code}</p>
                        <p><strong>Total:</strong> $${result.ticket.amount}</p>
                    `
                });
                location.href = "/";
            } else {
                Swal.fire('Error', result.message || 'No se pudo procesar la compra', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire('Error', 'Ocurrió un error al conectar con el servidor', 'error');
        }
    }
};
window.clearCart = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cid') || localStorage.getItem('cartId');

    if (!cartId) return;

    
    const result = await Swal.fire({
        title: '¿Vaciar todo el carrito?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, vaciar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: "DELETE" 
            });

            if (response.ok) {
                Swal.fire("¡Vaciado!", "El carrito está limpio", "success")
                .then(() => location.reload());
            }
        } catch (error) {
            console.error("Error al vaciar:", error);
        }
    }
};
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

