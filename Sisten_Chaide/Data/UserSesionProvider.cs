using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Sisten_Chaide.Models;
using Newtonsoft.Json;

namespace Sisten_Chaide.Data
{
  public class UserSesionProvider
  {

    public UserSesionProvider(string cnstring) { }

    private readonly SqlConnection _connection;
    public UserSesionProvider()
    {
      _connection = new SqlConnection(ApplicationContext.DefaultConnection);
    }

    public SessionUser Login(string username, string password)
    {
      SessionUser loggedUser = null;
      UserSesionProvider connect = new UserSesionProvider();
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = connect._connection;
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.CommandText = "[admin.security.login]";
        cmd.Parameters.AddWithValue("@username", username);
        cmd.Parameters.AddWithValue("@password", password);
        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@output_id", SqlDbType = System.Data.SqlDbType.Int, Direction = System.Data.ParameterDirection.Output });
        try
        {
          cmd.Connection.Open();
          SqlDataReader r = cmd.ExecuteReader();
          if (r.HasRows)
          {
            while (r.Read())
            {
              loggedUser = new SessionUser()
              {
                id = Convert.ToInt32(r[0]),
                username = r[3].ToString()
              };
            }
            r.NextResult();
            List<string> features = new List<string>();
            while (r.Read())
            {
              features.Add(r["development_reference"].ToString());
            }
            loggedUser.features = features;
          }
          r.Close();
          int returnCode = (int)cmd.Parameters["@output_id"].Value;
          if (returnCode != 0)
          {
            throw new BusinessException(returnCode);
          }
        }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { username, password }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }
      return loggedUser;
    }
  }
}