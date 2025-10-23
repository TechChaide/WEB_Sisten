# Estructura y funcionamiento de la aplicación

## Arquitectura
- **ASP.NET MVC**: Controladores, modelos y vistas para la gestión de entregas.
- **Frontend**: jQuery, Bootstrap, scripts personalizados para calendario y lógica de slots.
- **Backend**: Lógica de negocio en C#, integración con procedimientos almacenados SQL.
- **API REST**: Permite integración externa para consulta y agendamiento de pedidos.

## Flujo principal
1. El usuario selecciona una zona de entrega.
2. El sistema consulta los slots disponibles vía SP y muestra el calendario.
3. El usuario selecciona un slot y agenda el pedido.
4. El backend valida y actualiza la base de datos.
5. Los slots ocupados no se muestran como disponibles.

## Personalización
- Modifica los controladores y modelos para adaptar reglas de negocio.
- Los scripts JS permiten cambiar la experiencia visual y lógica de selección.

## Seguridad
- Control de sesiones y permisos por perfil.
- Validación de datos en backend y frontend.

## Despliegue
- Configura la cadena de conexión en `Web.config`.
- Compila y ejecuta en IIS Express o IIS local.

---

# Contacto
Para soporte técnico, escribe a sistemas@chaide.com
