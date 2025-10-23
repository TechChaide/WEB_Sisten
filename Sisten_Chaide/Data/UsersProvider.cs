using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sisten_Chaide.Models;
using Newtonsoft.Json;
using Sisten_Chaide.Models.RestModels;
using System.ComponentModel;

namespace Sisten_Chaide.Data
{
  public class UsersProvider
	{
		public UsersProvider (string cnstring) { }

		private SqlConnection _connection;

		public UsersProvider ()
		{
			_connection = new SqlConnection(ApplicationContext.DefaultConnection);
		}
		//public void UpdateLoginCredentials(User u)
		//{
		//  using (SqlCommand cmd = new SqlCommand())
		//  {
		//    cmd.Connection = Connection;
		//    cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//    cmd.CommandText = "[admin.users.update_password]";
		//    cmd.Parameters.AddWithValue("@UserId", u.id);
		//    cmd.Parameters.AddWithValue("@password", u.password);
		//    cmd.Parameters.AddWithValue("@secret_question_id", u.question_id);
		//    cmd.Parameters.AddWithValue("@secret_answer", u.secret_answer ?? "");
		//    try
		//    {
		//      cmd.Connection.Open();
		//      cmd.ExecuteNonQuery();
		//    }
		//    catch (Exception ex)
		//    {
		//      if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { u.id, u.password, u.question_id, u.secret_answer }));
		//      throw;
		//    }
		//    finally
		//    {
		//      if (cmd.Connection.State != System.Data.ConnectionState.Closed)
		//      {
		//        cmd.Connection.Close();
		//      }
		//    }
		//  }
		//}

		public Models.Collection<User> Get (SessionUser currentUser , object keyword , CollectionSettings settings)
		{
			Models.Collection<User> users = new Models.Collection<User>() { pagging_settings = settings };
			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.get]";

				cmd.Parameters.AddWithValue("@user_id" , currentUser.id);
				cmd.Parameters.AddWithValue("@keyword" , keyword ?? DBNull.Value);

				SqlParameter total_filtered = new SqlParameter("@total_filtered" , SqlDbType.BigInt);
				total_filtered.Direction = ParameterDirection.InputOutput;
				total_filtered.Value = 0;

				SqlParameter total = new SqlParameter("@total" , SqlDbType.BigInt);
				total.Direction = ParameterDirection.InputOutput;
				total.Value = 0;

				if (settings.enabled)
				{
					cmd.Parameters.AddWithValue("@page" , settings.page_number - 1);
					cmd.Parameters.AddWithValue("@page_size" , settings.page_size);
				}

				cmd.Parameters.Add(total);
				cmd.Parameters.Add(total_filtered);

