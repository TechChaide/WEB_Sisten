using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sisten_Chaide.Models;

namespace Sisten_Chaide.Models
{
	public class DeliverySchedule
	{
		public long DeliverId { get; set; }
		public string Deliveries { get; set; }
		public DateTime DateDelvivery { get; set; }
		public DateTime HourDelivery { get; set; }
		public string StrDateDelivery { get; set; }
		public string StrTimeEndDelivery { get; set; }
		public string ClientName { get; set; }
		public string DriverName { get; set; }
		public string OrderNumber { get; set; }
		public string ZoneName { get; set; }
        public string Address { get; set; }
        public int status { get; set; }
		public int UserId { get; set; }

		public DateTime EndDelivery { get; set; } //aca

		public DeliverySchedule()
        {

        }
    }
}