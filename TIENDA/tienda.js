/**
 * Tienda Online - Script Principal
 * 
 * Este archivo contiene toda la lógica JavaScript para nuestra tienda online.
 * Aquí manejamos:
 * - Carga de productos desde la API
 * - Carrito de compras (agregar, quitar, actualizar)
 * - Búsqueda y filtrado de productos
 * - Proceso de compra completo
 * - Notificaciones y feedback al usuario
 * 
 * @author Sistema de Tienda Online
 * @version 1.0
 */

// Configuración global de la aplicación
const CONFIG = {
    // URL base de nuestra API REST
    API_BASE_URL: 'http://localhost:8080/api/articulos',
    
    // Costo fijo de envío
    COSTO_ENVIO: 15.00,
    
    // Configuración del localStorage para persistir el carrito
    CARRITO_STORAGE_KEY: 'tienda_carrito',
    
    // Tiempo de visualización de las notificaciones (en milisegundos)
    TOAST_TIMEOUT: 3000
};

// Variables globales para manejar el estado de la aplicación
let todosLosProductos = []; // Array con todos los productos cargados desde la API
let carrito = []; // Array con los productos en el carrito de compras
let filtroActual = ''; // Filtro de búsqueda actual
let precioFiltro = ''; // Rango de precio seleccionado

/**
 * Función que se ejecuta cuando la página termina de cargar
 * Inicializa toda la funcionalidad de la tienda
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando funciones y valores...');
    
    // Cargar el carrito desde el localStorage si existe
    cargarCarritoDesdeStorage();
    
    // Cargar los productos desde la API
    cargarProductos();
    
    // Configurar todos los event listeners (eventos de click, cambios, etc.)
    configurarEventListeners();
    
    // Actualizar la interfaz del carrito
    actualizarInterfazCarrito();
    
    console.log('Tienda online lista para usar');
});

/**
 * Configura todos los event listeners de la aplicación
 * Esto incluye botones, campos de entrada, modales, etc.
 */
function configurarEventListeners() {
    // Búsqueda de productos en tiempo real
    const campoBusqueda = document.getElementById('buscarProducto');
    if (campoBusqueda) {
        campoBusqueda.addEventListener('input', function(e) {
            filtroActual = e.target.value.toLowerCase().trim();
            aplicarFiltros();
        });
    }
    
    // Botón para limpiar la búsqueda
    const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');
    if (btnLimpiarBusqueda) {
        btnLimpiarBusqueda.addEventListener('click', function() {
            campoBusqueda.value = '';
            filtroActual = '';
            aplicarFiltros();
        });
    }
    
    // Filtro por rango de precios
    const filtroPrecio = document.getElementById('filtrarPrecio');
    if (filtroPrecio) {
        filtroPrecio.addEventListener('change', function(e) {
            precioFiltro = e.target.value;
            aplicarFiltros();
        });
    }
    
    // Botón para vaciar el carrito
    const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    }
    
    // Botón para proceder al pago
    const btnProcederCompra = document.getElementById('btnProcederCompra');
    if (btnProcederCompra) {
        btnProcederCompra.addEventListener('click', function() {
            if (carrito.length === 0) {
                mostrarNotificacion('Tu carrito está vacío', 'warning');
                return;
            }
            // Cerrar modal del carrito y abrir el de compra
            const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
            modalCarrito.hide();
            
            setTimeout(() => {
                const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
                modalCompra.show();
                actualizarResumenCompra();
            }, 300);
        });
    }
    
    // Botón para confirmar la compra
    const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
    if (btnConfirmarCompra) {
        btnConfirmarCompra.addEventListener('click', procesarCompra);
    }
}

/**
 * Carga todos los productos desde la API REST
 * Muestra indicadores de carga y maneja errores de conexión
 */
