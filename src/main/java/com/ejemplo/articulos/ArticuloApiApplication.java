
package com.ejemplo.articulos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación de gestión de artículos
 * 
 * Esta es la clase que arranca toda nuestra aplicación Spring Boot.
 * Es el punto de entrada donde comienza todo cuando ejecutamos el programa.
 * 
 * La anotación @SpringBootApplication es realmente poderosa porque combina tres anotaciones:
 * 1. @Configuration - Indica que esta clase puede definir beans
 * 2. @EnableAutoConfiguration - Le dice a Spring Boot que configure automáticamente
 *    todo lo que necesitemos basándose en las dependencias del classpath
 * 3. @ComponentScan - Escanea este paquete y sus subpaquetes buscando componentes
 *    de Spring (controladores, servicios, repositorios, etc.)
 * 
 * Cuando Spring Boot arranca, automáticamente detecta:
 * - Nuestros controladores REST en el paquete controller
 * - Nuestros servicios en el paquete service  
 * - Nuestros repositorios en el paquete repository
 * - Nuestras entidades en el paquete model
 * - La configuración de la base de datos en application.properties
 * 
 * @author Sistema de Gestión de Artículos
 * @version 1.0
 */
@SpringBootApplication
public class ArticuloApiApplication {
    
    /**
     * Método principal que inicia la aplicación
     * 
     * Este método es lo primero que se ejecuta cuando corremos la aplicación.
     * SpringApplication.run() se encarga de:
     * 1. Crear el contexto de Spring
     * 2. Configurar todos los componentes automáticamente
     * 3. Levantar el servidor web embebido (Tomcat)
     * 4. Inicializar la conexión a la base de datos
     * 5. Registrar todos nuestros endpoints REST
     * 
     * @param args Argumentos de línea de comandos (generalmente vacío)
     */
    public static void main(String[] args) {
        // ¡Y arrancamos! Con esta simple línea tenemos un servidor web completo
        SpringApplication.run(ArticuloApiApplication.class, args);
        
        System.out.println("🚀 ¡Aplicación de artículos iniciada exitosamente!");
        System.out.println("📋 API disponible en: http://localhost:8080/api/articulos");
        System.out.println("🌐 Interfaz web en: Abrir FRONT/index.html en el navegador");
    }
}
