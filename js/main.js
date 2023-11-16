alert("Bienvenido a TomaDos, acceso permitido solo a mayores de 18 años"); // AVISO DE EDAD MINIMA PARA INGRESAR

//--------------------------- ESTRUCTURA DE LA CLASS
class Producto {
  constructor(nombre, categoria, precio, stock, img) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
    this.img = img;
  }
}
//----------PRODUCTOS AGREGADOS

const productos = [
  new Producto(
    "DV Catena Zapata Malbec",
    "Vinos tinto",
    6000,
    88,
    "../images/img1.jpg"
  ),

  new Producto(
    "Luigi Bosca Malbec",
    "Vinos tinto",
    5000,
    50,
    "../images/img2.webp"
  ),

  new Producto(
    "Trapiche Alaris Dulce",
    "Vinos blanco",
    2500,
    75,
    "../images/img3.webp"
  ),

  new Producto(
    "Norton Cosecha Tardia Dulce",
    "vinos blanco",
    2100,
    25,
    "../images/img4.jpg"
  ),

  new Producto(
    "Trumpeter Malbec",
    "Vinos tinto",
    3000,
    10,
    "../images/img5.jpg"
  ),

  new Producto(
    "Quilmes 1L",
    "Cervezas",
    1100,
    100,
    "../images/img6.jpg"
  ),

  new Producto(
    "Stella Artois",
    "Cervezas",
    1500,
    80,
    "../images/img7.jpg"
  ),

  new Producto("Patagonia",
    "Cervezas",
    1400,
    60,
    "../images/img8.jpg"
  ),

  new Producto("Beefeatear",
    "Gin",
    14000,
    50,
    "../images/img9.jpg"
  ),

  new Producto(
    "Ginkgo Patagonia",
    "Gin",
    2599,
    5,
    "../images/img10.jpg"
  ),

  new Producto(
    "Branca 750ml",
    "Fernet",
    5000,
    200,
    "../images/img11.png"
  ),

  new Producto(
    "Buhero Negro",
    "Fernet",
    3000,
    100,
    "../images/img12.jpg"
  ),
];

//-------------------------------------------ACCEDE AL .CONTAINER QUE ES LA CLASE DEL DIV DONDE VA A AGREGAR LAS CARDS

const container = document.querySelector(".container");

//FOREACH
productos.forEach((producto, index) => {

  //----------------------------------------------------ELEMENTOS CREADOS TIPO DIV Y AGREGADO DE CLASS: MUCHAS CLASES SON DE BOOSTRAP

  const divCol = document.createElement("div");
  divCol.classList.add("col-md-4");

  const divCard = document.createElement("div");
  divCard.classList.add("card");

  const divCardBody = document.createElement("div");
  divCardBody.classList.add("card-body");

  //----------------------------------------------------------------CREAR ELEMENTO CREADO TIPO IMG

  const img = document.createElement("img");

  img.src = producto.img; // para que el src de la etiqueta imagen tome como valor el string de la ruta , creado como dato del objeto

  img.classList.add("card-img-top");

  //----------------------------------------------------------------CREAR ELEMENTO TIPO H5 
  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.textContent = `${producto.nombre}`;

  //----------------------------------------------------------------CREAR ELEMENTO TIPO PARRAFO 
  const p = document.createElement("p");
  p.classList.add("card-text");
  p.textContent = `Precio: $${producto.precio}\nCategoría: ${producto.categoria}`;

  //----------------------------------------------------------------CREAR ELEMENTO TIPO LINK
  const a = document.createElement("a");
  a.href = "#";
  a.classList.add("btn");
  a.textContent = "Agregar al carrito";

  //-------------------------------------------------------------- USO DE EVENTO CLICK

  a.addEventListener("click", () => {
    const cantidad = prompt("Ingrese la cantidad deseada:");

    if (cantidad !== null && !isNaN(cantidad) && cantidad > 0) {  //si ingresa un valor que no ni null, ni es algo no número y es mayor a cero
      const datosCompra = {
        producto: producto.nombre,
        cantidad: parseInt(cantidad),
        precio: producto.precio,
      };

      //---------------------PARA RECUPERAR LOS DATOS QUE YA AGREGÓ EL USUARIO AL CARRITO, LE AGREGA LOS NUEVOS Y LO VUELVE A ENVIAR AL LOCALSTORAGE

      let cartData = [];//variable vacia para ir acumulando

      const recuperoCartData = localStorage.getItem("cartData");


      if (recuperoCartData) { //mira si hay algo dentro de recupero, en caso de haber,lo parsea de json a objeto asi lo guarda en cartData
        cartData = JSON.parse(recuperoCartData);
      }


      cartData.push(datosCompra);//empuja los nuevos productos que van agregando el usuario dentro la variable acumulativa cartData.


      localStorage.setItem("cartData", JSON.stringify(cartData));//envia la info actualizada al localstorage


      const productosAgregadosDiv = document.querySelector(".productos-agregados");

      const productoAgregadoLi = document.createElement("li");
      productoAgregadoLi.textContent = `Producto: ${datosCompra.producto}, Cantidad: ${datosCompra.cantidad}, Precio: $${datosCompra.precio}`;


      alert("Producto agregado al carrito de compras");
    } else {
      alert("Cantidad inválida. Por favor, ingrese un número válido.");
    }
  });

  //AGREGADO DE LOS ELEMENTOS DENTRO DEL LUGAR QUE LE CORRESPONDE

  divCardBody.appendChild(h5);
  divCardBody.appendChild(p);
  divCardBody.appendChild(a);

  divCard.appendChild(img);
  divCard.appendChild(divCardBody);

  divCol.appendChild(divCard);

  container.appendChild(divCol);
});



