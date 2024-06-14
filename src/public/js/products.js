const socket = io();
const tableRows = document.getElementById("table-rows");

function getProducts() {
    tableRows.innerHTML = "";
    fetch("http://localhost:8080/api/products")
        .then((response) => response.json())
        .then((data) => buidRows(data.products))
}

function buidRows(data) {
    tableRows.innerHTML = "";
    data.forEach((product) => {
        console.log(product);
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

socket.on("refresh-products", (data) => {
    console.log("Conectado desde el cliente");
    // const messageLogs = document.getElementById("message-logs");
    // messageLogs.innerText = "";

    // data.messages.forEach((message) => {
    //     const li = document.createElement("li");
    //     li.innerHTML = `${message.user.name} dice: <b>${message.message}</b>`;
    //     messageLogs.append(li);
    // });
});