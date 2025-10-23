# Documentación Técnica - Sisten Chaide Delivery

## Índice
- [Estructura de la base de datos](#estructura-de-la-base-de-datos)
- [Endpoints principales](#endpoints-principales)
- [Lógica de negocio](#logica-de-negocio)
- [Configuración y despliegue](#configuracion-y-despliegue)

---

## Estructura de la base de datos
- **Tablas principales:**
  - `Pedidos`: Registra los pedidos agendados.
  - `Zonas`: Define las zonas de entrega.
  - `Slots`: Franjas horarias disponibles y ocupadas.
  - `Conductores`: Usuarios asignados a entregas.
- **Procedimientos almacenados:**
  - `B2B_NuevoAgendamiento`: Consulta y agenda slots.
  - Otros SPs para gestión de usuarios y zonas.

## Endpoints principales
- `GET /Delivery/GetAvailableSlots?zoneId={id}&startDate={fecha}&days={n}`
  - Devuelve los slots disponibles para una zona y rango de fechas.
- `POST /Delivery/AgendarPedido`
  - Agenda un pedido en un slot seleccionado.
- `GET /Delivery/GetOrderInfo?id={id}`
  - Obtiene información detallada de un pedido.

## Lógica de negocio
- El frontend consulta los slots y muestra el calendario.
- Al agendar, se valida disponibilidad y se actualiza la base de datos.
- Los slots ocupados no se muestran como disponibles.
- El backend utiliza SPs para garantizar integridad y concurrencia.

## Configuración y despliegue
- Edita `Web.config` para la cadena de conexión correcta (test/producción).
- Restaura paquetes NuGet antes de compilar.
- Ejecuta en IIS Express o IIS local.
- Para producción, configura el entorno y permisos de usuario.

---

## Personalización
- Puedes modificar zonas, horarios y lógica de asignación en los controladores y modelos.
- Los scripts JS permiten adaptar la experiencia visual y reglas de negocio.

---

## Contacto y soporte
Para dudas técnicas, escribe a sistemas@chaide.com
