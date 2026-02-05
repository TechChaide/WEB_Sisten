using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
	public class Order
	{
		public string UserOrder { get; set; }
		public int OrderNumber { get; set; }
		public string Date { get; set; }
		public string BillNumber { get; set; }
		public string PolygonGeo { get; set; }

	}
}