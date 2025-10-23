using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_Chaide.Models
{
  public class Cliente
  {
    public string Id { get; set; }
    public string Nombre { get; set; }
	public string Telefono { get; set; }
	public string Celular { get; set; }
    public string Provincia { get; set; }
    public string Ciudad { get; set; }
    public string Direccion { get; set; }
    public string Referencia { get; set; }
    public double Latitud { get; set; }
    public double Longitud { get; set; }
	public string Email { get; set; }
	
  }
}