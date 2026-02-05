using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Sisten_Chaide.Models;
using Newtonsoft.Json;

namespace Sisten_Chaide.Data
{
  public class ProfilesProvider
  {
    public ProfilesProvider(string cnstring) { }

    private SqlConnection _connection;

    public ProfilesProvider()
    {
      _connection = new SqlConnection(ApplicationContext.DefaultConnection);
    }
    public Collection<Profile> Get(SessionUser currentUser, object keyword, CollectionSettings settings)
    {
      Collection<Profile> profiles = new Collection<Profile>() { pagging_settings = settings };
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.get_all]";

        cmd.Parameters.AddWithValue("@keyword", keyword ?? DBNull.Value);

        SqlParameter total_filtered = new SqlParameter("@total_filtered", SqlDbType.BigInt);
        total_filtered.Direction = ParameterDirection.InputOutput;
        total_filtered.Value = 0;

        SqlParameter total = new SqlParameter("@total", System.Data.SqlDbType.BigInt);
        total.Direction = ParameterDirection.InputOutput;
        total.Value = 0;

        if (settings.enabled)
        {
          cmd.Parameters.AddWithValue("@page", settings.page_number - 1);
          cmd.Parameters.AddWithValue("@page_size", settings.page_size);
        }

        cmd.Parameters.Add(total);
        cmd.Parameters.Add(total_filtered);

        try
        {
          cmd.Connection.Open();
          SqlDataReader reader = cmd.ExecuteReader();
          while (reader.Read())
          {
            profiles.items.Add(new Profile()
            {
              Id = Convert.ToInt32(reader["id"]),
              Name = reader["name"].ToString()
            });
          }
        }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { keyword }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }

        profiles.pagging_settings.total_items = Convert.ToInt32(cmd.Parameters["@total"].Value);
        profiles.pagging_settings.total_filtered_items = Convert.ToInt64(cmd.Parameters["@total_filtered"].Value);

        return profiles;
      }
    }

    public FormProfile GetOne(int id)
    {
      FormProfile cProfile = new FormProfile() { is_new = id == -1 };


      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.get_one]";
        cmd.Parameters.AddWithValue("@id", id);

        try
        {
          cmd.Connection.Open();
          SqlDataReader r = cmd.ExecuteReader();

          if (r.Read())
          {
            Profile p = new Profile
            {
              Id = Convert.ToInt32(r["id"]),
              Name = r["name"].ToString()
            };
            cProfile.profile = p;
          }

          if (r.NextResult())
          {
            List<Development_function> dev_functions = new List<Development_function>();
            while (r.Read())
            {
              Development_function d = new Development_function()
              {
                id = Convert.ToInt32(r["id"]),
                name = r["name"].ToString(),
                active = Convert.ToBoolean(r["active"]),
              };
              dev_functions.Add(d);
            }
            cProfile.profile.development_function = dev_functions;
            cProfile.profile.dev_function_text = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = Int32.MaxValue }.Serialize(dev_functions);
          }

          if (r.NextResult())
          {
            List<string> l = new List<string>();
            while (r.Read())
            {
              l.Add(r["user"].ToString());
            }
            cProfile.users = l;
          }

        }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { id }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }


      return cProfile;
    }

    public void Add(FormProfile fprofile)
    {
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.add]";
        cmd.Parameters.AddWithValue("@name", fprofile.profile.Name);
        //cmd.Parameters.AddWithValue("@public", fprofile.profile.is_public);

        System.Data.DataTable dev_functions = new System.Data.DataTable();
        dev_functions.Columns.AddRange(new System.Data.DataColumn[]{
					        new System.Data.DataColumn("development_id", typeof(int))					
				        });

        int[] dev_fun = (from p in fprofile.profile.development_function
                         where p.active == true
                         select p.id).ToArray();

        foreach (int df in dev_fun)
        {
          dev_functions.Rows.Add(df);
        }

        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@development_function", SqlDbType = SqlDbType.Structured, Value = dev_functions });

        try
        {
          cmd.Connection.Open();
          cmd.ExecuteNonQuery();
        }
        catch (BusinessException bex) { throw bex; }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { fprofile.profile.Name, dev_functions }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }
    }

    public void Update(FormProfile fprofile)
    {
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.update]";
        cmd.Parameters.AddWithValue("@id", fprofile.profile.Id);
        cmd.Parameters.AddWithValue("@name", fprofile.profile.Name);
        //cmd.Parameters.AddWithValue("@public", fprofile.profile.is_public);

        DataTable dev_functions = new DataTable();
        dev_functions.Columns.AddRange(new DataColumn[]{
					        new DataColumn("development_id", typeof(int))					
				        });

        int[] dev_fun = (from p in fprofile.profile.development_function
                         where p.active == true
                         select p.id).ToArray();

        foreach (int df in dev_fun)
        {
          dev_functions.Rows.Add(df);
        }

        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@development_function", SqlDbType = SqlDbType.Structured, Value = dev_functions });

        try
        {
          cmd.Connection.Open();
          cmd.ExecuteNonQuery();
        }
        catch (BusinessException bex) { throw bex; }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { fprofile.profile.Id, fprofile.profile.Name,dev_functions }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }
    }

    public void Delete(int id)
    {
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.delete]";
        cmd.Parameters.AddWithValue("@id", id);

        try
        {
          cmd.Connection.Open();
          cmd.ExecuteNonQuery();
        }
        catch (BusinessException bex) { throw bex; }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { id }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }

    }

    public string Get_banned_profile(int id)
    {
      string banned = "";
      using (SqlCommand cmd = new SqlCommand())
      {
        cmd.Connection = _connection;
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.CommandText = "[admin.profiles.get_banned]";
        cmd.Parameters.AddWithValue("@id", id);

        try
        {
          cmd.Connection.Open();
          SqlDataReader r = cmd.ExecuteReader();

          while (r.Read())
          {
            banned = r["banned"].ToString();
          }
          banned = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = Int32.MaxValue }.Serialize(banned);
        }
        catch (Exception ex)
        {
          if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { id }));
          throw;
        }
        finally
        {
          if (cmd.Connection.State != System.Data.ConnectionState.Closed)
          {
            cmd.Connection.Close();
          }
        }
      }
      return banned;
    }

  }
}
