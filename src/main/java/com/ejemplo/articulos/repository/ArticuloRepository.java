package com.ejemplo.articulos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ejemplo.articulos.model.Articulo;

/**
 * Repositorio para manejar las operaciones de base de datos de los artículos
 * 
 * Esta interfaz es lo que llamamos un "repositorio" o "DAO" (Data Access Object).
 * Se encarga de toda la comunicación con la base de datos relacionada con artículos.
 * 
 * Lo genial de Spring Data JPA es que solo necesitamos definir los métodos
 * que queremos y él se encarga de implementarlos automáticamente.
 * 
 * Al extender JpaRepository<Articulo, Long>, obtenemos gratis métodos como:
 * - findAll() para obtener todos los artículos
 * - findById() para buscar por ID
 * - save() para guardar o actualizar
 * - delete() para eliminar
 * - count() para contar registros
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
@Repository // Le dice a Spring que esta es una clase de acceso a datos
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {

    // ===============================================
    // 🚀 MÉTODOS CRUD INCLUIDOS AUTOMÁTICAMENTE
    // ===============================================
    // Estos métodos vienen "gratis" al extender JpaRepository:
    //
    // findAll()                -> Lista todos los artículos
    // findById(Long id)        -> Busca uno por ID
    // save(Articulo a)         -> Inserta o actualiza un artículo
    // deleteById(Long id)      -> Elimina por ID
    // count()                  -> Cuenta cuántos artículos hay
    // existsById(Long id)      -> Verifica si existe un artículo con ese ID

    // ===============================================
    // 🛠️ MÉTODOS PERSONALIZADOS
    // ===============================================
    // Aquí definimos métodos adicionales que necesitamos.
    // Spring Data JPA los implementa automáticamente basándose en el nombre.

    /**
     * Busca artículos por nombre exacto
     * 
     * @param nombre El nombre exacto del artículo a buscar
     * @return Lista de artículos con ese nombre (normalmente será solo uno por la restricción unique)
     */
    List<Articulo> findByNombre(String nombre);

    /**
     * Busca artículos cuyo nombre contenga una palabra específica
     * 
     * Es útil para funcionalidades de búsqueda. Por ejemplo, si buscamos "café"
     * encontrará artículos como "Café colombiano", "Café con leche", etc.
     * 
     * @param texto El texto que debe estar contenido en el nombre
     * @return Lista de artículos cuyos nombres contienen el texto especificado
     */
    List<Articulo> findByNombreContaining(String texto);

    /**
     * Busca artículos con precio mayor al especificado
     * 
     * Útil para filtrar artículos caros o establecer rangos de precios.
     * 
     * @param precio El precio mínimo (no incluido)
     * @return Lista de artículos con precio superior al especificado
     */
    List<Articulo> findByPrecioGreaterThan(Double precio);

    /**
     * Busca artículos con precio entre dos valores
     * 
     * Perfecto para filtros de rango de precios en una tienda online.
     * 
     * @param min Precio mínimo (incluido)
     * @param max Precio máximo (incluido)
     * @return Lista de artículos dentro del rango de precios
     */
    List<Articulo> findByPrecioBetween(Double min, Double max);

    /**
     * Busca por nombre ignorando mayúsculas y minúsculas
     * 
     * Así "CAFÉ", "café" y "Café" se consideran iguales.
     * 
     * @param nombre El nombre a buscar (sin importar mayúsculas/minúsculas)
     * @return Lista de artículos con ese nombre
     */
    List<Articulo> findByNombreIgnoreCase(String nombre);

    /**
     * Obtiene todos los artículos ordenados por precio de menor a mayor
     * 
     * @return Lista de artículos ordenada por precio ascendente
     */
    List<Articulo> findAllByOrderByPrecioAsc();

    /**
     * Busca artículos por nombre y que tengan precio mayor al especificado
     * 
     * Ejemplo de consulta con múltiples condiciones.
     * 
     * @param nombre El nombre del artículo
     * @param precio El precio mínimo
     * @return Lista de artículos que cumplen ambas condiciones
     */
    List<Articulo> findByNombreAndPrecioGreaterThan(String nombre, Double precio);
    
    /**
     * Verifica si existe un artículo con el nombre especificado
     * 
     * Este método es crucial para nuestras validaciones de duplicados.
     * En lugar de cargar el artículo completo, solo pregunta si existe.
     * 
     * @param nombre El nombre a verificar
     * @return true si existe un artículo con ese nombre, false en caso contrario
     */
    boolean existsByNombre(String nombre);
    
    /**
     * Verifica si existe un artículo con el nombre especificado, excluyendo un ID
     * 
     * Esto es perfecto para validaciones durante ediciones.
     * Por ejemplo, si estamos editando el artículo con ID=5 y queremos cambiar
     * su nombre a "Café", este método verificará si ya existe otro artículo
     * (que no sea el ID=5) con el nombre "Café".
     * 
     * @param nombre El nombre a verificar
     * @param id El ID a excluir de la búsqueda
     * @return true si existe otro artículo (no el del ID especificado) con ese nombre
     */
    boolean existsByNombreAndIdNot(String nombre, Long id);
}
