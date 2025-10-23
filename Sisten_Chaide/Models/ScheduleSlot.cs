using System;

namespace Sisten_Chaide.Models
{
    /// <summary>
    /// Representa un slot de entrega disponible generado por el SP B2B_NuevoAgendamiento.
    /// </summary>
    public class ScheduleSlot
    {
        public DateTime DateKey { get; set; }
        public TimeSpan HourStart { get; set; }
        public TimeSpan HourEnd { get; set; }
        public int AssignedDriverId { get; set; }
        public string AssignedDriverName { get; set; }
        public int AvailableDriverCount { get; set; }
    }
}