async function cargarProductos() {
    const contenedorProductos = document.getElementById('productosContainer');
    const indicadorCarga = document.getElementById('cargando');
    const mensajeError = document.getElementById('errorConexion');
    const mensajeSinProductos = document.getElementById('sinProductos');
    
    try {
        // Mostrar indicador de carga
        mostrarElemento(indicadorCarga);
        ocultarElemento(mensajeError);
        ocultarElemento(mensajeSinProductos);
        contenedorProductos.innerHTML = '';
        
        console.log('Cargando productos desde la API...');
        
        // Hacer la petición a la API
        const respuesta = await fetch(CONFIG.API_BASE_URL);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const productos = await respuesta.json();
        console.log(`${productos.length} productos cargados exitosamente`);
        
        // Guardar los productos en la variable global
        todosLosProductos = productos;
        
        // Ocultar indicador de carga
        ocultarElemento(indicadorCarga);
        
        // Verificar si hay productos
        if (productos.length === 0) {
            mostrarElemento(mensajeSinProductos);
            return;
        }
        
        // Mostrar los productos en la interfaz
        mostrarProductos(productos);
        
        // Generar rangos de precio dinámicos
        generarRangosPrecioDinamicos();
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        
        // Ocultar indicador de carga y mostrar mensaje de error
        ocultarElemento(indicadorCarga);
        mostrarElemento(mensajeError);
        
        // Mostrar notificación de error
        mostrarNotificacion('Error al cargar los productos. Verifica tu conexión.', 'error');
    }
}

/**
 * Muestra los productos en la interfaz de usuario
 * Genera las tarjetas HTML dinámicamente
 * 
 * @param {Array} productos - Array de productos a mostrar
 */
function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('productosContainer');
    
    if (productos.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-search me-2"></i>
                    No se encontraron productos que coincidan con tu búsqueda.
                </div>
            </div>
        `;
        return;
    }
    
    // Generar HTML para cada producto
    const htmlProductos = productos.map(producto => {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm producto-card">
                    <!-- Imagen del producto (placeholder por ahora) -->
                    <div class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height: 200px;">
                        <i class="fas fa-box fa-3x text-muted"></i>
                    </div>
                    
                    <div class="card-body d-flex flex-column">
                        <!-- Nombre del producto -->
                        <h5 class="card-title text-primary">${producto.nombre}</h5>
                        
                        <!-- Precio destacado -->
                        <div class="mb-3">
                            <span class="h4 text-success fw-bold">$${producto.precio.toFixed(2)}</span>
                        </div>
                        
                        <!-- Descripción simulada -->
                        <p class="card-text text-muted flex-grow-1">
                            Excelente producto disponible en nuestra tienda. 
                            Calidad garantizada y envío rápido.
                        </p>
                        
                        <!-- Botón para agregar al carrito -->
                        <button class="btn btn-primary btn-agregar-carrito" 
                                data-id="${producto.id}" 
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}">
                            <i class="fas fa-cart-plus me-2"></i>
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    contenedorProductos.innerHTML = htmlProductos;
    
    // Configurar eventos para los botones de agregar al carrito
    configurarBotonesAgregarCarrito();
}

/**
 * Configura los event listeners para todos los botones "Agregar al Carrito"
 */
function configurarBotonesAgregarCarrito() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoData = {
                id: parseInt(this.dataset.id),
                nombre: this.dataset.nombre,
                precio: parseFloat(this.dataset.precio)
            };
            
            agregarAlCarrito(productoData);
        });
    });
}

/**
 * Agrega un producto al carrito de compras
 * 
 * @param {Object} producto - Objeto con los datos del producto
 */
function agregarAlCarrito(producto) {
    console.log('🛒 Agregando producto al carrito:', producto.nombre);
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si ya existe, incrementar la cantidad
        productoExistente.cantidad++;
        mostrarNotificacion(`Cantidad actualizada: ${producto.nombre}`, 'info');
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            ...producto,
            cantidad: 1
        });
        mostrarNotificacion(`Producto agregado: ${producto.nombre}`, 'success');
    }
    
    // Guardar el carrito en localStorage y actualizar la interfaz
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
    
    console.log('Carrito actualizado:', carrito);
}

/**
 * Actualiza toda la interfaz relacionada con el carrito
 */
function actualizarInterfazCarrito() {
    actualizarContadorCarrito();
    actualizarListaCarrito();
    actualizarResumenCarrito();
    actualizarBotonesCarrito();
}

/**
 * Actualiza el contador de productos en el ícono del carrito
 */
function actualizarContadorCarrito() {
    const contador = document.getElementById('contadorCarrito');
    if (contador) {
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalProductos;
        
        // Agregar efecto visual cuando se añade algo
        if (totalProductos > 0) {
            contador.classList.remove('d-none');
            contador.classList.add('pulse');
            setTimeout(() => contador.classList.remove('pulse'), 300);
        } else {
            contador.classList.add('d-none');
        }
    }
}

/**
 * Actualiza la lista de productos mostrada en el modal del carrito
 */
function actualizarListaCarrito() {
    const contenedorItems = document.getElementById('itemsCarrito');
    const carritoVacio = document.getElementById('carritoVacio');
    
    if (carrito.length === 0) {
        mostrarElemento(carritoVacio);
        contenedorItems.innerHTML = '';
        return;
    }
    
    ocultarElemento(carritoVacio);
    
    const htmlItems = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        
        return `
            <div class="d-flex align-items-center border-bottom py-3 item-carrito" data-id="${item.id}">
                <!-- Imagen placeholder -->
                <div class="flex-shrink-0 me-3">
                    <div class="bg-light rounded" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-box text-muted"></i>
                    </div>
                </div>
                
                <!-- Información del producto -->
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.nombre}</h6>
                    <p class="text-muted mb-1">$${item.precio.toFixed(2)} c/u</p>
                    <p class="fw-bold text-success mb-0">Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
                
                <!-- Controles de cantidad -->
                <div class="flex-shrink-0">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm btn-restar" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-3 fw-bold">${item.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm btn-sumar" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm ms-2 btn-eliminar" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    contenedorItems.innerHTML = htmlItems;
    
    // Configurar eventos para los botones de cantidad
    configurarBotonesCarrito();
}

