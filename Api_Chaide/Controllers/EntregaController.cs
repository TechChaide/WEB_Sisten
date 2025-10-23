using API_Chaide.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.ComponentModel;
using Newtonsoft.Json;
using System.IO;
using System.Drawing;

namespace API_Chaide.Controllers
{
  public class EntregaController : ApiController
  {
    //public IHttpActionResult Entregas(EntregasInput Entregas)
    //{
    //  Cliente ClienteTemporal = new Cliente() { Id = 1, Nombre = "Jorge Torres", Ciudad = "Quito", Provincia = "Pichincha", Direccion = "Coruña y Toledo", Telefono = "2873664", Referencia = "Junto a la Farmacia", Latitud = -0.205339, Longitud = -78.482348 };
    //  Transportista TransportistaTemporal = new Transportista() { Id = 1, Nombre = "Pedro Lopez", Observaciones = "" };
    //  List<ItemEntrega> ItemsTemporal = new List<ItemEntrega>(){
    //	new ItemEntrega(){ Id=1, Descripcion="Colchon Confort", Cantidad=1, Observaciones=""},
    //	new ItemEntrega(){ Id=2, Descripcion="Almohadas Confort", Cantidad=2, Observaciones=""},
    //	new ItemEntrega(){ Id=2, Descripcion="Protector Plaza y Media", Cantidad=2, Observaciones=""}
    //  };
    //  List<Entrega> ListaEntregas = new List<Entrega>{
    //	new Entrega(){ Id=1, Fecha=DateTime.Now, Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //	new Entrega(){ Id=2, Fecha=DateTime.Now.AddHours(1), Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //	new Entrega(){ Id=3, Fecha=DateTime.Now.AddHours(2), Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //	new Entrega(){ Id=4, Fecha=DateTime.Now.AddHours(3), Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //	new Entrega(){ Id=5, Fecha=DateTime.Now.AddHours(4), Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //	new Entrega(){ Id=6, Fecha=DateTime.Now.AddHours(5), Cliente=ClienteTemporal, Transportista=TransportistaTemporal, Items=ItemsTemporal},
    //  };
    //  return Ok(ListaEntregas);
    //}

