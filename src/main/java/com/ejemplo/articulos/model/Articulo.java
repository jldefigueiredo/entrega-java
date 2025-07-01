
package com.ejemplo.articulos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Clase que representa un artículo en nuestro sistema
 * 
 * Esta clase es lo que llamamos una "entidad" - básicamente es un objeto
 * que se mapea directamente con una tabla en la base de datos.
 * Cada instancia de esta clase representa una fila en la tabla "articulo".
 * 
 * Las anotaciones (@Entity, @Table, etc.) le dicen a JPA (nuestro ORM)
 * cómo manejar esta clase y cómo conectarla con la base de datos.
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
@Entity // Le dice a JPA que esta clase representa una tabla
@Table(name = "articulo") // Especifica el nombre exacto de la tabla en la BD
public class Articulo {

    /**
     * Identificador único del artículo
     * 
     * Este es el ID que usa la base de datos para identificar cada artículo.
     * Se genera automáticamente cuando creamos un nuevo artículo.
     */
    @Id // Marca este campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;

    /**
     * Nombre del artículo
     * 
     * Este campo tiene varias restricciones importantes:
     * - Debe ser único (no puede haber dos artículos con el mismo nombre)
     * - No puede ser nulo (siempre debe tener un valor)
     * - Máximo 100 caracteres para mantener la base de datos ordenada
     */
    @Column(unique = true, nullable = false, length = 100)
    private String nombre;
    
    /**
     * Precio del artículo en la moneda local
     * 
     * Usamos Double para permitir decimales (ej: 19.99, 150.50).
     * Este campo tampoco puede ser nulo porque todo artículo debe tener precio.
     */
    @Column(nullable = false)
    private Double precio;

    /**
     * Constructor vacío requerido por JPA
     * 
     * JPA necesita este constructor para poder crear instancias de la clase
     * cuando carga datos desde la base de datos. No lo usamos directamente.
     */
    public Articulo() {}

    /**
     * Constructor completo para crear artículos con todos los datos
     * 
     * @param id El identificador del artículo
     * @param nombre El nombre del artículo
     * @param precio El precio del artículo
     */
    public Articulo(Long id, String nombre, Double precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }

    // Métodos getter y setter
    // Estos métodos permiten acceder y modificar los campos privados de la clase
    
    /**
     * Obtiene el ID del artículo
     * @return El identificador único del artículo
     */
    public Long getId() { 
        return id; 
    }
    
    /**
     * Establece el ID del artículo
     * @param id El nuevo identificador del artículo
     */
    public void setId(Long id) { 
        this.id = id; 
    }
    
    /**
     * Obtiene el nombre del artículo
     * @return El nombre del artículo
     */
    public String getNombre() { 
        return nombre; 
    }
    
    /**
     * Establece el nombre del artículo
     * @param nombre El nuevo nombre del artículo
     */
    public void setNombre(String nombre) { 
        this.nombre = nombre; 
    }
    
    /**
     * Obtiene el precio del artículo
     * @return El precio del artículo
     */
    public Double getPrecio() { 
        return precio; 
    }
    
    /**
     * Establece el precio del artículo
     * @param precio El nuevo precio del artículo
     */
    public void setPrecio(Double precio) { 
        this.precio = precio; 
    }
}