/**
 * Configura los event listeners para los botones del carrito
 */
function configurarBotonesCarrito() {
    // Botones para sumar cantidad
    document.querySelectorAll('.btn-sumar').forEach(boton => {
        boton.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            cambiarCantidadCarrito(id, 1);
        });
    });
    
    // Botones para restar cantidad
    document.querySelectorAll('.btn-restar').forEach(boton => {
        boton.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            cambiarCantidadCarrito(id, -1);
        });
    });
    
    // Botones para eliminar del carrito
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            eliminarDelCarrito(id);
        });
    });
}

/**
 * Cambia la cantidad de un producto en el carrito
 * 
 * @param {number} id - ID del producto
 * @param {number} cambio - Cantidad a sumar o restar (+1 o -1)
 */
function cambiarCantidadCarrito(id, cambio) {
    const item = carrito.find(producto => producto.id === id);
    
    if (item) {
        item.cantidad += cambio;
        
        // Si la cantidad llega a 0, eliminar el producto
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        
        guardarCarritoEnStorage();
        actualizarInterfazCarrito();
    }
}

/**
 * Elimina un producto completamente del carrito
 * 
 * @param {number} id - ID del producto a eliminar
 */
function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(producto => producto.id === id);
    
    if (indice !== -1) {
        const nombreProducto = carrito[indice].nombre;
        carrito.splice(indice, 1);
        
        guardarCarritoEnStorage();
        actualizarInterfazCarrito();
        
        mostrarNotificacion(`Producto eliminado: ${nombreProducto}`, 'info');
    }
}

/**
 * Vacía completamente el carrito de compras
 */
function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío', 'info');
        return;
    }
    
    // Confirmar la acción
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        guardarCarritoEnStorage();
        actualizarInterfazCarrito();
        mostrarNotificacion('Carrito vaciado', 'info');
    }
}

/**
 * Actualiza el resumen del carrito (totales)
 */
function actualizarResumenCarrito() {
    const resumenPedido = document.getElementById('resumenPedido');
    const totalProductos = document.getElementById('totalProductos');
    const totalPagar = document.getElementById('totalPagar');
    
    if (carrito.length === 0) {
        ocultarElemento(resumenPedido);
        return;
    }
    
    mostrarElemento(resumenPedido);
    
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const montoTotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    if (totalProductos) totalProductos.textContent = cantidadTotal;
    if (totalPagar) totalPagar.textContent = montoTotal.toFixed(2);
}

