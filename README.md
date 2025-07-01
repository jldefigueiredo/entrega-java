# 🛒 Tienda Online - Sistema Completo de E-commerce

¡Bienvenido al sistema completo de tienda online! Este proyecto incluye tanto la gestión administrativa de productos como una moderna interfaz de compras para los clientes.

## 📋 Descripción del Proyecto

Este es un sistema completo de e-commerce que consta de:

- **Backend API REST** - Desarrollado en Java Spring Boot con MySQL
- **Panel de Administración** - Para gestionar productos (CRUD completo)
- **Tienda Online** - Interfaz moderna para que los clientes compren productos

## 🌟 Características Principales

### 🔧 Panel de Administración (FRONT/)
- ✅ Listar todos los productos
- ✅ Agregar nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Validaciones en tiempo real
- ✅ Interfaz responsive con Bootstrap

### 🛍️ Tienda Online (TIENDA/)
- ✅ Catálogo de productos con diseño moderno
- ✅ Búsqueda en tiempo real por nombre
- ✅ Filtrado por rangos de precio
- ✅ Carrito de compras persistente
- ✅ Proceso completo de compra
- ✅ Notificaciones interactivas
- ✅ Diseño completamente responsive
- ✅ Interfaz intuitiva y moderna

### 🔧 Backend API
- ✅ API REST completa con Spring Boot
- ✅ Base de datos MySQL
- ✅ Validaciones robustas
- ✅ CORS habilitado para frontend
- ✅ Manejo de errores

## 🚀 Cómo Usar el Sistema

### 1. Iniciar el Backend

```bash
# Desde el directorio raíz del proyecto
mvn spring-boot:run
```

El servidor estará disponible en: `http://localhost:8080`

### 2. Usar el Panel de Administración

1. Abrir `FRONT/index.html` en tu navegador
2. Aquí puedes:
   - Ver todos los productos
   - Agregar nuevos productos
   - Editar productos existentes
   - Eliminar productos

### 3. Usar la Tienda Online

1. Abrir `TIENDA/index.html` en tu navegador
2. Como cliente puedes:
   - Navegar por el catálogo de productos
   - Buscar productos específicos
   - Filtrar por precio
   - Agregar productos al carrito
   - Ver y gestionar tu carrito
   - Proceder con el proceso de compra
   - Completar tu pedido

## 🎯 Funcionalidades de la Tienda

### 🔍 Búsqueda y Filtros
- **Búsqueda en tiempo real**: Escribe en el campo de búsqueda para filtrar productos
- **Filtro por precio**: Selecciona rangos de precio predefinidos
- **Resultados instantáneos**: Los filtros se aplican inmediatamente

### 🛒 Carrito de Compras
- **Agregar productos**: Click en "Agregar al Carrito" en cualquier producto
- **Gestionar cantidades**: Aumentar, disminuir o eliminar productos del carrito
- **Persistencia**: El carrito se mantiene aunque cierres el navegador
- **Resumen automático**: Ve el total de productos y precio en tiempo real

### 💳 Proceso de Compra
1. **Ver carrito**: Click en el ícono del carrito
2. **Proceder al pago**: Click en "Proceder al Pago"
3. **Completar datos**: Llena la información personal y de envío
4. **Seleccionar método de pago**: Elige entre varias opciones
5. **Confirmar compra**: Revisa el resumen y confirma
6. **Confirmación**: Recibe tu número de pedido

### 📱 Diseño Responsive
- ✅ Funciona perfectamente en móviles
- ✅ Optimizado para tablets
- ✅ Experiencia completa en desktop
- ✅ Navegación táctil intuitiva

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.5** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **MySQL** - Base de datos
- **Maven** - Gestión de dependencias

### Frontend
- **HTML5** - Estructura de páginas
- **CSS3** - Estilos personalizados
- **JavaScript ES6+** - Lógica del frontend
- **Bootstrap 5.3.2** - Framework CSS
- **Font Awesome 6.4.0** - Iconos

## 📁 Estructura del Proyecto

```
articulo-api-mysql-funcional/
├── src/main/java/              # Código backend Java
├── src/main/resources/         # Configuración y recursos
├── FRONT/                      # Panel de administración
│   ├── index.html             # Interfaz administrativa
│   └── app.js                 # Lógica de administración
├── TIENDA/                    # Tienda online
│   ├── index.html            # Interfaz de la tienda
│   ├── tienda.js             # Lógica de la tienda
│   └── styles.css            # Estilos personalizados
├── pom.xml                   # Configuración Maven
└── README.md                # Este archivo
```

## 🔗 Endpoints de la API

- `GET /api/articulos` - Listar todos los productos
- `GET /api/articulos/{id}` - Obtener un producto específico
- `POST /api/articulos` - Crear nuevo producto
- `PUT /api/articulos/{id}` - Actualizar producto
- `DELETE /api/articulos/{id}` - Eliminar producto

## 🎨 Características de Diseño

### Colores y Tema
- **Primario**: Azul moderno (#0d6efd)
- **Éxito**: Verde (#198754)
- **Peligro**: Rojo (#dc3545)
- **Fondo**: Gris claro (#f8f9fa)

### Interacciones
- **Animaciones suaves**: Transiciones de 0.3s
- **Efectos hover**: Elementos interactivos con feedback visual
- **Notificaciones**: Toasts informativos para acciones del usuario
- **Carga progresiva**: Indicadores de estado para operaciones asíncronas

## 📋 Requisitos Previos

- ✅ Java 17 o superior
- ✅ Maven 3.6 o superior
- ✅ MySQL 8.0 o superior
- ✅ Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🔧 Configuración de la Base de Datos

Asegúrate de tener una base de datos MySQL ejecutándose con la siguiente configuración:

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/articulos_db
spring.datasource.username=root
spring.datasource.password=admin
```

## 🎯 Próximas Mejoras Sugeridas

- 🔄 Integración con procesadores de pago reales
- 📧 Sistema de emails de confirmación
- 👤 Sistema de usuarios y autenticación
- 📊 Dashboard de analytics para administradores
- 🏷️ Categorías de productos
- 📷 Soporte para imágenes de productos
- ⭐ Sistema de reseñas y calificaciones
- 📱 Aplicación móvil nativa

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que MySQL esté ejecutándose
- Revisa la configuración de la base de datos
- Asegúrate de que el puerto 8080 esté libre

### La tienda no carga productos
- Confirma que el backend esté ejecutándose en http://localhost:8080
- Revisa la consola del navegador para errores de CORS
- Verifica que haya productos en la base de datos

### Errores de conexión
- Abre las herramientas de desarrollador del navegador (F12)
- Revisa la pestaña "Console" para errores específicos
- Verifica que la URL de la API sea correcta

## 👨‍💻 Autor

Sistema desarrollado con mucho cariño para demostrar las mejores prácticas en desarrollo full-stack moderno.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

¡Disfruta explorando y comprando en nuestra tienda online moderna! 🛍️✨
