using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Sisten_Chaide.Models;
using Newtonsoft.Json;
using Sisten_Chaide.Models;
using Sisten_Chaide.Models.RestModels;
using System.Globalization;

namespace Sisten_Chaide.Data
{
    public class ZoneProvider
    {
        public ZoneProvider(string cnstring) { }

        private SqlConnection _connection;

        public ZoneProvider()
        {
            _connection = new SqlConnection(ApplicationContext.DefaultConnection);
        }

        public Zone GetOne(long zoneId)
        {
            Zone zone = new Zone();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zone.get_oneBK]";
                cmd.Parameters.AddWithValue("@zone_id", zoneId);
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();

                    while (r.Read())
                    {
                        Zone z = new Zone();
                        {
                            z.Id = Convert.ToInt32(r["Id"]);
                            z.name = r["Name"].ToString();
                            z.Polygon = r["Polygon"].ToString();
                            z.PolygonGeo = r["PolygonGeo"].ToString();
                            z.CreationDate = Convert.ToDateTime(r["CreationDate"]);

                            /*z.calendarInitHour = Convert.ToDateTime(r["CalendarInitHour"]);
                              z.strCalendarInitHour = Convert.ToDateTime(r["CalendarInitHour"]).ToString("yyyy-MM-dd HH:mm:ss");
                              z.calendarEndHour = Convert.ToDateTime(r["CalendarEndHour"]);
                              z.srtCalendarEndHour = Convert.ToDateTime(r["CalendarEndHour"]).ToString("yyyy-MM-dd HH:mm:ss");
                              z.calendarFromLock = Convert.ToDateTime(r["CalendarFromLock"]);
                              z.strCalendarFromLock = Convert.ToDateTime(r["CalendarFromLock"]).ToString("yyyy-MM-dd");
                              z.calendarToLock = Convert.ToDateTime(r["CalendarToLock"]);
                              z.strCalendarToLock = Convert.ToDateTime(r["CalendarToLock"]).ToString("yyyy-MM-dd");
                              z.intervalValue = Convert.ToInt32(r["IntervalValue"]);
                              z.lockCalendar = Convert.ToBoolean(r["LockCalendar"]);*/

                        };
                        zone = z;
                    }


                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { zoneId }));
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

            return zone;
        }

        public void Add(Zone zone, long userID)
        {

            DateTime initHour = DateTime.ParseExact(zone.strCalendarInitHour, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime endHour = DateTime.ParseExact(zone.srtCalendarEndHour, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime lockInit = DateTime.Now, lockEnd = DateTime.Now;
            if ((!string.IsNullOrEmpty(zone.strCalendarFromLock)) || (!string.IsNullOrEmpty(zone.strCalendarToLock)))
            {
                lockInit = DateTime.ParseExact(zone.strCalendarFromLock, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                lockEnd = DateTime.ParseExact(zone.strCalendarToLock, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zone.add]";
                cmd.Parameters.AddWithValue("@name", zone.name ?? "");
                cmd.Parameters.AddWithValue("@polygon", zone.Polygon ?? "");
                cmd.Parameters.AddWithValue("@creationDate", DateTime.Today);
                cmd.Parameters.AddWithValue("@userIdCreator", zone.UserIdCreation);
                cmd.Parameters.AddWithValue("@polygonGeo", zone.PolygonGeo ?? "");
            /*    cmd.Parameters.AddWithValue("@calendarInitHour", initHour);
                cmd.Parameters.AddWithValue("@calendarEndHour", endHour);
                cmd.Parameters.AddWithValue("@calendarFromLock", lockInit.Date);
                cmd.Parameters.AddWithValue("@calendarToLock", lockEnd.Date);
                cmd.Parameters.AddWithValue("@intervalValue", zone.intervalValue);
                cmd.Parameters.AddWithValue("@lockCalendar", zone.lockCalendar);*/
                try
                {
                    cmd.Connection.Open();
                    cmd.ExecuteNonQuery();

                }
                catch (Exception ex)
                {
                    Logger.WriteError("Error", ex);
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { userID }));
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

        public void Update(Zone zone, long userID)
        {
            //OrderDelivery.dateDelivery = OrderDelivery.dateDelivery.Replace("/", "-");
            DateTime initHour = DateTime.ParseExact(zone.strCalendarInitHour, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime endHour = DateTime.ParseExact(zone.srtCalendarEndHour, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime lockInit = DateTime.Now, lockEnd = DateTime.Now;
            if ((!string.IsNullOrEmpty(zone.strCalendarFromLock)) || (!string.IsNullOrEmpty(zone.strCalendarToLock)))
            {
                lockInit = DateTime.ParseExact(zone.strCalendarFromLock, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                lockEnd = DateTime.ParseExact(zone.strCalendarToLock, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zone.update]";
                cmd.Parameters.AddWithValue("@id", zone.Id);
                cmd.Parameters.AddWithValue("@name", zone.name ?? "");
                cmd.Parameters.AddWithValue("@polygon", zone.Polygon ?? "");
                cmd.Parameters.AddWithValue("@ModificationDate", DateTimeOffset.Now);
                cmd.Parameters.AddWithValue("@userIdModify", userID);
                cmd.Parameters.AddWithValue("@polygonGeo", zone.PolygonGeo ?? "");
               /* cmd.Parameters.AddWithValue("@calendarInitHour", initHour);
                cmd.Parameters.AddWithValue("@calendarEndHour", endHour);
                cmd.Parameters.AddWithValue("@calendarFromLock", lockInit.Date);
                cmd.Parameters.AddWithValue("@calendarToLock", lockEnd.Date);
                cmd.Parameters.AddWithValue("@intervalValue", zone.intervalValue);
                cmd.Parameters.AddWithValue("@lockCalendar", zone.lockCalendar);*/
                try
                {
                    cmd.Connection.Open();
                    cmd.ExecuteNonQuery();
                }
                catch (BusinessException bex) { throw bex; }
                catch (Exception ex)
                {
                    Logger.WriteError(ex.Message, ex);
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { userID }));
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

        public Models.Collection<Zone> Get(SessionUser currentUser, object keyword, CollectionSettings settings)
        {
            Models.Collection<Zone> zones = new Models.Collection<Zone>() { pagging_settings = settings };
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zones.get_all]";

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
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        zones.items.Add(new Zone()
                        {
                            Id = Convert.ToInt32(r["Id"]),
                            name = r["Name"].ToString(),
                            Polygon = r["Polygon"].ToString(),
                            CreationDate = Convert.ToDateTime(r["CreationDate"]),
                            CreationDateStr = Convert.ToDateTime(r["CreationDate"]).ToShortDateString().ToString()
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

                zones.pagging_settings.total_items = Convert.ToInt32(cmd.Parameters["@total"].Value);
                zones.pagging_settings.total_filtered_items = Convert.ToInt64(cmd.Parameters["@total_filtered"].Value);

                return zones;
            }



        }

        public Models.Collection<Zone> GetListZones()
        {
            Models.Collection<Zone> zones = new Models.Collection<Zone>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zones.get_list]";
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        zones.items.Add(new Zone()
                        {
                            Id = Convert.ToInt32(r["Id"]),
                            name = r["Name"].ToString(),
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
                return zones;
            }
        }

        public List<Search> GetSearchZone(string name)
        {
            //Models.Collection<Zone> zones = new Models.Collection<Zone>();
            List<Search> zones = new List<Search>();
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[web.zones.search]";
                cmd.Parameters.AddWithValue("@zone_name", name ?? "");
                try
                {
                    cmd.Connection.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        zones.Add(new Search()
                        {
                            id = Convert.ToInt32(r["Id"]),
                            text = r["Name"].ToString(),
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
                return zones;
            }
        }

        public void DeleteZone(long userId, long zone_id)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "[web.zone_delete]";
                cmd.Parameters.AddWithValue("@Zone_id", zone_id);

                try
                {
                    cmd.Connection.Open();
                    cmd.ExecuteNonQuery();
                }
                catch (BusinessException bex) { throw bex; }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { userId }));
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

        public Models.Collection<User> GetDrivers(SessionUser currentUser, object keyword, CollectionSettings settings)
        {
            Models.Collection<User> users = new Models.Collection<User>() { pagging_settings = settings };
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = _connection;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "[admin.zone.get_drivers]";

                cmd.Parameters.AddWithValue("@user_id", currentUser.id);
                cmd.Parameters.AddWithValue("@keyword", keyword ?? DBNull.Value);

                SqlParameter total_filtered = new SqlParameter("@total_filtered", SqlDbType.BigInt);
                total_filtered.Direction = ParameterDirection.InputOutput;
                total_filtered.Value = 0;

                SqlParameter total = new SqlParameter("@total", SqlDbType.BigInt);
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
                        users.items.Add(new User()
                        {
                            Id = Convert.ToInt16(reader["id"]),
                            Enabled = Convert.ToBoolean(reader["enabled"]),
                            First_Name = reader["first_name"].ToString(),
                            Last_Name = reader["last_name"].ToString(),
                            User_Name = reader["username"].ToString(),
                        });
                    }
                }
                catch (Exception ex)
                {
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { currentUser.id, keyword }));
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


    }
}