/**
 * Actualiza el estado de los botones del carrito
 */
function actualizarBotonesCarrito() {
    const btnVaciar = document.getElementById('btnVaciarCarrito');
    const btnProceder = document.getElementById('btnProcederCompra');
    
    const carritoVacio = carrito.length === 0;
    
    if (btnVaciar) btnVaciar.disabled = carritoVacio;
    if (btnProceder) btnProceder.disabled = carritoVacio;
}

/**
 * Aplica los filtros de búsqueda y precio a los productos
 */
function aplicarFiltros() {
    let productosFiltrados = todosLosProductos;
    
    // Filtro por nombre/búsqueda
    if (filtroActual) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.nombre.toLowerCase().includes(filtroActual)
        );
    }
    
    // Filtro por rango de precio
    if (precioFiltro) {
        productosFiltrados = productosFiltrados.filter(producto => {
            const precio = producto.precio;
            
            // Manejar rangos dinámicos
            if (precioFiltro.includes('-')) {
                const [min, max] = precioFiltro.split('-').map(Number);
                return precio >= min && precio <= max;
            }
            
            // Manejar rango abierto (ej: "500+")
            if (precioFiltro.includes('+')) {
                const min = parseFloat(precioFiltro.replace('+', ''));
                return precio > min;
            }
            
            return true;
        });
    }
    
    mostrarProductos(productosFiltrados);
}

/**
 * Actualiza el resumen de compra en el modal de finalización
 */
function actualizarResumenCompra() {
    const resumenCantidad = document.getElementById('resumenCantidad');
    const resumenSubtotal = document.getElementById('resumenSubtotal');
    const resumenEnvio = document.getElementById('resumenEnvio');
    const resumenTotal = document.getElementById('resumenTotal');
    
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = CONFIG.COSTO_ENVIO;
    const total = subtotal + envio;
    
    if (resumenCantidad) resumenCantidad.textContent = cantidadTotal;
    if (resumenSubtotal) resumenSubtotal.textContent = subtotal.toFixed(2);
    if (resumenEnvio) resumenEnvio.textContent = envio.toFixed(2);
    if (resumenTotal) resumenTotal.textContent = total.toFixed(2);
}

/**
 * Procesa la compra final
 * Valida el formulario y simula el proceso de pago
 */
function procesarCompra() {
    const formulario = document.getElementById('formularioCompra');
    
    // Validar el formulario
    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        mostrarNotificacion('Por favor completa todos los campos requeridos', 'warning');
        return;
    }
    
    // Recopilar datos del formulario
    const datosCompra = {
        cliente: {
            nombre: document.getElementById('nombreCliente').value,
            email: document.getElementById('emailCliente').value,
            telefono: document.getElementById('telefonoCliente').value,
            direccion: document.getElementById('direccionCliente').value
        },
        metodoPago: document.getElementById('metodoPago').value,
        productos: carrito,
        totales: {
            cantidad: carrito.reduce((total, item) => total + item.cantidad, 0),
            subtotal: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0),
            envio: CONFIG.COSTO_ENVIO,
            total: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0) + CONFIG.COSTO_ENVIO
        },
        fecha: new Date().toISOString()
    };
    
    console.log('💰 Procesando compra:', datosCompra);
    
    // Simular proceso de pago (en una aplicación real, esto iría al backend)
    const btnConfirmar = document.getElementById('btnConfirmarCompra');
    const textoOriginal = btnConfirmar.innerHTML;
    
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Procesando...';
    
    setTimeout(() => {
        // Generar número de pedido
        const numeroPedido = 'ORD-' + Date.now();
        
        // Mostrar confirmación
        mostrarConfirmacionCompra(numeroPedido);
        
        // Limpiar carrito
        carrito = [];
        guardarCarritoEnStorage();
        actualizarInterfazCarrito();
        
        // Restaurar botón
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
        
        // Cerrar modal de compra
        const modalCompra = bootstrap.Modal.getInstance(document.getElementById('modalCompra'));
        modalCompra.hide();
        
        console.log('Compra procesada exitosamente:', numeroPedido);
        
    }, 2000); // Simular 2 segundos de procesamiento
}