    public IHttpActionResult RealizarEntrega(RegistrarEntregaInput Entrega)
    {
      //var firma = Base64Decode(Entrega.FirmaString);
      //Entrega.Firma = JsonStringToByteArray(firma);
      //var recepcion = Entrega;
      DateTime DateTimeDelivery = Entrega.SFechaGestion != null ? DateTime.ParseExact(Entrega.SFechaGestion, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture) : DateTime.Now;
      try
      {
        SqlConnection cnn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
        SqlCommand cmd = new SqlCommand("[web.mobile.delivery.update]", cnn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@deliveryId", Entrega.IdEntrega);
        cmd.Parameters.AddWithValue("@observations", Entrega.Observaciones ?? "");
        //cmd.Parameters.AddWithValue("@signature" , DBNull.Value);
        cmd.Parameters.AddWithValue("@statusId", Entrega.StatusId);
        cmd.Parameters.AddWithValue("@questions", Entrega.Encuesta ?? "");
        cmd.Parameters.AddWithValue("@receptorName", Entrega.NombreReceptor ?? "");
        cmd.Parameters.AddWithValue("@dateHourDelivery", DateTimeDelivery);
        cmd.Parameters.AddWithValue("@lat", Entrega.Latitud);
        cmd.Parameters.AddWithValue("@lng" , Entrega.Longitud);

        var imageData = Convert.FromBase64String(Entrega.FirmaString);
        cmd.Parameters.AddWithValue("@signature" , imageData);

        DataTable items = new DataTable();

        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(ItemStatus));
        foreach (PropertyDescriptor prop in properties)
            items.Columns.Add(prop.Name , Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
        foreach (ItemEntrega itemE in Entrega.Items)
        {
            var item = new ItemStatus { 
                ItemId = itemE.Id,
                Status = itemE.Observaciones.ToUpper()=="ENTREGADO"
            };
            DataRow row = items.NewRow();
            foreach (PropertyDescriptor prop in properties)
                row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
            items.Rows.Add(row);
        }
        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@list_items" , SqlDbType = SqlDbType.Structured , Value = items });
        cmd.Connection.Open();
        SqlDataReader r = cmd.ExecuteReader();
        r.Close();
        return Json("Ok");
      }
      catch (Exception ex)
      {
        return Json("Error: " + ex.Message);
      }
    }

    public static string Base64Decode(string base64EncodedData)
    {
      var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
      return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }

    public static byte[] JsonStringToByteArray(string jsonByteString)
    {
      jsonByteString = jsonByteString.Substring(1, jsonByteString.Length - 2);
      string[] arr = jsonByteString.Split(',');
      byte[] bResult = new byte[arr.Length];
      for (int i = 0; i < arr.Length; i++)
      {
        bResult[i] = byte.Parse(arr[i]);
      }
      return bResult;
    }

    public Image Base64ToImage ( string base64String )
    {
        // Convert Base64 String to byte[]
        byte[] imageBytes = Convert.FromBase64String(base64String);
        MemoryStream ms = new MemoryStream(imageBytes , 0 ,
          imageBytes.Length);

        // Convert byte[] to Image
        ms.Write(imageBytes , 0 , imageBytes.Length);
        Image image = Image.FromStream(ms , true);
        return image;
    }

    public IHttpActionResult Entregas(EntregasInput Entregas)
    {
      List<Cliente> clients = new List<Cliente>();
      List<Entrega> entregas = new List<Entrega>();
      List<ItemEntrega> detalles = new List<ItemEntrega>();
      //var resultado = new Transportista() { Id = 1 , Nombre = "Usuario " + LoginUser.Username , Observaciones = "" };
      DateTime date = DateTime.ParseExact(Entregas.Fecha, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      DateTime endDate = DateTime.ParseExact(Entregas.FechaFin, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      try
      {
        SqlConnection cnn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
        SqlCommand cmd = new SqlCommand("[web.mobile.get_delivery_by_date]", cnn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@id", Entregas.IdTransportista);
        cmd.Parameters.AddWithValue("@date", date);
        cmd.Parameters.AddWithValue("@end_date", endDate);
        cmd.Connection.Open();
        SqlDataReader r = cmd.ExecuteReader();
        if (r.HasRows)
        {
          while (r.Read())
          {
            var cliente = new Cliente()
            {
              Id = r["CodeId"].ToString(),
              Nombre = r["ClienteName"].ToString(),
              Telefono = r["PhoneNumber"].ToString(),
              Celular = r["CellPhoneNumber"].ToString(),
              Provincia = r["Province"].ToString(),
              Ciudad = r["City"].ToString(),
              Direccion = r["Address"].ToString(),
              Latitud = Convert.ToDouble(r["Latitude"]),
              Longitud = Convert.ToDouble(r["Longitude"]),
              Email = r["Email"].ToString(),
              Referencia = r["ReferenceAddress"].ToString()
            };
            clients.Add(cliente);
          }
          if (r.NextResult())
          {
            while (r.Read())
            {
              var detalle = new ItemEntrega()
              {
                DeliveryId = Convert.ToInt32(r["DeliveryId"]),
                Id = Convert.ToInt32(r["DetailId"]),
                Cantidad = Convert.ToInt32(r["Quantity"]),
                Descripcion = r["ProductName"].ToString(),
                Observaciones = r["Observations"].ToString()
              };
              detalles.Add(detalle);
            }
            if (r.NextResult())
            {
              while (r.Read())
              {
                var cabecera = new Entrega()
                {
                  Id = Convert.ToInt32(r["DeliveryId"]),
                  Fecha = Convert.ToDateTime(r["HourDelivery"]),
                  Cliente = clients.FirstOrDefault(x => x.Id == r["CodeId"].ToString()),
                  Items = detalles.Where(x => x.DeliveryId == Convert.ToInt32(r["DeliveryId"])).ToList(),
                  Entregas = r["Deliveries"].ToString(),
                  NombreVendedor = r["SellerName"].ToString()
                };
                entregas.Add(cabecera);
              }
            }
          }
        }
        else
        {
          r.Close();
          return Json(new { Aviso = "No se ha encontrado resultados" });
        }
        r.Close();
        return Ok(entregas);

      }
      catch (Exception ex)
      {
        if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { Entregas.Fecha }));
        throw;
      }

    }
  }
}
