# 🚀 Guía de Uso Rápido - Tienda Online

## ✨ ¡Tu tienda online está lista!

### 🛍️ Para probar la tienda como CLIENTE:

1. **Abre la tienda**: Ve a `TIENDA/index.html` en tu navegador
2. **Explora productos**: Verás 8 productos disponibles para comprar
3. **Busca productos**: Usa el campo de búsqueda para encontrar artículos específicos
4. **Filtra por precio**: Usa el menú desplegable para filtrar por rangos de precio
5. **Agrega al carrito**: Click en "Agregar al Carrito" en cualquier producto
6. **Ve tu carrito**: Click en el ícono del carrito (esquina superior derecha)
7. **Gestiona cantidades**: Usa los botones + y - para cambiar cantidades
8. **Procede al pago**: Click en "Proceder al Pago" cuando estés listo
9. **Completa el formulario**: Llena tus datos personales y de envío
10. **Confirma tu compra**: ¡Recibirás un número de pedido!

### 🔧 Para gestionar productos como ADMINISTRADOR:

1. **Abre el panel admin**: Ve a `FRONT/index.html` en tu navegador
2. **Ve todos los productos**: La tabla muestra todos los artículos
3. **Agrega productos**: Click en "Agregar Artículo"
4. **Edita productos**: Click en "Editar" en cualquier fila
5. **Elimina productos**: Click en "Eliminar" (¡cuidado!)

## 🎮 Productos de Ejemplo Disponibles:

- 💻 **Laptop Dell Inspiron** - $899.99
- 📱 **Smartphone Samsung Galaxy** - $699.99  
- 🎧 **Auriculares Bluetooth** - $79.99
- 🖥️ **Monitor 4K LG** - $329.99
- ⌨️ **Teclado Mecánico RGB** - $129.99
- 🖱️ **Mouse Gaming** - $59.99
- 🧀 **Queso untable** - $2,322.30
- ☕ **Café en granos x 1kg** - $45,000.00

## 🔥 Características Cool para Probar:

### En la Tienda:
- ✅ **Búsqueda en tiempo real**: Escribe "laptop" y ve la magia
- ✅ **Filtros de precio**: Selecciona "Hasta $50" para ver productos baratos
- ✅ **Carrito persistente**: Agrega productos, cierra el navegador y ¡siguen ahí!
- ✅ **Contador dinámico**: El número en el carrito cambia automáticamente
- ✅ **Notificaciones**: Cada acción muestra un mensaje informativo
- ✅ **Proceso de compra completo**: Simula una compra real paso a paso
- ✅ **Responsive**: Prueba en móvil, tablet y desktop

### En el Admin:
- ✅ **Validaciones**: Intenta crear un producto sin nombre o precio
- ✅ **Feedback visual**: Alertas de éxito y error
- ✅ **Edición in-place**: Modifica productos existentes fácilmente

## 🎯 Datos de Prueba para el Formulario de Compra:

```
Nombre: Juan Pérez
Email: juan@email.com
Teléfono: +1234567890
Dirección: Avenida siempre viva 742,Springfield, CP 12345
Método de pago: Cualquiera de las opciones
```

## 🚀 URLs Importantes:

- **🛍️ Tienda**: `CARPETA_DEL_PROYECTO/TIENDA/index.html`
- **🔧 Admin**: `CARPETA_DEL_PROYECTO/FRONT/index.html`
- **📡 API**: `http://localhost:8080/api/articulos`

## 💡 Tips Pro:

1. **Abre la consola del navegador** (F12) para ver logs detallados
2. **Prueba en modo incógnito** para simular un usuario nuevo
3. **Redimensiona la ventana** para ver el diseño responsive
4. **Agrega muchos productos** al carrito para ver el scroll
5. **Intenta búsquedas complejas** como "ga" (encuentra "Mouse Gaming")

## 🆕 ¡NUEVA FUNCIONALIDAD! - Rangos de Precio Dinámicos

### 📊 **Filtros Inteligentes Automáticos**
¡Los rangos de precio ahora se generan automáticamente basándose en los productos disponibles!

**¿Cómo funciona?**
- ✅ **Análisis automático**: El sistema analiza todos los precios al cargar la página
- ✅ **Rangos equilibrados**: Crea filtros con cantidades similares de productos
- ✅ **Valores redondeados**: Usa números amigables (múltiplos de 10)
- ✅ **Actualización automática**: Se ajusta cuando agregas/eliminas productos

**¡Pruébalo!**
1. Abre la tienda y ve al filtro de precios
2. Verás rangos como "Hasta $140", "$140 - $390", etc.
3. Estos rangos se calcularon automáticamente desde los 12 productos disponibles
4. Cada rango contiene aproximadamente el 25% de los productos

**Productos actuales con gran variedad de precios:**
- 💸 **Cable USB** - $15.99 (más barato)
- 🖱️ **Mouse Gamer** - $13.99
- 🎧 **Auriculares Bluetooth** - $79.99  
- ⌨️ **Teclado Mecánico RGB** - $129.99
- 🖥️ **Monitor 4K LG** - $329.99
- 📱 **Tablet Samsung** - $299.99
- ⌚ **Smartwatch Apple** - $399.99
- 📱 **Smartphone Samsung Galaxy** - $699.99
- 💻 **Laptop Dell Inspiron** - $899.99
- 🍯 **MacBook Pro** - $2,499.99
- 🧀 **Queso untable** - $2,322.30
- ☕ **Café en granos x 1kg** - $45,000.00 (¡más caro!)

¡Disfruta explorando tu nueva tienda online! 🎉