/**
 * Muestra la confirmación de compra exitosa
 * 
 * @param {string} numeroPedido - Número único del pedido
 */
function mostrarConfirmacionCompra(numeroPedido) {
    document.getElementById('numeroPedido').textContent = numeroPedido;
    
    const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modalConfirmacion.show();
}

/**
 * Finaliza el proceso de compra y vuelve a la tienda
 */
function finalizarCompra() {
    const modalConfirmacion = bootstrap.Modal.getInstance(document.getElementById('modalConfirmacion'));
    modalConfirmacion.hide();
    
    // Limpiar formulario
    document.getElementById('formularioCompra').reset();
    document.getElementById('formularioCompra').classList.remove('was-validated');
    
    mostrarNotificacion('¡Gracias por tu compra! Sigue comprando.', 'success');
}

/**
 * Guarda el carrito en localStorage para persistencia
 */
function guardarCarritoEnStorage() {
    try {
        localStorage.setItem(CONFIG.CARRITO_STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
        console.warn('No se pudo guardar el carrito en localStorage:', error);
    }
}

/**
 * Carga el carrito desde localStorage si existe
 */
function cargarCarritoDesdeStorage() {
    try {
        const carritoGuardado = localStorage.getItem(CONFIG.CARRITO_STORAGE_KEY);
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            console.log('Carrito cargado desde localStorage:', carrito);
        }
    } catch (error) {
        console.warn('No se pudo cargar el carrito desde localStorage:', error);
        carrito = [];
    }
}

/**
 * Muestra una notificación toast al usuario
 * 
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación: 'success', 'error', 'warning', 'info'
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const toast = document.getElementById('toastNotificacion');
    const mensajeElement = document.getElementById('mensajeToast');
    const header = toast.querySelector('.toast-header');
    
    // Configurar el mensaje
    mensajeElement.textContent = mensaje;
    
    // Configurar el icono y color según el tipo
    let icono = 'fas fa-info-circle';
    let color = 'text-primary';
    
    switch (tipo) {
        case 'success':
            icono = 'fas fa-check-circle';
            color = 'text-success';
            break;
        case 'error':
            icono = 'fas fa-exclamation-circle';
            color = 'text-danger';
            break;
        case 'warning':
            icono = 'fas fa-exclamation-triangle';
            color = 'text-warning';
            break;
        default:
            icono = 'fas fa-info-circle';
            color = 'text-primary';
    }
    
    // Actualizar el icono
    const iconoElement = header.querySelector('i');
    iconoElement.className = `${icono} ${color} me-2`;
    
    // Mostrar el toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: CONFIG.TOAST_TIMEOUT
    });
    bsToast.show();
}

/**
 * Funciones auxiliares para mostrar/ocultar elementos
 */
function mostrarElemento(elemento) {
    if (elemento) {
        elemento.classList.remove('d-none');
    }
}

function ocultarElemento(elemento) {
    if (elemento) {
        elemento.classList.add('d-none');
    }
}

/**
 * Función para formatear números como moneda
 * 
 * @param {number} cantidad - Cantidad a formatear
 * @returns {string} Cantidad formateada como moneda
 */
function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(cantidad);
}

/**
 * Genera rangos de precio dinámicos basados en los productos disponibles
 * Analiza todos los precios y crea rangos inteligentes para el filtro
 */
