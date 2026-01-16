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
        showCancelButton: true,
        confirmButtonText: 'Generar Orden',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('swal-input1').value;
            const apellido = document.getElementById('swal-input2').value;
            const email = document.getElementById('swal-input3').value;

            if (!nombre || !apellido || !email) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }
            return { nombre, apellido, email };
        }
    });

    
    if (formValues) {
        try {
           
            const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

            
            await Swal.fire({
                title: '¡Compra Exitosa!',
                icon: 'success',
                html: `
                    <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                        <p><strong>ID de Compra:</strong> <span style="color: #28a745;">${orderId}</span></p>
                        <p><strong>Cliente:</strong> ${formValues.nombre} ${formValues.apellido}</p>
                        <p><strong>Enviamos el detalle a:</strong> ${formValues.email}</p>
                    </div>
                `,
                confirmButtonText: 'Cerrar y limpiar carrito'
            });

            
            await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
            location.href = "/";

        } catch (error) {
            console.error("Error al procesar la compra:", error);
            Swal.fire('Error', 'No se pudo completar la compra', 'error');
        }
    }
};
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

