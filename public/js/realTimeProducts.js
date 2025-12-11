const socket = io();

const deleteProduct = (id) => {
  fetch("/realTimeProducts/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).then((result) => {
    if (result.ok) {
      console.log("Producto eliminado correctamente");
    } else {
      console.error("Error al eliminar");
    }
  });
};

socket.on("products", (data) => {
  const productList = document.getElementById("lista-productos");

  productList.innerHTML = "";

  data.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("product-card");

    li.innerHTML = `
            <img src="${product.thumbnails}" alt="" />
            <h2 class="titulo">${product.title}</h2>
            <h3 class="descripcion">${product.description}</h3>
            <h4 class="precio">Precio: $${product.price}</h4>
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
    productList.appendChild(li);
  });
});