function generarRangosPrecioDinamicos() {
    const selectPrecio = document.getElementById('filtrarPrecio');
    
    if (!selectPrecio || todosLosProductos.length === 0) {
        return;
    }
    
    // Extraer todos los precios y ordenarlos
    const precios = todosLosProductos
        .map(producto => producto.precio)
        .sort((a, b) => a - b);
    
    const precioMinimo = Math.floor(precios[0]);
    const precioMaximo = Math.ceil(precios[precios.length - 1]);
    
    console.log(`📊 Generando rangos dinámicos: $${precioMinimo} - $${precioMaximo}`);
    
    // Limpiar opciones existentes excepto la primera
    selectPrecio.innerHTML = '<option value="">Todos los precios</option>';
    
    // Si hay muy pocos productos o poca variación de precios, usar rangos simples
    if (precios.length <= 3 || (precioMaximo - precioMinimo) <= 100) {
        generarRangosSimples(selectPrecio, precioMinimo, precioMaximo);
        return;
    }
    
    // Calcular rangos inteligentes basados en la distribución de precios
    const rangos = calcularRangosInteligentes(precios, precioMinimo, precioMaximo);
    
    // Agregar los rangos al select
    rangos.forEach(rango => {
        const option = document.createElement('option');
        option.value = rango.valor;
        option.textContent = rango.texto;
        selectPrecio.appendChild(option);
    });
    
    console.log(`✅ Rangos de precio actualizados: ${rangos.length} rangos creados`);
}

/**
 * Genera rangos simples cuando hay pocos productos
 */
function generarRangosSimples(selectPrecio, minimo, maximo) {
    const rangos = [
        { valor: `0-${Math.floor(maximo/2)}`, texto: `Hasta $${Math.floor(maximo/2)}` },
        { valor: `${Math.floor(maximo/2)}-${maximo}`, texto: `$${Math.floor(maximo/2)} - $${maximo}` },
        { valor: `${maximo}+`, texto: `Más de $${maximo}` }
    ];
    
    rangos.forEach(rango => {
        const option = document.createElement('option');
        option.value = rango.valor;
        option.textContent = rango.texto;
        selectPrecio.appendChild(option);
    });
}

/**
 * Calcula rangos inteligentes basados en la distribución de precios
 */
function calcularRangosInteligentes(precios, minimo, maximo) {
    const rangos = [];
    
    // Calcular cuartiles para crear rangos más equilibrados
    const q1 = calcularCuartil(precios, 0.25);
    const q2 = calcularCuartil(precios, 0.5); // mediana
    const q3 = calcularCuartil(precios, 0.75);
    
    // Redondear valores para que sean más amigables
    const q1Redondeado = Math.floor(q1 / 10) * 10;
    const q2Redondeado = Math.floor(q2 / 10) * 10;
    const q3Redondeado = Math.floor(q3 / 10) * 10;
    const maximoRedondeado = Math.ceil(maximo / 10) * 10;
    
    // Crear rangos basados en cuartiles
    if (q1Redondeado > 0) {
        rangos.push({
            valor: `0-${q1Redondeado}`,
            texto: `Hasta $${q1Redondeado}`
        });
    }
    
    if (q2Redondeado > q1Redondeado) {
        rangos.push({
            valor: `${q1Redondeado}-${q2Redondeado}`,
            texto: `$${q1Redondeado} - $${q2Redondeado}`
        });
    }
    
    if (q3Redondeado > q2Redondeado) {
        rangos.push({
            valor: `${q2Redondeado}-${q3Redondeado}`,
            texto: `$${q2Redondeado} - $${q3Redondeado}`
        });
    }
    
    if (maximoRedondeado > q3Redondeado) {
        rangos.push({
            valor: `${q3Redondeado}-${maximoRedondeado}`,
            texto: `$${q3Redondeado} - $${maximoRedondeado}`
        });
    }
    
    // Agregar rango para productos más caros que el máximo actual
    rangos.push({
        valor: `${maximoRedondeado}+`,
        texto: `Más de $${maximoRedondeado}`
    });
    
    return rangos;
}

/**
 * Calcula un cuartil específico de un array de números ordenados
 */
function calcularCuartil(arrayOrdenado, cuartil) {
    const indice = (arrayOrdenado.length - 1) * cuartil;
    const inferior = Math.floor(indice);
    const superior = Math.ceil(indice);
    
    if (inferior === superior) {
        return arrayOrdenado[inferior];
    }
    
    return arrayOrdenado[inferior] * (superior - indice) + arrayOrdenado[superior] * (indice - inferior);
}


