using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_Chaide.Models
{
  public class EntregasInput
  {
    public int IdTransportista { get; set; }
    public string Fecha { get; set; }
    public string FechaFin { get; set; }
  }
}