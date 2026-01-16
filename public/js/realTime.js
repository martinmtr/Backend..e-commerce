const socket = io();

const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");


socket.on("productAdded", (product) => {
    
    const imageUrl = (product.thumbnails && product.thumbnails.length > 0) 
        ? product.thumbnails[0] 
        : "https://placehold.co/200x200?text=Sin+Imagen";

    const newProductHtml = `
        <div class="col" id="card-${product._id}">
            <div class="card h-100 border-success">
                <img src="${imageUrl}" class="card-img-top" alt="${product.title}" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${product.title}</h6>
                    <p class="card-text text-muted" style="font-size: 0.8rem;">${product.description}</p>
                    <p class="mb-1"><strong>$${product.price}</strong></p>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
    productsContainer.insertAdjacentHTML("afterbegin", newProductHtml);
});

socket.on("productDeleted", (productId) => {
    const card = document.getElementById(`card-${productId}`);
    if (card) card.remove();
});


productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    
    const formData = new FormData();
    formData.append('title', document.getElementById("title").value);
    formData.append('description', document.getElementById("description").value);
    formData.append('price', document.getElementById("price").value);
    formData.append('code', document.getElementById("code").value);
    formData.append('stock', document.getElementById("stock").value);
    formData.append('category', document.getElementById("category").value);
    
    
    const fileInput = document.getElementById("thumbnails");
    if (fileInput.files[0]) {
        formData.append('thumbnails', fileInput.files[0]);
    }

    
    const response = await fetch("/api/products", {
        method: "POST",
        body: formData 
    });

    if (response.ok) {
        productForm.reset();
        Swal.fire("¡Listo!", "Producto agregado con éxito", "success");
    } else {
        Swal.fire("Error", "No se pudo crear el producto", "error");
    }
});

window.deleteProduct = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
    }
};