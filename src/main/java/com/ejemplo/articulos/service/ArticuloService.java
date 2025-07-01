
package com.ejemplo.articulos.service;

import java.util.List;
import java.util.Optional;

import com.ejemplo.articulos.model.Articulo;

/**
 * Interfaz del servicio de artículos
 * 
 * Esta interfaz define el "contrato" que debe cumplir cualquier clase
 * que implemente la lógica de negocio para los artículos.
 * 
 * ¿Por qué usar una interfaz? Porque nos permite:
 * 1. Separar la definición (qué hace) de la implementación (cómo lo hace)
 * 2. Facilitar las pruebas unitarias (podemos crear implementaciones mock)
 * 3. Permitir múltiples implementaciones sin cambiar el controlador
 * 4. Seguir los principios SOLID de programación
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
public interface ArticuloService {
    
    /**
     * Obtiene la lista completa de artículos
     * 
     * @return Lista con todos los artículos registrados en el sistema
     */
    List<Articulo> listarArticulos();
    
    /**
     * Busca un artículo específico por su ID
     * 
     * @param id El identificador único del artículo
     * @return Optional que contiene el artículo si existe, o vacío si no se encuentra
     */
    Optional<Articulo> obtenerArticuloPorId(Long id);
    
    /**
     * Guarda un nuevo artículo en el sistema
     * 
     * @param articulo El artículo a guardar
     * @return El artículo guardado (con su ID generado)
     * @throws RuntimeException si hay algún problema de validación
     */
    Articulo guardarArticulo(Articulo articulo);
    
    /**
     * Actualiza un artículo existente
     * 
     * @param id El ID del artículo a actualizar
     * @param articulo Los nuevos datos del artículo
     * @return El artículo actualizado
     * @throws RuntimeException si hay problemas de validación o el artículo no existe
     */
    Articulo actualizarArticulo(Long id, Articulo articulo);
    
    /**
     * Elimina un artículo del sistema
     * 
     * @param id El ID del artículo a eliminar
     */
    void eliminarArticulo(Long id);
}
