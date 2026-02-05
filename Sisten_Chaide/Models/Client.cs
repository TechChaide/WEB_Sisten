namespace Sisten_Chaide.Models
{
  public class Client
	{
		//[Required(ErrorMessageResourceName = "RequiredOrderNumber" , ErrorMessageResourceType = typeof(Clients))]
		//public striOrderNumber
		public string CodeClient { get; set; }
		public string ClientName { get; set; }
		public string SellerName { get; set; }
		public string CodeBillDestination { get; set; }
		public string PhoneNumber { get; set; }
		public string CellPhoneNumber { get; set; }
		public string Province { get; set; }
		public string City { get; set; }
		public string Address { get; set; }
		public string email { get; set; }
		public string ruc_ci { get; set; }
        public bool donacion { get; set; }
        public bool vulnerable { get; set; }
        //campo agregado para clientes resiflex
        public string cedula { get; set; }

    }
}