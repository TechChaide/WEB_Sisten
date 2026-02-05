using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_Chaide.Models
{
  public class RegistrarEntregaInput
  {
    public long IdEntrega { get; set; }
    public int StatusId { get; set; }
    public DateTime FechaGestion { get; set; }
    public String SFechaGestion { get; set; }
    public string NombreReceptor { get; set; }
    //public UbicacionEntrega Ubicacion { get; set; }
    public double Latitud { get; set; }
    public double Longitud { get; set; }
    public string Observaciones { get; set; }
    public byte[] Firma { get; set; }
    public string FirmaString { get; set; }
	public string Encuesta { get; set; }
    public List<ItemEntrega> Items { get; set; }
  }
}