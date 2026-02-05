using System;

namespace Sisten_Chaide.Models
{
    public class Zone
    {
        public int Id { get; set; }

        public string Polygon { get; set; }

        public DateTime CreationDate { get; set; }
        public string CreationDateStr { get; set; }

        public DateTime ModificationDate { get; set; }

        public int UserIdCreation { get; set; }

        public int UserIdModification { get; set; }

        public string name { get; set; }

        public bool active { get; set; }
        public bool Enabled { get; set; }
        public bool hasUserAssing { get; set; }
        public string PolygonGeo { get; set; }
        public bool UserAssing { get; set; }
        public bool DriverHasDeliveries { get; set; }
        public bool lockCalendar { get; set; }
        public DateTime calendarFromLock { get; set; }
        public string strCalendarFromLock { get; set; }
        public DateTime calendarToLock { get; set; }
        public string strCalendarToLock { get; set; }
        public DateTime calendarInitHour { get; set; }
        public string strCalendarInitHour { get; set; }
        public DateTime calendarEndHour { get; set; }
        public string srtCalendarEndHour { get; set; }
        public int intervalValue { get; set; }
    }
}