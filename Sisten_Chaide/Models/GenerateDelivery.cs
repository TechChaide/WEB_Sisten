using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
    public class GenerateDelivery
    {
        public string OrderNumber { get; set; }
        public int DeliveryId { get; set; }
        public Driver driver { get; set; }
        public Client client { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public Decimal dlat { get; set; }
        public Decimal dlng { get; set; }
        public int status { get; set; }
        public string Observations { get; set; }
        public string dateDelivery { get; set; }
        public List<ItemProduct> ListProducts { get; set; }
        public string Deliveries { get; set; }
        public string ReferenceAddress { get; set; }
        public string StatusItem { get; set; }
        public string ItemDispatch { get; set; }
        public DateTime DateHourDelvivery { get; set; }
        public string StrDateHourDeliveryReception { get; set; }
        public Decimal deliverylat { get; set; }
        public Decimal deliverylng { get; set; }
        public string ReceptorName { get; set; }

        public string EndDelivery { get; set; }

    }
}