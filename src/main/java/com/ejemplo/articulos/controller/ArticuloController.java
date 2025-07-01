
package com.ejemplo.articulos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ejemplo.articulos.model.Articulo;
import com.ejemplo.articulos.service.ArticuloService;

/**
 * Controlador REST para la gestión de artículos
 * 
 * Este controlador es la puerta de entrada de nuestra API REST.
 * Se encarga de recibir las peticiones HTTP del frontend y coordinar
 * las respuestas usando el servicio de artículos.
 * 
 * Las anotaciones importantes aquí son:
 * - @RestController: Marca esta clase como un controlador REST
 * - @RequestMapping: Define la ruta base (/api/articulos)
 * - @CrossOrigin: Permite peticiones desde cualquier origen (CORS)
 * 
 * Cada método maneja un endpoint específico de nuestra API:
 * - GET /api/articulos -> listar todos
 * - GET /api/articulos/{id} -> obtener uno específico
 * - POST /api/articulos -> crear nuevo
 * - PUT /api/articulos/{id} -> actualizar existente
 * - DELETE /api/articulos/{id} -> eliminar
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier origen
@RestController // Combina @Controller + @ResponseBody
@RequestMapping("/api/articulos") // Ruta base para todos los endpoints
public class ArticuloController {

    /**
     * Servicio que contiene la lógica de negocio
     * 
     * El controlador no hace lógica de negocio, solo coordina.
     * Todo el trabajo pesado lo hace el servicio.
     */
    private final ArticuloService articuloService;

    /**
     * Constructor que recibe el servicio por inyección de dependencias
     * 
     * @param articuloService El servicio de artículos
     */
    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    /**
     * Endpoint para listar todos los artículos
     * 
     * GET /api/articulos
     * 
     * @return Lista de todos los artículos en formato JSON
     */
    @GetMapping
    public List<Articulo> listar() {
        return articuloService.listarArticulos();
    }

    /**
     * Endpoint para obtener un artículo específico por ID
     * 
     * GET /api/articulos/{id}
     * 
     * @param id El ID del artículo a buscar
     * @return ResponseEntity con el artículo si existe, o 404 si no se encuentra
     */
    @GetMapping("/{id}")
    public ResponseEntity<Articulo> obtenerPorId(@PathVariable Long id) {
        return articuloService.obtenerArticuloPorId(id)
                .map(ResponseEntity::ok) // Si existe, devuelve 200 OK
                .orElse(ResponseEntity.notFound().build()); // Si no existe, devuelve 404
    }

    /**
     * Endpoint para crear un nuevo artículo
     * 
     * POST /api/articulos
     * Body: JSON con los datos del artículo
     * 
     * Este método maneja tanto casos de éxito como errores de validación.
     * 
     * @param articulo Los datos del nuevo artículo (viene del JSON del body)
     * @return ResponseEntity con el artículo creado o mensaje de error
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Articulo articulo) {
        try {
            // Intentamos guardar el artículo
            Articulo nuevoArticulo = articuloService.guardarArticulo(articulo);
            return ResponseEntity.ok(nuevoArticulo);
        } catch (RuntimeException e) {
            // Si hay algún error de validación, devolvemos un 400 Bad Request
            // con el mensaje específico del error
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para actualizar un artículo existente
     * 
     * PUT /api/articulos/{id}
     * Body: JSON con los nuevos datos del artículo
     * 
     * @param id El ID del artículo a actualizar
     * @param articulo Los nuevos datos del artículo
     * @return ResponseEntity con el artículo actualizado, 404 si no existe, o 400 si hay errores
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Articulo articulo) {
        // Primero verificamos que el artículo existe
        if (articuloService.obtenerArticuloPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            // Intentamos actualizar el artículo
            Articulo articuloActualizado = articuloService.actualizarArticulo(id, articulo);
            return ResponseEntity.ok(articuloActualizado);
        } catch (RuntimeException e) {
            // Si hay errores de validación, devolvemos el mensaje específico
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para eliminar un artículo
     * 
     * DELETE /api/articulos/{id}
     * 
     * @param id El ID del artículo a eliminar
     * @return ResponseEntity 204 No Content si se eliminó correctamente, 404 si no existe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        // Verificamos que el artículo existe antes de intentar eliminarlo
        if (articuloService.obtenerArticuloPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Eliminamos el artículo
        articuloService.eliminarArticulo(id);
        
        // Devolvemos 204 No Content para indicar que se eliminó exitosamente
        return ResponseEntity.noContent().build();
    }
}
