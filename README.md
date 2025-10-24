
# Sisten Chaide Delivery Management (Versión 2.0)


**Versión 2.0**

Esta versión incluye:
- Corrección crítica en la lógica de agendamiento: los slots ocupados ya no aparecen como disponibles gracias a la validación y registro correcto de la hora de finalización (`EndDelivery`).
- Solución al bucle infinito de detección de zona en el calendario.
- Mejoras en la visualización y selección de slots.
- Validación robusta de disponibilidad y asignación automática de conductores.
- Integración total con la base de datos de pruebas (`chaide_db_test`).
- Panel de administración para usuarios, zonas, perfiles y pedidos.

Este proyecto es una aplicación web ASP.NET MVC para la gestión de entregas y pedidos, diseñada para empresas de logística y distribución. Permite administrar zonas, horarios de entrega, asignación automática de conductores y calendarización visual de slots disponibles. Incluye integración con bases de datos, procedimientos almacenados y lógica de negocio para agendamiento y control de pedidos.

## Características principales
- **Gestión de entregas:** Permite agendar pedidos en franjas horarias disponibles por zona.
- **Calendario visual:** Muestra los slots de entrega en un calendario semanal, con selección automática y validación de disponibilidad.
- **Asignación de conductores:** Automatiza la asignación de conductores según disponibilidad y zona.
- **Control de zonas:** Administra zonas de entrega y sus horarios.
- **Integración con base de datos:** Utiliza procedimientos almacenados para consultar y agendar slots.
- **Panel de administración:** Permite gestionar usuarios, zonas, perfiles y pedidos.
- **Frontend moderno:** Utiliza jQuery, Bootstrap y componentes visuales para una experiencia intuitiva.

## Estructura del proyecto
- `Sisten_Chaide/` - Proyecto principal ASP.NET MVC (controladores, vistas, scripts, modelos).
- `Api_Chaide/` - API REST para integración externa.
- `Resources/` - Recursos compartidos, usuarios, zonas, perfiles.
- `packages/` - Paquetes NuGet y dependencias.

## Instalación y ejecución
1. Clona el repositorio:
   ```
   git clone https://github.com/tuusuario/sisten-chaide-delivery.git
   ```
2. Abre la solución `Sisten_Chaide.sln` en Visual Studio.
3. Configura la cadena de conexión en `Web.config` para tu base de datos de pruebas o producción.
4. Restaura los paquetes NuGet si es necesario.
5. Compila y ejecuta la aplicación (IIS Express o tu servidor preferido).

## Documentación
- Consulta la documentación en `docs/` para detalles técnicos, estructura de base de datos, y ejemplos de uso de la API.
- El archivo `INSTRUCCIONES.txt` contiene pasos rápidos para desarrolladores.


## Cómo funciona la aplicación
- El usuario selecciona una zona y visualiza los horarios disponibles en el calendario semanal.
- Al seleccionar un slot, la aplicación valida disponibilidad y agenda el pedido correctamente, evitando doble agendamiento.
- Los slots ocupados se muestran como "OCUPADO" y no pueden seleccionarse.
- El panel de administración permite gestionar usuarios, zonas, perfiles y pedidos.

## Requisitos
- .NET Framework 4.5+
- SQL Server (o compatible)
- Visual Studio 2015+

## Licencia
Este proyecto es privado y para uso interno de Chaide. Contacta al administrador para permisos de uso o despliegue.

---

# Documentación técnica

La documentación completa se encuentra en la carpeta `docs/` y cubre:
- Estructura de base de datos
- Endpoints de la API
- Lógica de negocio
- Personalización y despliegue

---

