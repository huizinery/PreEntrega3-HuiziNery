//----------------------------USO DE LIBRERIA SWEET ALERT AL INGRESO DE LA PAGINA--------//

Swal.fire({
  title: 'Venta exclusiva a mayores de 18 años!',
  text: 'Tomas Dos recomienda el consumo de alcohol con moderacíon',
  icon: 'warning',
  confirmButtonText: 'Soy Mayor +18 años',
  confirmButtonColor:'#0099ff',
  showCloseButton: 'true'
}) 

// -----------------ACCEDE AL .CONTAINER QUE ES LA CLASE DEL DIV DONDE VA A AGREGAR LAS CARDS----//

const container = document.querySelector(".container");

//------------------------USO DE FETCH PARA OBTENER LOS PRODUCTOS DEL ARCHIVO .JSON ---------//
const obtenerCatalogo = async () => {
  try {
    const response = await fetch('./js/catalogo.json');
    const data = await response.json();
    return data.productos;
  } catch (error) {
    console.error('Error al obtener el catálogo:', error);
    return [];
  }
};

// -----------------------ASYNC PARA MOSTRAR LOS PRODUCTOS Y CREAR LAS TARJETAS CON LAS BEBIDAS-----//

const imprimirProductos = async () => {
  const productos = await obtenerCatalogo();

  productos.forEach((producto, index) => {
    const divCol = document.createElement("div");
    divCol.classList.add("col-md-4");

    const divCard = document.createElement("div");
    divCard.classList.add("card");

    const divCardBody = document.createElement("div");
    divCardBody.classList.add("card-body");

    const img = document.createElement("img");
    img.src = producto.img;
    img.classList.add("card-img-top");

    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.textContent = `${producto.nombre}`;

    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = `Precio: $${producto.precio}\nCategoría: ${producto.categoria}`;

    const a = document.createElement("a");
    a.href = "#";
    a.classList.add("btn");
    a.textContent = "Agregar al carrito";

    a.addEventListener("click", () => {
      Swal.fire({
        title: 'Ingrese la cantidad deseada:',
        input: 'number',
        inputAttributes: {
          min: 1,
          step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (cantidad) => {
          if (cantidad > 0) {
            const datosCompra = {
              producto: producto.nombre,
              cantidad: parseInt(cantidad),
              precio: producto.precio,
            };

            let cartData = [];
            const recuperoCartData = localStorage.getItem("cartData");

            if (recuperoCartData) {
              cartData = JSON.parse(recuperoCartData);
            }

            cartData.push(datosCompra);
            localStorage.setItem("cartData", JSON.stringify(cartData));

            Swal.fire({
              icon: 'success',
              title: 'Producto agregado al carrito de compras',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              verProductosAgregados.click();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Cantidad inválida',
              text: 'Por favor, ingrese un número válido.',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      });
    });

    divCardBody.appendChild(h5);
    divCardBody.appendChild(p);
    divCardBody.appendChild(a);

    divCard.appendChild(img);
    divCard.appendChild(divCardBody);

    divCol.appendChild(divCard);

    container.appendChild(divCol);
  });
};

// -------------------------BOTON  DE "VER PRODUCTOS AGREGADOS"------------------//

const verProductosAgregados = document.createElement("button");

verProductosAgregados.textContent = "Ver productos agregados";

verProductosAgregados.classList.add("btn_agregados", "btn-success");

verProductosAgregados.addEventListener("click", () => {
  const productosAgregadosDiv = document.querySelector(".productos-agregados");
  const recuperoCartData = localStorage.getItem("cartData");

  if (recuperoCartData) {
    const cartData = JSON.parse(recuperoCartData);
    productosAgregadosDiv.innerHTML = ""; //BARRIDO DE CONTENIDO PREVIO

//--------------------------DECLARACIÓN VARIABLE GENERAL -----------------------------//
    let montoTotal = 0;

    cartData.forEach((item, index) => {
      const productoAgregadoLi = document.createElement("li");
      productoAgregadoLi.textContent = `Producto: ${item.producto}, Cantidad: ${item.cantidad}, Precio: $${item.precio}`;
//--------------------------- PARA ELIMINIAR PRODUCTOS ANTES DE CONFIRMAR LA COMPRA---------------//
      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.classList.add("btn_eliminar", "btn-danger");
      eliminarBtn.addEventListener("click", () => {
        cartData.splice(index, 1);
        localStorage.setItem("cartData", JSON.stringify(cartData));
        verProductosAgregados.click();
      });

      productoAgregadoLi.appendChild(eliminarBtn);
      productosAgregadosDiv.appendChild(productoAgregadoLi);

      montoTotal += item.precio * item.cantidad;
    });

    const montoTotalDiv = document.createElement("div");
    montoTotalDiv.textContent = `Monto Total: $${montoTotal.toFixed(2)}`;
    productosAgregadosDiv.appendChild(montoTotalDiv);

    //----------------------------------BOTON DE CONFIRMACION DEL PEDIDO----------------//
    const enviarPedidoBtn = document.createElement("button");
    enviarPedidoBtn.textContent = "CONFIRMAR PEDIDO";
    enviarPedidoBtn.classList.add("btn_enviar", "btn-primary");
    enviarPedidoBtn.addEventListener("click", () => {
      confirmarCompra();

      // Vaciar la lista de "Ver productos agregados" después de confirmar la compra
      productosAgregadosDiv.innerHTML = "";
    });
    productosAgregadosDiv.appendChild(enviarPedidoBtn);
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Carrito vacío',
      text: 'Puedes elegir la bebida que quieras y agregarlo a tu carrito',
      confirmButtonText: 'Aceptar'
    });
  }
});

document.querySelector("body").appendChild(verProductosAgregados);

imprimirProductos();//

// ----------------------------FUNCION PARA CONFIRMAR LA COMPRA----------------------//
const confirmarCompra = () => {
  const recuperoCartData = localStorage.getItem("cartData");

  if (recuperoCartData) {
    const cartData = JSON.parse(recuperoCartData);

    if (cartData.length > 0) {

      localStorage.removeItem("cartData");

      Swal.fire({
        icon: 'success',
        title: 'Compra confirmada',
        text: 'Su pedido ha sido confirmado. ¡Gracias por su compra!',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        verProductosAgregados.click();

//----------------------VACIADO DE LA LISTA "VER PRODUCTOS AGREGADOS " LUEGO DE CONFIRMAR LA COMPRA-----//

        const productosAgregadosDiv = document.querySelector(".productos-agregados");
        productosAgregadosDiv.innerHTML = "";
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Carrito vacío',
        text: 'No hay productos en el carrito para confirmar. Por favor, elija algún producto.',
        confirmButtonText: 'Aceptar'
      });
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Carrito vacío',
      text: 'No hay productos en el carrito para confirmar.',
      confirmButtonText: 'Aceptar'
    });
  }
};
