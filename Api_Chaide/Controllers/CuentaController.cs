using API_Chaide.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;

namespace API_Chaide.Controllers
{
	public class CuentaController : ApiController
	{
		//public static readonly string DefaultConnection = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
		//public static readonly string DefaultConnection1 = ConfigurationManager.ConnectionStrings["DefaultConnection1"].ConnectionString;

		public IHttpActionResult Login ( LoginInput LoginUser )
		{
			Transportista Driver = null;
			//var resultado = new Transportista() { Id = 1 , Nombre = "Usuario " + LoginUser.Username , Observaciones = "" };
			string encryptedPassword = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(LoginUser.Password , "SHA1");
			try
			{
				SqlConnection cnn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
				SqlCommand cmd = new SqlCommand("[admin.security.mobile_login]" , cnn)
				{
					CommandType = CommandType.StoredProcedure
				};
				cmd.Parameters.AddWithValue("@username" , LoginUser.Username);
				cmd.Parameters.AddWithValue("@password" , encryptedPassword);
				cmd.Parameters.Add(new SqlParameter() { ParameterName = "@output_id" , SqlDbType = System.Data.SqlDbType.Int , Direction = System.Data.ParameterDirection.Output });
				cmd.Connection.Open();
				SqlDataReader r = cmd.ExecuteReader();
				if (r.HasRows)
				{
					while (r.Read())
					{
						Driver = new Transportista()
						{
							Id = Convert.ToInt32(r["id"]) ,
							Nombre = r["full_name"].ToString()
						};
					}
				} else
				{
					r.Close();
					int returnCode = (int) cmd.Parameters["@output_id"].Value;
					if (returnCode == -100)
					{
						return Json(new { Error = "Usuario y credenciales invalidas" });
					}
					return Json(new { Error = "Usuario y credenciales invalidas" });
				}
				r.Close();
				return Ok(Driver);

			}
			catch (Exception ex)
			{
				if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { LoginUser.Username , LoginUser.Password }));
				throw;
			}

		}



	}

}
