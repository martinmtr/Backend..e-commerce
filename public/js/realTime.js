const socket = io();

const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");

socket.on("productAdded", (product) => {
    const newProductHtml = `
        <div class="col" id="card-${product._id}">
            <div class="card h-100 border-success">
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
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: Number(document.getElementById("price").value),
        code: document.getElementById("code").value,
        stock: Number(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        thumbnails: [document.getElementById("thumbnails").value]
    };
const fileInput = document.getElementById("thumbnails");
    if (fileInput.files[0]) {
        formData.append('thumbnails', fileInput.files[0]);
    }
    const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        productForm.reset();
        Swal.fire("¡Listo!", "Producto agregado y emitido", "success");
    }
});


window.deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
};