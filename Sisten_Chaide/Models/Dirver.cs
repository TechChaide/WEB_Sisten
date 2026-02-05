using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
	public class Driver
	{
		public Zone zone { get; set; }
		public User user { get; set; }
		public List<driverSchedule> Calendar { get; set; }

	}
	public class driverSchedule
	{
		public int DeliveryId { get; set; }
		public DateTime DateDelivery { get; set; }
		public DateTime HourDelivery { get; set; }
		public string StrDateDelivery { get; set; }
		public string StrTimeDelivery { get; set; }
		public string StrTimeEndDelivery { get; set; }
		public string ClienteName { get; set; }

	}
}