				try
				{
					cmd.Connection.Open();
					SqlDataReader reader = cmd.ExecuteReader();
					while (reader.Read())
					{
						users.items.Add(new User()
						{
							Id = Convert.ToInt16(reader["id"]) ,
							Enabled = Convert.ToBoolean(reader["enabled"]) ,
							First_Name = reader["first_name"].ToString() ,
							Last_Name = reader["last_name"].ToString() ,
							User_Name = reader["username"].ToString() ,
							isDriver = Convert.ToBoolean(reader["isDriver"]) ,
						});
					}
				}
				catch (Exception ex)
				{
					if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { currentUser.id , keyword }));
					throw;
				}
				finally
				{
					if (cmd.Connection.State != System.Data.ConnectionState.Closed)
					{
						cmd.Connection.Close();
					}
				}

				users.pagging_settings.total_items = Convert.ToInt32(cmd.Parameters["@total"].Value);
				users.pagging_settings.total_filtered_items = Convert.ToInt64(cmd.Parameters["@total_filtered"].Value);

				return users;
			}
		}

		public FormUser GetOne (SessionUser user , long userID)
		{
			FormUser cUser = new FormUser() { is_new = userID == -1 };

			cUser.user_IdSession = user.id;

			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.get_one]";
				cmd.Parameters.AddWithValue("@user_id" , userID);
				cmd.Parameters.AddWithValue("@admin_user_id" , user.id);

				try
				{
					cmd.Connection.Open();
					SqlDataReader r = cmd.ExecuteReader();

					while (r.Read())
					{
						User u = new User()
						{
							Id = Convert.ToInt32(r["id"]) ,
							Enabled = Convert.ToBoolean(r["enabled"]) ,
							First_Name = r["first_name"].ToString() ,
							Last_Name = r["last_name"].ToString() ,
							User_Name = r["username"].ToString() ,
							password = r["password"].ToString() ,
						};
						cUser.user = u;
					}

					if (r.NextResult())
					{
						List<Profile> lprofile = new List<Profile>();
						while (r.Read())
						{
							Profile p = new Profile()
							{
								Id = Convert.ToInt32(r["id"]) ,
								Enabled = Convert.ToBoolean(r["enabled"]) ,
								Name = r["name"].ToString() ,
								active = Convert.ToBoolean(r["active"]) ,
							};
							lprofile.Add(p);
						}
						cUser.user.list_profile = lprofile;
						cUser.list_perfils = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = Int32.MaxValue }.Serialize(lprofile);
					}
				}
				catch (Exception ex)
				{
					if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { userID , user.id }));
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

			return cUser;
		}

		public void Add (SessionUser user , FormUser fuser)
		{
			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.add]";
				cmd.Parameters.AddWithValue("@enabled" , fuser.user.Enabled);
				cmd.Parameters.AddWithValue("@first_name" , fuser.user.First_Name);
				cmd.Parameters.AddWithValue("@last_name" , fuser.user.Last_Name);
				cmd.Parameters.AddWithValue("@username" , fuser.user.User_Name);
				cmd.Parameters.AddWithValue("@password" , fuser.user.password);

				DataTable profiles = new System.Data.DataTable();
				profiles.Columns.AddRange(new System.Data.DataColumn[]{
                new DataColumn("profile_id", typeof(int))					
                });

				int[] profile = (from p in fuser.user.list_profile
								 where p.active == true
								 select p.Id).ToArray();

				foreach (long pf in profile)
				{
					profiles.Rows.Add(pf);
				}


				cmd.Parameters.Add(new SqlParameter() { ParameterName = "@profiles" , SqlDbType = SqlDbType.Structured , Value = profiles });
				cmd.Parameters.Add(new SqlParameter() { ParameterName = "@MessageCode" , SqlDbType = System.Data.SqlDbType.Int , Value = 0 , Direction = System.Data.ParameterDirection.Output });

				try
				{
					cmd.Connection.Open();
					cmd.ExecuteNonQuery();
					int statusCode = Convert.ToInt32(cmd.Parameters["@MessageCode"].Value);
					if (statusCode > 0)
					{
						throw new BusinessException(statusCode);
					}
				}
				catch (BusinessException bex) { throw bex; }
				catch (Exception ex)
				{
					if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { fuser.user , user.is_super }));
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

		public void Update (SessionUser user , FormUser fuser)
		{
			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.update]";
				cmd.Parameters.AddWithValue("@enabled" , fuser.user.Enabled);
				cmd.Parameters.AddWithValue("@first_name" , fuser.user.First_Name);
				cmd.Parameters.AddWithValue("@last_name" , fuser.user.Last_Name);
				cmd.Parameters.AddWithValue("@username" , fuser.user.User_Name);
				cmd.Parameters.AddWithValue("@password" , fuser.user.password);
				cmd.Parameters.AddWithValue("@id" , fuser.user.Id);

				DataTable profiles = new DataTable();
				profiles.Columns.AddRange(new DataColumn[]{
                    new DataColumn("profile_id", typeof(int))					
        });

				int[] profile = (from p in fuser.user.list_profile
								 where p.active == true
								 select p.Id).ToArray();

				foreach (long pf in profile)
				{
					profiles.Rows.Add(pf);
				}

				cmd.Parameters.Add(new SqlParameter() { ParameterName = "@profiles" , SqlDbType = SqlDbType.Structured , Value = profiles });

				try
				{
					cmd.Connection.Open();
					cmd.ExecuteNonQuery();
				}
				catch (BusinessException bex) { throw bex; }
				catch (Exception ex)
				{
					if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { fuser.user }));
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
		}

		//public void Delete(SessionUser user, long user_id)
		//{
		//  using (SqlCommand cmd = new SqlCommand())
		//  {
		//    cmd.Connection = Connection;
		//    cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//    cmd.CommandText = "[admin.users.delete]";
		//    cmd.Parameters.AddWithValue("@user_id", user_id);

		//    try
		//    {
		//      cmd.Connection.Open();
		//      cmd.ExecuteNonQuery();
		//    }
		//    catch (BusinessException bex) { throw bex; }
		//    catch (Exception ex)
		//    {
		//      if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { user_id }));
		//      throw;
		//    }
		//    finally
		//    {
		//      if (cmd.Connection.State != System.Data.ConnectionState.Closed)
		//      {
		//        cmd.Connection.Close();
		//      }
		//    }
		//  }

		//}

		//public User UpdatePassword(string email, string password, string username)
		//{
		//  User user = new User();

		//  using (SqlCommand cmd = new SqlCommand())
		//  {
		//    cmd.Connection = Connection;
		//    cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//    cmd.CommandText = "[admin.users.reset_password]";
		//    cmd.Parameters.AddWithValue("@email", email);
		//    cmd.Parameters.AddWithValue("@password", Encrypt(password));
		//    cmd.Parameters.AddWithValue("@username", username);
		//    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@return", SqlDbType = System.Data.SqlDbType.Int, Direction = System.Data.ParameterDirection.Output });

		//    try
		//    {
		//      cmd.Connection.Open();
		//      SqlDataReader r = cmd.ExecuteReader();

		//      while (r.Read())
		//      {
		//        User u = new User()
		//        {
		//          id = Convert.ToInt32(r["id"]),
		//          entry_time = Convert.ToDateTime(r["entry_time"]),
		//          update_time = Convert.ToDateTime(r["update_time"]),
		//          enabled = Convert.ToBoolean(r["enabled"]),
		//          first_name = r["first_name"].ToString(),
		//          last_name = r["last_name"].ToString(),
		//          username = r["username"].ToString(),
		//          password = r["password"].ToString(),
		//          email = r["email"].ToString(),
		//          business = Convert.ToInt32(r["business"]),
		//          area = r["area"].ToString(),
		//          phone_number = r["phone_number"].ToString(),
		//        };
		//        user = u;
		//      }
		//    }
		//    catch (Exception ex)
		//    {
		//      if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { email, password, username }));
		//      throw;
		//    }
		//    finally
		//    {
		//      if (cmd.Connection.State != System.Data.ConnectionState.Closed)
		//      {
		//        cmd.Connection.Close();
		//      }
		//    }
		//  }
		//  return user;
		//}

		//public int UpdatePasswordbyUser(long user_id, string password)
		//{
		//  int returnCode = 0;
		//  using (SqlCommand cmd = new SqlCommand())
		//  {
		//    cmd.Connection = Connection;
		//    cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//    cmd.CommandText = "[admin.users.reset_password_by_user]";
		//    cmd.Parameters.AddWithValue("@user_id", user_id);
		//    cmd.Parameters.AddWithValue("@password", Encrypt(password));
		//    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@return", SqlDbType = System.Data.SqlDbType.Int, Direction = System.Data.ParameterDirection.Output });

		//    try
		//    {
		//      cmd.Connection.Open();
		//      cmd.ExecuteNonQuery();
		//      returnCode = (int)cmd.Parameters["@return"].Value;
		//    }
		//    catch (Exception ex)
		//    {
		//      if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { user_id, password }));
		//      throw;
		//    }
		//    finally
		//    {
		//      if (cmd.Connection.State != System.Data.ConnectionState.Closed)
		//      {
		//        cmd.Connection.Close();
		//      }
		//    }
		//  }
		//  return returnCode;
		//}

		//public int ValidateEmailbyUsername(string username)
		//{
		//  int returnCode = 0;

		//  using (SqlCommand cmd = new SqlCommand())
		//  {
		//    cmd.Connection = Connection;
		//    cmd.CommandType = System.Data.CommandType.StoredProcedure;
		//    cmd.CommandText = "[admin.users.get_email_by_username]";
		//    cmd.Parameters.AddWithValue("@username", username);
		//    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@return", SqlDbType = System.Data.SqlDbType.Int, Direction = System.Data.ParameterDirection.Output });

		//    try
		//    {
		//      cmd.Connection.Open();
		//      cmd.ExecuteNonQuery();
		//      returnCode = (int)cmd.Parameters["@return"].Value;
		//    }
		//    catch (Exception ex)
		//    {
		//      if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { username }));
		//      throw;
		//    }
		//    finally
		//    {
		//      if (cmd.Connection.State != System.Data.ConnectionState.Closed)
		//      {
		//        cmd.Connection.Close();
		//      }
		//    }
		//  }
		//  return returnCode;
		//}
		public FormUser GetAvailableZonesByUser (SessionUser user , long userID)
		{
			FormUser cUser = new FormUser() { is_new = userID == -1 };

			cUser.user_IdSession = user.id;

			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.get_zones_by_user1]";
				cmd.Parameters.AddWithValue("@user_id" , userID);
				cmd.Parameters.AddWithValue("@admin_user_id" , user.id);

				try
				{
					cmd.Connection.Open();
					SqlDataReader r = cmd.ExecuteReader();

					while (r.Read())
					{
						User u = new User()
						{
							Id = Convert.ToInt32(r["id"]) ,
							Enabled = Convert.ToBoolean(r["enabled"]) ,
							First_Name = r["first_name"].ToString() ,
							Last_Name = r["last_name"].ToString() ,
							User_Name = r["username"].ToString() ,
						};
						cUser.user = u;
					}

					if (r.NextResult())
					{
						List<Zone> lzone = new List<Zone>();
						while (r.Read())
						{
							Zone p = new Zone()
							{
								Id = Convert.ToInt32(r["Id"]) ,
								name = r["Name"].ToString() ,
								active = Convert.ToBoolean(r["active"]) ,
								Enabled = Convert.ToBoolean(r["Enabled"]) ,
								hasUserAssing = Convert.ToBoolean(r["isActiveUser"]) ,
                                UserAssing = Convert.ToBoolean(r["assingUser"]),
                                DriverHasDeliveries = Convert.ToBoolean(r["pending_deli"])
                            };
							if (p.Enabled == true || p.active == true)
							{
								lzone.Add(p);
							}
							else
								continue;

						}
						cUser.user.list_zone = lzone;
						cUser.list_zones = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = Int32.MaxValue }.Serialize(lzone);
					}

				}
				catch (Exception ex)
				{
					if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { userID , user.id }));
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

			return cUser;
		}

		public int isNewOrUpdate (int UserId)
		{
			int statusCode = 0;
			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.Connection = _connection;
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.CommandText = "[admin.users.assign_zone_is_new]";
				cmd.Parameters.AddWithValue("@user_id" , UserId);

				try
				{
					cmd.Connection.Open();
					cmd.ExecuteNonQuery();
					SqlDataReader r = cmd.ExecuteReader();
					while (r.Read())
					{
						{
							statusCode = Convert.ToInt32(r["RESULT"]);
						}
					}


				}
				catch (BusinessException bex) { throw bex; }
				catch (Exception ex)
				{

				}
				finally
				{
					if (cmd.Connection.State != ConnectionState.Closed)
					{
						cmd.Connection.Close();
					}
				}
			}
			return statusCode;
		}

		public void AddUpdateZoneByUser (SessionUser user , FormUser fuser)
		{
			using (SqlCommand cmd = new SqlCommand())
			{
				if (user.id != -1)
				{
					cmd.Connection = _connection;
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandText = "[web.user_zone.update1]";
					cmd.Parameters.AddWithValue("@User_id", fuser.user.Id);
					cmd.Parameters.AddWithValue("@User_id_modify", ApplicationContext.LoggedUser.id);
					cmd.Parameters.AddWithValue("@ModificationDate", DateTime.Now.Date);

					DataTable zones = new DataTable();
					zones.Columns.AddRange(new DataColumn[] {new DataColumn("zone_id", typeof (int))});

					int[] zone = (from p in fuser.user.list_zone
						where p.UserAssing == true
						select p.Id).ToArray();


                    DataTable items = new DataTable();
                    items.Columns.Add("u_id", typeof(int));
                    items.Columns.Add("z_id", typeof(int));


                    for (int i = 0; i < zone.Length; i++)
                    {
                        DataRow Row1 = items.NewRow();
                        Row1["u_id"] = fuser.user.Id;
                        Row1["z_id"] = zone[i];
                        items.Rows.Add(Row1);
                    }
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@user_zones_add", SqlDbType = SqlDbType.Structured, Value = items });
					try
					{
						cmd.Connection.Open();
						cmd.ExecuteNonQuery();
					}
					catch (BusinessException bex)
					{
						throw bex;
					}
					catch (SqlException ex) 
					{
						if (!ex.Data.Contains("ActionParameters"))
							ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new {fuser.user}));
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
			}
		}

        public List<Search> GetSearchUser(string name)
        {
            List<Search> users = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.user.search]";
                cmd.Parameters.AddWithValue("@user_name", name ?? "");
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        users.Add(new Search()
                        {
                            id = Convert.ToInt32(r["id"]),
                            text = r["name"].ToString(),
                        });
                    }


                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
                finally
                {
                    if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                    {
                        cmd.Connection.Close();
                    }
                }
                return users;
            }
        }

        public List<Search> GetSearchClient(string name)
        {
            List<Search> clients = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.client.search]";
                cmd.Parameters.AddWithValue("@client_name", name ?? "");
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        clients.Add(new Search()
                        {
                            id = Convert.ToInt32(r["id"]),
                            text = r["name"].ToString(),
                        });
                    }


                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
                finally
                {
                    if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                    {
                        cmd.Connection.Close();
                    }
                }
                return clients;
            }
        }

        public List<Search> GetSearchClientCode(string name)
        {
            List<Search> clients = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.client_code_search]";
                cmd.Parameters.AddWithValue("@client_code", name ?? "");
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        clients.Add(new Search()
                        {
                            id = Convert.ToInt32(r["id"]),
                            text = r["code"].ToString(),
                        });
                    }


                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
                finally
                {
                    if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                    {
                        cmd.Connection.Close();
                    }
                }
                return clients;
            }
        }

        public List<Search> GetSearchDriver(string name)
        {
            List<Search> drivers = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.driver_search]";
                cmd.Parameters.AddWithValue("@driver_name", name ?? "");
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        drivers.Add(new Search()
                        {
                            id = Convert.ToInt32(r["id"]),
                            text = r["name"].ToString(),
                        });
                    }


                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
                finally
                {
                    if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                    {
                        cmd.Connection.Close();
                    }
                }
                return drivers;
            }
        }

        public List<Search> GetDrivers(int zoneId)
        {
            List<Search> drivers = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.get_drivers]";
                cmd.Parameters.AddWithValue("@zone_id", zoneId);
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        drivers.Add(new Search()
                        {
                            id = Convert.ToInt32(r["id"]),
                            text = r["name"].ToString(),
                        });
                    }

                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
                finally
                {
                    if (cmd.Connection.State != System.Data.ConnectionState.Closed)
                    {
                        cmd.Connection.Close();
                    }
                }
                return drivers;
            }
        }
    }
}
