
package com.ejemplo.articulos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ejemplo.articulos.model.Articulo;
import com.ejemplo.articulos.repository.ArticuloRepository;

/**
 * Implementación del servicio de artículos
 * 
 * Esta clase contiene toda la lógica de negocio de nuestra aplicación.
 * Es el cerebro que coordina las operaciones entre el controlador y el repositorio.
 * 
 * Aquí es donde implementamos:
 * - Validaciones de datos
 * - Reglas de negocio
 * - Transformaciones de datos
 * - Manejo de errores específicos del dominio
 * 
 * La anotación @Service le dice a Spring que esta es una clase de servicio
 * y que debe ser gestionada por el contenedor de inyección de dependencias.
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
@Service
public class ArticuloServiceImpl implements ArticuloService {

    /**
     * Repositorio para acceder a los datos de artículos
     * 
     * Esta es nuestra conexión con la base de datos. La marcamos como final
     * para asegurar que no cambie después de la inicialización.
     */
    private final ArticuloRepository articuloRepository;

    /**
     * Constructor que recibe el repositorio por inyección de dependencias
     * 
     * Spring automáticamente nos pasa una instancia del repositorio
     * cuando crea este servicio.
     * 
     * @param articuloRepository El repositorio de artículos
     */
    @Autowired
    public ArticuloServiceImpl(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    /**
     * {@inheritDoc}
     * 
     * Simplemente delega al repositorio para obtener todos los artículos.
     * En el futuro podríamos agregar lógica adicional aquí como:
     * - Filtros por usuario
     * - Ordenamiento personalizado
     * - Paginación
     */
    public List<Articulo> listarArticulos() {
        return articuloRepository.findAll();
    }

    /**
     * {@inheritDoc}
     * 
     * Busca un artículo por ID. Devuelve un Optional para manejar
     * elegantemente el caso donde no se encuentra el artículo.
     */
    public Optional<Articulo> obtenerArticuloPorId(Long id) {
        return articuloRepository.findById(id);
    }

    /**
     * {@inheritDoc}
     * 
     * Guarda un nuevo artículo con validaciones completas:
     * 1. Valida que los datos sean correctos
     * 2. Verifica que no exista un artículo con el mismo nombre
     * 3. Limpia los datos antes de guardar
     * 4. Delega al repositorio para la persistencia
     */
    public Articulo guardarArticulo(Articulo articulo) {
        // Primero validamos que todos los datos estén correctos
        validarArticulo(articulo);
        
        // Verificamos que no exista ya un artículo con este nombre
        if (articuloRepository.existsByNombre(articulo.getNombre().trim())) {
            throw new RuntimeException("Ya existe un artículo con el nombre: " + articulo.getNombre());
        }
        
        // Limpiamos el nombre (quitamos espacios extra) antes de guardar
        articulo.setNombre(articulo.getNombre().trim());
        return articuloRepository.save(articulo);
    }

    /**
     * {@inheritDoc}
     * 
     * Actualiza un artículo existente con las mismas validaciones que el guardado,
     * pero excluyendo el artículo actual de la verificación de duplicados.
     */
    public Articulo actualizarArticulo(Long id, Articulo articulo) {
        // Validamos los datos del artículo
        validarArticulo(articulo);
        
        // Verificamos duplicados, pero excluimos el artículo que estamos editando
        if (articuloRepository.existsByNombreAndIdNot(articulo.getNombre().trim(), id)) {
            throw new RuntimeException("Ya existe un artículo con el nombre: " + articulo.getNombre());
        }
        
        // Limpiamos los datos y establecemos el ID
        articulo.setNombre(articulo.getNombre().trim());
        articulo.setId(id);
        return articuloRepository.save(articulo);
    }
    
    /**
     * {@inheritDoc}
     * 
     * Elimina un artículo por ID. En el futuro podríamos agregar:
     * - Verificación de que el artículo existe
     * - Soft delete (marcar como eliminado en lugar de borrar)
     * - Auditoría de eliminaciones
     */
    public void eliminarArticulo(Long id) {
        articuloRepository.deleteById(id);
    }
    
    /**
     * Valida que un artículo cumpla con todas las reglas de negocio
     * 
     * Este método centraliza todas nuestras validaciones para mantener
     * el código limpio y evitar duplicación. Aquí verificamos:
     * - Que el nombre no esté vacío
     * - Que tenga una longitud apropiada
     * - Que solo contenga caracteres permitidos
     * - Que el precio sea válido
     * 
     * @param articulo El artículo a validar
     * @throws RuntimeException si alguna validación falla
     */
    private void validarArticulo(Articulo articulo) {
        // Validación del nombre - no puede estar vacío
        if (articulo.getNombre() == null || articulo.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre no puede estar vacío");
        }
        
        // Validación de longitud - debe ser razonable
        String nombre = articulo.getNombre().trim();
        if (nombre.length() < 2 || nombre.length() > 100) {
            throw new RuntimeException("El nombre debe tener entre 2 y 100 caracteres");
        }
        
        // Validación de caracteres - solo permitimos letras, números, espacios, acentos, guiones y puntos
        // Esta regex permite:
        // - a-z, A-Z: letras básicas
        // - áéíóúÁÉÍÓÚñÑüÜ: acentos y caracteres especiales del español
        // - 0-9: números
        // - \\s: espacios
        // - \\-: guiones
        // - \\.: puntos
        if (!nombre.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\\s\\-\\.]+$")) {
            throw new RuntimeException("El nombre solo puede contener letras, números, espacios, guiones y puntos");
        }
        
        // Validación del precio - debe existir
        if (articulo.getPrecio() == null) {
            throw new RuntimeException("El precio no puede ser nulo");
        }
        
        // Validación del precio - debe ser positivo
        if (articulo.getPrecio() <= 0) {
            throw new RuntimeException("El precio debe ser mayor a 0");
        }
        
        // Validación del precio - debe ser razonable (no más de un millón)
        if (articulo.getPrecio() > 999999.99) {
            throw new RuntimeException("El precio no puede ser mayor a 999,999.99");
        }
    }
}