// -----------------------------------------------------------OPCION DE "VER PRODUCTOS AGREGADOS"


const verProductosAgregados = document.createElement("button");

verProductosAgregados.textContent = "Ver productos agregados";

verProductosAgregados.classList.add("btn_agregados", "btn-success");

verProductosAgregados.addEventListener("click", () => {
  const cartData = localStorage.getItem("cartData");
  if (cartData) {
    const productosAgregados = JSON.parse(cartData);
    const productosAgregadosDiv = document.querySelector(".productos-agregados");

    productosAgregadosDiv.innerHTML = ""; // Limpiar el contenido anterior

    const ul = document.createElement("ul");
    ul.classList.add("list-group");

    let montoTotal = 0;
    productosAgregados.forEach((producto, index) => {
      const subtotal = producto.cantidad * producto.precio;
      montoTotal += subtotal;

      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <strong>Producto:</strong> ${producto.producto}<br>
        <strong>Cantidad:</strong> ${producto.cantidad}<br>
        <strong>Precio:</strong> $${producto.precio}<br>
        <strong>Subtotal:</strong> $${subtotal}
      `;


      const quitarProductoBtn = document.createElement("button");
      quitarProductoBtn.textContent = "Quitar";
      quitarProductoBtn.classList.add("btn", "btn-danger", "btn-sm"); // Aplicar estilos de Bootstrap al botón
      quitarProductoBtn.addEventListener("click", () => {
        productosAgregados.splice(index, 1); // Eliminar el producto de la lista
        localStorage.setItem("cartData", JSON.stringify(productosAgregados)); // Actualizar el local storage
        verProductosAgregados.click(); // Volver a mostrar la lista de productos agregados
      });

      li.appendChild(quitarProductoBtn);
      ul.appendChild(li);
    });

    productosAgregadosDiv.appendChild(ul);

    const montoTotalP = document.createElement("p");
    montoTotalP.innerHTML = `<strong>Monto total:</strong> $${montoTotal}`;
    productosAgregadosDiv.appendChild(montoTotalP);
  } else {
    alert("No hay productos agregados");
  }
});

document.querySelector("body").appendChild(verProductosAgregados);

//----------------------------------------------------------- BOTON ENVIAR/CONFIRMAR COMPRA


const enviarPedidoBtn = document.createElement("button");
enviarPedidoBtn.textContent = "CONFIRMAR PEDIDO";
enviarPedidoBtn.classList.add("btn_enviar", "btn-primary");

enviarPedidoBtn.addEventListener("click", () => {

  const cartData = localStorage.getItem("cartData");

  if (cartData) {

    const productosAgregados = JSON.parse(cartData);

    console.log("Información del pedido:");
    console.log(productosAgregados);

    let montoTotal = 0;
    productosAgregados.forEach((producto) => {
      const subtotal = producto.cantidad * producto.precio;
      montoTotal += subtotal;
    });

    console.log("Monto total del pedido: $" + montoTotal);

    alert("Pedido enviado con éxito!");



  } else {
    alert("No hay productos en el carrito");
  }

});

document.querySelector(".productos-agregados").appendChild(enviarPedidoBtn);
