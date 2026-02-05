using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace API_Chaide.Models
{
  public class Entrega
  {
    public long Id { get; set; }
    public DateTime Fecha { get; set; }
    public Cliente Cliente { get; set; }
    public List<ItemEntrega> Items { get; set; }
	public string Entregas { get; set; }
	public string NombreVendedor { get; set; }
  }
}