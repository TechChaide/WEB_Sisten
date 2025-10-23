using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
	public class ItemProduct
	{
		public int ItemId { get; set; }
		public string OrderNumber { get; set; }
		public string ProductCode { get; set; }
		public string ProductName { get; set; }
		public int quantity { get; set; }
		public string observations { get; set; }
		public bool Status { get; set; }
		public bool Dispatched { get; set; }
        public int quantityD { get; set; }
    }
}