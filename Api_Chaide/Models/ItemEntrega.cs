using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_Chaide.Models
{
  public class ItemEntrega
  {
	public long DeliveryId { get; set; }
	public int Id { get; set; }
    public string Descripcion { get; set; }
    public int Cantidad { get; set; }
    public string Observaciones { get; set; }
  }

  public class ItemStatus
  {
      public int ItemId { get; set; }
      public bool Status { get; set; }
  }
}