/**
 * Sistema de gestión de artículos - Frontend
 * 
 * Este archivo maneja toda la interacción del usuario con la interfaz web.
 * Permite crear, editar, eliminar y listar artículos mediante una API REST.
 * 
 * Funcionalidades principales:
 * - Cargar y mostrar la lista de artículos
 * - Formulario para agregar nuevos artículos
 * - Edición de artículos existentes
 * - Eliminación con confirmación
 * - Validaciones de entrada robustas
 * - Mensajes de feedback al usuario
 */

// Esperamos a que la página termine de cargar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos referencias a los elementos principales del DOM
    const articulosTable = document.getElementById('articulos-table');
    const btnAdd = document.getElementById('btn-add');
    const btnSave = document.getElementById('btn-save');
    const articuloModal = new bootstrap.Modal(document.getElementById('articuloModal'));
    const articuloForm = document.getElementById('articuloForm');

    // URL base de nuestra API - aquí es donde vive el backend
    const apiUrl = 'http://localhost:8080/api/articulos';

    /**
     * Obtiene todos los artículos del servidor y los muestra en la tabla
     * 
     * Esta función se encarga de:
     * 1. Hacer una petición GET al servidor
     * 2. Procesar la respuesta JSON
     * 3. Crear dinámicamente las filas de la tabla
     * 4. Manejar cualquier error que pueda ocurrir
     */
    const fetchArticulos = async () => {
        try {
            const response = await fetch(apiUrl);
            
            // Si el servidor responde con un error, lanzamos una excepción
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const articulos = await response.json();
            
            // Limpiamos la tabla antes de llenarla con datos nuevos
            articulosTable.innerHTML = '';
            
            // Por cada artículo, creamos una fila en la tabla
            articulos.forEach(articulo => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${articulo.id}</td>
                    <td>${articulo.nombre}</td>
                    <td>$${articulo.precio}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editArticulo(${articulo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteArticulo(${articulo.id})">Eliminar</button>
                    </td>
                `;
                articulosTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error al obtener los artículos:', error);
            showAlert('Error al cargar los artículos. Verifique que el servidor esté ejecutándose.', 'danger');
        }
    };

    /**
     * Guarda un artículo (nuevo o editado) en el servidor
     * 
     * Esta función es el corazón del formulario. Hace lo siguiente:
     * 1. Recoge los datos del formulario
     * 2. Valida que todo esté correcto
     * 3. Verifica que no existan duplicados
     * 4. Envía los datos al servidor
     * 5. Actualiza la interfaz según el resultado
     */
    const saveArticulo = async () => {
        // Obtenemos los valores del formulario
        const id = document.getElementById('articuloId').value;
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);

        // Primera validación: campos básicos
        if (!nombre.trim() || isNaN(precio) || precio <= 0) {
            showAlert('Por favor, complete todos los campos correctamente. El precio debe ser mayor a 0.', 'warning');
            return;
        }

        // Validamos que el nombre tenga caracteres permitidos
        // Permitimos letras (incluidos acentos), números, espacios, guiones y puntos
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-\.]+$/;
        if (!nombreRegex.test(nombre)) {
            showAlert('El nombre solo puede contener letras, números, espacios, guiones y puntos. No se permiten caracteres especiales.', 'warning');
            return;
        }

        // Verificamos que el nombre tenga una longitud razonable
        if (nombre.trim().length < 2 || nombre.trim().length > 100) {
            showAlert('El nombre debe tener entre 2 y 100 caracteres.', 'warning');
            return;
        }

        // Solo verificamos duplicados cuando estamos creando un artículo nuevo
        if (!id) {
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const articulos = await response.json();
                    
                    // Buscamos si ya existe un artículo con el mismo nombre
                    // Comparamos en minúsculas para evitar duplicados como "Café" y "café"
                    const articuloExistente = articulos.find(articulo => 
                        articulo.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
                    );
                    
                    if (articuloExistente) {
                        showAlert('Ya existe un artículo con ese nombre. Por favor, use un nombre diferente.', 'warning');
                        return;
                    }
                }
            } catch (error) {
                console.error('Error al verificar duplicados:', error);
            }
        }

        // Preparamos el objeto que enviaremos al servidor
        const articulo = { nombre: nombre.trim(), precio };

        // Preparamos el objeto que enviaremos al servidor
        const articuloData = { nombre: nombre.trim(), precio };

        try {
            // Determinamos si es una actualización o creación nueva
            const response = id
                ? await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(articuloData)
                })
                : await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(articuloData)
                });

            if (response.ok) {
                // Todo salió bien - cerramos el modal y actualizamos la lista
                articuloModal.hide();
                fetchArticulos();
                showAlert(`Artículo ${id ? 'actualizado' : 'creado'} exitosamente.`, 'success');
            } else {
                // El servidor nos devolvió un error - mostramos el detalle
                const errorText = await response.text();
                console.error('Error al guardar el artículo:', response.statusText, errorText);
                showAlert(`Error al guardar el artículo: ${response.status} ${response.statusText}`, 'danger');
            }
        } catch (error) {
            // Error de conexión - probablemente el servidor está apagado
            console.error('Error al guardar el artículo:', error);
            showAlert('Error de conexión. Verifique que el servidor esté ejecutándose.', 'danger');
        }
    };

    /**
     * Carga los datos de un artículo específico para editarlo
     * 
     * Cuando el usuario hace clic en "Editar", esta función:
     * 1. Obtiene los datos del artículo desde el servidor
     * 2. Llena el formulario con esos datos
     * 3. Abre el modal para que el usuario pueda modificar
     */
    const editArticulo = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articulo = await response.json();

            // Llenamos el formulario con los datos del artículo
            document.getElementById('articuloId').value = articulo.id;
            document.getElementById('nombre').value = articulo.nombre;
            document.getElementById('precio').value = articulo.precio;

            // Mostramos el modal de edición
            articuloModal.show();
        } catch (error) {
            console.error('Error al obtener el artículo:', error);
            showAlert('Error al cargar el artículo para editar.', 'danger');
        }
    };

    /**
     * Elimina un artículo después de pedir confirmación al usuario
     * 
     * Esta función es un poco más cautelosa porque eliminar es irreversible:
     * 1. Primero pregunta si el usuario está seguro
     * 2. Solo si confirma, procede con la eliminación
     * 3. Actualiza la lista si todo sale bien
     */
    const deleteArticulo = async (id) => {
        // Preguntamos al usuario si está seguro - mejor prevenir que lamentar
        if (!confirm('¿Está seguro de que desea eliminar este artículo?')) {
            return;
        }
        
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                // Eliminación exitosa - actualizamos la lista
                fetchArticulos();
                showAlert('Artículo eliminado exitosamente.', 'success');
            } else {
                console.error('Error al eliminar el artículo:', response.statusText);
                showAlert(`Error al eliminar el artículo: ${response.status} ${response.statusText}`, 'danger');
            }
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
            showAlert('Error de conexión. Verifique que el servidor esté ejecutándose.', 'danger');
        }
    };

    /**
     * Muestra mensajes de alerta elegantes al usuario
     * 
     * Esta función crea esas alertas coloridas que aparecen arriba de la página.
     * Las alertas se eliminan automáticamente después de 5 segundos para no molestar.
     * 
     * @param {string} message - El texto que queremos mostrar
     * @param {string} type - El tipo de alerta: 'success', 'warning', 'danger', etc.
     */
    const showAlert = (message, type) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insertamos la alerta al principio del contenedor
        document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
        
        // Eliminamos automáticamente la alerta después de 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    };

    // Configuramos los eventos de los botones
    
    // Cuando hacen clic en "Agregar Artículo"
    btnAdd.addEventListener('click', () => {
        articuloForm.reset(); // Limpiamos el formulario
        document.getElementById('articuloId').value = ''; // Nos aseguramos de que no haya ID
        articuloModal.show(); // Mostramos el modal
    });

    // Cuando hacen clic en "Guardar" dentro del modal
    btnSave.addEventListener('click', saveArticulo);

    // Al cargar la página, obtenemos la lista inicial de artículos
    fetchArticulos();

    // Hacemos estas funciones accesibles globalmente para que los botones de la tabla puedan usarlas
    window.editArticulo = editArticulo;
    window.deleteArticulo = deleteArticulo;
});
