const socket = io();

async function getCart() {
    let data = await fetch('http://localhost:8080/api/carts/cart')
        .then(response => response.json())
        .then(data => { return data })
    return data;
}

async function AddProductToCart(cid, pid, product) {
    const url = `http://localhost:8080/api/carts/${cid}/product/${pid}`
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(product),
        completed: false,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response)
        .then(data => Message("success", "Producto agregado exitosamente"))
        .catch(error => Message("warning", "Ocurrio un problema"))
    return response;
}


async function AddProduct(pid) {
    let cart = await getCart();
    const newProduct = {
        productId: pid,
        quantity: 1
    }
    await AddProductToCart(cart[0]._id, pid, newProduct);
}

function Message(icon, title){
    Swal.fire({
        toast: true,
        position: "top-end",
        timer: 3000,
        timeProgressBar: true,
        title: title,
        icon: icon,
    }).then(() => location.reload());
}

socket.on("refresh-data", (data) => {
    location.reload()
});
