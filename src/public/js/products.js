const socket = io();
const tableRows = document.getElementById("table-rows");

function getProducts() {
    tableRows.innerHTML = "";
    fetch("http://localhost:8080/api/products")
        .then((response) => response.json())
        .then((data) => buidRows(data.products.docs))
}

function buidRows(data) {
    tableRows.innerHTML = "";
    data.forEach((product) => {
        tableRows.innerHTML += createHTML(product)
    })
}

function createHTML(item) {
    return `<tr key=${item.id}>
    <td>${item.title}</td>
    <td>${item.stock}</td>
    <td class="texto-derecha">$ ${item.price}</td>
</tr>`
}

getProducts();

socket.on("refresh-data", (data) => {
    buidRows(data);
    Swal.fire({
        toast: true,
        position: "top-end",
        timer: 3000,
        timeProgressBar: true,
        title: "Se actualizaron los productos",
        icon: "success",
    });
});