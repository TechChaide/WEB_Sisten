﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Sisten_Chaide.Models;
using Newtonsoft.Json;
using System.ComponentModel;
using System.Globalization;
using Sisten_Chaide.Models.RestModels;
using Sap.Data.Hana;

namespace Sisten_Chaide.Data
{
    public class DeliveryProvider
    {
        public DeliveryProvider(string cnstring) { }

        private SqlConnection _connection;
        private SqlConnection _connection1;
        public HanaConnection _conn;

        public DeliveryProvider()
        {
              _connection = new SqlConnection(ApplicationContext.DefaultConnection);
             // _connection1 = new SqlConnection(ApplicationContext.DefaultConnection1);
            _conn = new HanaConnection("Server=192.168.8.16:35015;UserID=SAPABAP1;Password=M4n4g3r18");
        }

        public GenerateDelivery GetOrder(long orderId)
        {
            GenerateDelivery delivery = new GenerateDelivery();

             //   HanaConnection _conn = new HanaConnection("Server=192.168.8.16:35015;UserID=SAPABAP1;Password=M4n4g3r18");
                _conn.Open();
                string x = "CALL  \"SAPABAP1\".\"ZSPConsultaCliente\" ('" + orderId + "');";
                HanaCommand cmd2 = new HanaCommand(x, _conn);
                HanaDataReader r = cmd2.ExecuteReader();

               try
                {
                   GenerateDelivery g;

                  while (r.Read())
                  {
                      g = new GenerateDelivery()
                      {
                          Deliveries = r["Entregas"].ToString(),
                          client = new Client()
                          {
                              //OrderNumber = r["Pedido"].ToString() ,
                              CodeClient = r["CodCliente"].ToString(),
                              ClientName = r["NombreCliente"].ToString(),
                              SellerName = r["Vendedor"].ToString(),
                              Province = r["Provincia"].ToString(),
                              City = r["Ciudad"].ToString(),
                              CodeBillDestination = r["CodDestFact"].ToString(),
                              Address = r["Direccion"].ToString(),
                              email = r["Mail"].ToString(),
                              ruc_ci = r["RUC_CI"].ToString(),
                              PhoneNumber = r["Telefono"].ToString(),
                              CellPhoneNumber = r["Celular"].ToString(),
                          },
                      };
                      delivery = g;
                 }
              r.Close();
              _conn.Close();
                /*
                g = new GenerateDelivery()
                {
                    Deliveries = "405060",
                    client = new Client()
                    {
                        CodeClient = "123",
                        ClientName = "123",
                        SellerName = "123",
                        Province = "123",
                        City = "123",
                        CodeBillDestination = "123",
                        Address = "123",
                        email = "123",
                        ruc_ci = "123",
                        PhoneNumber = "123",
                        CellPhoneNumber = "123"
                    }
                };*/
            }
                catch (Exception ex)
                {
                    _conn.Close();
                    if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                    throw;
                }
           

            return delivery;
        }

        public Collection<ItemProduct> Get(long orderId)
        {
            Models.Collection<ItemProduct> itemsProducts = new Models.Collection<ItemProduct>();


            //conexion hana 
            //    HanaConnection _conn = new HanaConnection("Server=192.168.8.16:35015;UserID=SAPABAP1;Password=M4n4g3r18");

            try
            {
                        _conn.Open();
                        string x = "CALL  \"SAPABAP1\".\"ZSPConsultaItemsd\" ('"+orderId+"');";
                        HanaCommand cmd2 = new HanaCommand(x, _conn);
                        HanaDataReader reader = cmd2.ExecuteReader();

                 

                            while (reader.Read())
                            {
                                string dd2 = reader["Cantidad"].ToString();
                                string[] arr = dd2.Split('.');
                                itemsProducts.items.Add(new ItemProduct()
                                {

                                    ProductCode = reader["CodProducto"].ToString(),
                                    ProductName = reader["Producto"].ToString(),
                                    quantity = Convert.ToInt32(arr[0]),
                                    Status = false,
                                    OrderNumber = reader["Pedido"].ToString(),
                                    Dispatched = false,
                                    quantityD = Convert.ToInt32(arr[0])
                                });
                            }
                        reader.Close();
                        _conn.Close();
                        }
                        catch (Exception ex)
                        {
                            _conn.Close();
                            if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters", JsonConvert.SerializeObject(new { }));
                            throw;
                        }

                        return itemsProducts;
                    
                }

                public Driver GetDriverByPoint(String points)
                {
                    Driver driver = new Driver();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.get_driver_by_point]";

                        //cmd.Parameters.AddWithValue("@user_id" , currentUser.id);
                        cmd.Parameters.AddWithValue("@zone_point", points);
                        try
                        {
                            Driver u;
                            cmd.Connection.Open();
                            SqlDataReader r = cmd.ExecuteReader();
                            while (r.Read())
                            {
                                u = new Driver()
                                {
                                    user = new User
                                    {
                                        Id = Convert.ToInt32(r["UserID"]),
                                        First_Name = r["first_name"].ToString(),
                                        Last_Name = r["last_name"].ToString(),
                                        isDriver = true,
                                    },
                                    zone = new Zone
                                    {
                                        Id = Convert.ToInt32(r["Zone_Id"]),
                                        name = r["Zone_name"].ToString(),
                                        Polygon = r["Polygon"].ToString(),
                                        hasUserAssing = true,
                                    },
                                };
                                driver = u;
                            }
                            if (r.NextResult())
                            {
                                List<driverSchedule> lcalendar = new List<driverSchedule>();
                                while (r.Read())
                                {
                                    driverSchedule d = new driverSchedule()
                                    {
                                        DeliveryId = Convert.ToInt32(r["DeliverId"]),
                                        ClienteName = (r["ClientName"]).ToString(),
                                        HourDelivery = Convert.ToDateTime(r["HourDelivery"]),
                                        StrDateDelivery = Convert.ToDateTime(r["HourDelivery"]).ToShortDateString(),
                                        StrTimeDelivery = Convert.ToDateTime(r["HourDelivery"]).ToShortTimeString(),
                                        StrTimeEndDelivery = Convert.ToDateTime(r["HourDelivery"]).AddMinutes(45).ToShortTimeString()
                                    };
                                    lcalendar.Add(d);
                                }
                                driver.Calendar = lcalendar;
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


                        return driver;
                    }
                }

                public Zone GetZoneByPoint(String points)
                {
                    Zone zone;
                    Zone zone1 = new Zone();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.get_zone_by_point]";

                        //cmd.Parameters.AddWithValue("@user_id" , currentUser.id);
                        cmd.Parameters.AddWithValue("@zone_point", points);
                        try
                        {
                            Zone z;
                            cmd.Connection.Open();
                            SqlDataReader r = cmd.ExecuteReader();
                            while (r.Read())
                            {

                                zone1 = new Zone()
                                {
                                    Id = Convert.ToInt32(r["Zone_Id"]),
                                    name = r["Zone_name"].ToString(),
                                    Polygon = r["Polygon"].ToString(),
                                    hasUserAssing = true
                                };
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
                        zone = zone1;

                        return zone;
                    }
                }

                public Collection<DeliverySchedule> GetDeliveries(SessionUser currentUser, object keyword, CollectionSettings settings)
                {
                    Models.Collection<DeliverySchedule> deliveries = new Models.Collection<DeliverySchedule>() { pagging_settings = settings };
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.delivery.get_deliveries]";

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
                            if (settings.zoneId != null)
                            {
                                cmd.Parameters.AddWithValue("@zoneId", settings.zoneId);
                            }
                            else cmd.Parameters.AddWithValue("@zoneId", DBNull.Value);
                            if (settings.startDate != null)
                            {
                                DateTime initD = DateTime.ParseExact(settings.startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                                DateTime endD = DateTime.ParseExact(settings.endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                                cmd.Parameters.AddWithValue("@startDate", initD);
                                cmd.Parameters.AddWithValue("@endDate", endD);
                            }
                            else
                            {
                                cmd.Parameters.AddWithValue("@startDate", DBNull.Value);
                                cmd.Parameters.AddWithValue("@endDate", DBNull.Value);
                            }

                        }

                        cmd.Parameters.Add(total);
                        cmd.Parameters.Add(total_filtered);

                        try
                        {
                            cmd.Connection.Open();
                            SqlDataReader reader = cmd.ExecuteReader();
                            while (reader.Read())
                            {
                                deliveries.items.Add(new DeliverySchedule()
                                {
                                    DeliverId = Convert.ToInt32(reader["DeliverId"]),
                                    Deliveries = reader["Deliveries"].ToString(),
                                    OrderNumber = reader["OrderNumber"].ToString(),
                                    DriverName = reader["DriverName"].ToString(),
                                    HourDelivery = Convert.ToDateTime(reader["HourDelivery"]),
                                    ClientName = reader["ClientName"].ToString(),
                                    StrDateDelivery = Convert.ToDateTime(reader["HourDelivery"]).ToShortDateString() + " " + Convert.ToDateTime(reader["HourDelivery"]).ToShortTimeString(),
                                    ZoneName = reader["ZoneName"].ToString(),
                                    UserId = Convert.ToInt32(reader["UserId"])
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

                        deliveries.pagging_settings.total_items = Convert.ToInt32(cmd.Parameters["@total"].Value);
                        deliveries.pagging_settings.total_filtered_items = Convert.ToInt64(cmd.Parameters["@total_filtered"].Value);

                        return deliveries;
                    }
                }

                public void AddDelivery(GenerateDelivery OrderDelivery, long userId)
                {
                    Collection<ItemProduct> listProducts = new Collection<ItemProduct>();
                    listProducts = Get(long.Parse(OrderDelivery.OrderNumber));
                    string[] status = OrderDelivery.StatusItem.Split(',');
                    for (int i = 0; i < status.Length; i++)
                    {
                        listProducts.items[i].Dispatched = Convert.ToBoolean(status[i]);
                    }
                    string[] statusQ = OrderDelivery.ItemDispatch.Split(',');
                    for (int i = 0; i < statusQ.Length; i++)
                    {
                        listProducts.items[i].quantityD = Convert.ToInt16(statusQ[i]);
                    }
                    OrderDelivery.dateDelivery = OrderDelivery.dateDelivery.Replace("/", "-");
                    DateTime date = DateTime.ParseExact(OrderDelivery.dateDelivery, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.delivery.add]";
                        cmd.Parameters.AddWithValue("@order_number", OrderDelivery.OrderNumber ?? "");
                        cmd.Parameters.AddWithValue("@code_id", OrderDelivery.client.CodeClient);
                        cmd.Parameters.AddWithValue("@client_name", OrderDelivery.client.ClientName ?? "");
                        cmd.Parameters.AddWithValue("@address", OrderDelivery.client.Address ?? "");
                        cmd.Parameters.AddWithValue("@phone_number", OrderDelivery.client.PhoneNumber ?? "");
                        cmd.Parameters.AddWithValue("@cell_phone_number", OrderDelivery.client.CellPhoneNumber ?? "");
                        cmd.Parameters.AddWithValue("@province", OrderDelivery.client.Province ?? "");
                        cmd.Parameters.AddWithValue("@city", OrderDelivery.client.City ?? "");
                        cmd.Parameters.AddWithValue("@latitude", Convert.ToDecimal(OrderDelivery.lat, CultureInfo.InvariantCulture));
                        cmd.Parameters.AddWithValue("@longitude", Convert.ToDecimal(OrderDelivery.lng, CultureInfo.InvariantCulture));
                        cmd.Parameters.AddWithValue("@status", 1);
                        if (OrderDelivery.driver.user.Id != -1)
                        {
                            cmd.Parameters.AddWithValue("@driver_id", OrderDelivery.driver.user.Id);
                        }
                        else cmd.Parameters.AddWithValue("@driver_id", DBNull.Value);
                        //cmd.Parameters.AddWithValue("@driver_id" , OrderDelivery.driver.user.Id);
                        cmd.Parameters.AddWithValue("@date_delivery", date.Date);
                        cmd.Parameters.AddWithValue("@hour_delivery", date);
                        cmd.Parameters.AddWithValue("@zone_id", OrderDelivery.driver.zone.Id);
                        cmd.Parameters.AddWithValue("@deliveries", OrderDelivery.Deliveries ?? "");
                        cmd.Parameters.AddWithValue("@reference_address", OrderDelivery.ReferenceAddress ?? "");
                        cmd.Parameters.AddWithValue("@email", OrderDelivery.client.email ?? "");
                        cmd.Parameters.AddWithValue("@seller_name", OrderDelivery.client.SellerName ?? "");
                        cmd.Parameters.AddWithValue("@user_id", userId);

                        DataTable items = new DataTable();

                        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(ItemProduct));
                        foreach (PropertyDescriptor prop in properties)
                            items.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                        foreach (ItemProduct item in listProducts.items)
                        {
                            DataRow row = items.NewRow();
                            foreach (PropertyDescriptor prop in properties)
                                row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                            items.Rows.Add(row);
                        }


                        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@list_items", SqlDbType = SqlDbType.Structured, Value = items });
                        //cmd.Parameters.Add(new SqlParameter() { ParameterName = "@MessageCode" , SqlDbType = System.Data.SqlDbType.Int , Value = 0 , Direction = System.Data.ParameterDirection.Output });

                        try
                        {
                            cmd.Connection.Open();
                            cmd.ExecuteNonQuery();
                            //int statusCode = Convert.ToInt32(cmd.Parameters["@MessageCode"].Value);
                            //if (statusCode > 0)
                            //{
                            //	throw new BusinessException(statusCode);
                            //}
                        }
                        catch (BusinessException bex) { throw bex; }
                        catch (Exception ex)
                        {
                            Logger.WriteError(ex.Message, ex);
                            //if (!ex.Data.Contains("ActionParameters")) ex.Data.Add("ActionParameters" , JsonConvert.SerializeObject(new { fuser.user , user.is_super }));
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

                public void EditDelivery(GenerateDelivery OrderDelivery, long userId)
                {
                    Collection<ItemProduct> listProducts = new Collection<ItemProduct>();
                    //listProducts = Get(Int32.Parse(OrderDelivery.OrderNumber));
                    listProducts.items = OrderDelivery.ListProducts;
                    GenerateDelivery b = new GenerateDelivery();
                    OrderDelivery.dateDelivery = OrderDelivery.dateDelivery.Replace("/", "-");
                    DateTime date = DateTime.ParseExact(OrderDelivery.dateDelivery, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.delivery.edit]";
                        cmd.Parameters.AddWithValue("@DeliveryId", OrderDelivery.DeliveryId);
                        cmd.Parameters.AddWithValue("@order_number", OrderDelivery.OrderNumber ?? "");
                        cmd.Parameters.AddWithValue("@client_name", OrderDelivery.client.ClientName ?? "");
                        cmd.Parameters.AddWithValue("@address", OrderDelivery.client.Address ?? "");
                        cmd.Parameters.AddWithValue("@phone_number", OrderDelivery.client.PhoneNumber ?? "");
                        cmd.Parameters.AddWithValue("@cell_phone_number", OrderDelivery.client.CellPhoneNumber ?? "");
                        cmd.Parameters.AddWithValue("@province", OrderDelivery.client.Province ?? "");
                        cmd.Parameters.AddWithValue("@city", OrderDelivery.client.City ?? "");
                        cmd.Parameters.AddWithValue("@latitude", Convert.ToDecimal(OrderDelivery.lat, CultureInfo.InvariantCulture));
                        cmd.Parameters.AddWithValue("@longitude", Convert.ToDecimal(OrderDelivery.lng, CultureInfo.InvariantCulture));
                        cmd.Parameters.AddWithValue("@status", 1);
                        cmd.Parameters.AddWithValue("@driver_id", OrderDelivery.driver.user.Id);
                        cmd.Parameters.AddWithValue("@date_delivery", date.Date);
                        cmd.Parameters.AddWithValue("@hour_delivery", date);
                        cmd.Parameters.AddWithValue("@zone_id", OrderDelivery.driver.zone.Id);
                        cmd.Parameters.AddWithValue("@deliveries", OrderDelivery.Deliveries ?? "");
                        cmd.Parameters.AddWithValue("@reference_address", OrderDelivery.ReferenceAddress ?? "");
                        cmd.Parameters.AddWithValue("@email", OrderDelivery.client.email ?? "");
                        cmd.Parameters.AddWithValue("@seller_name", OrderDelivery.client.SellerName ?? "");
                        cmd.Parameters.AddWithValue("@user_id", userId);

                        DataTable items = new DataTable();



                        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(ItemProduct));
                        foreach (PropertyDescriptor prop in properties)
                            items.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                        foreach (ItemProduct item in listProducts.items)
                        {
                            DataRow row = items.NewRow();
                            foreach (PropertyDescriptor prop in properties)
                                row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                            items.Rows.Add(row);
                        }



                        cmd.Parameters.Add(new SqlParameter() { ParameterName = "@list_items", SqlDbType = SqlDbType.Structured, Value = items });
                        try
                        {
                            cmd.Connection.Open();
                            cmd.ExecuteNonQuery();
                        }
                        catch (BusinessException bex) { throw bex; }
                        catch (Exception ex)
                        {
                            Logger.WriteError(ex.Message, ex);
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

                public void DeleteZone(long userId, long deliveryId)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.CommandText = "[web.delivery.delete]";
                        cmd.Parameters.AddWithValue("@delivery_id", deliveryId);

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

                public Collection<DeliverySchedule> GetDeliveriesSchedule(long userId = 0, long zoneId = 0, long orderId = 0, long driverId = 0, string clientName = "", DateTime? fecha = null)
                {
                    Collection<DeliverySchedule> deliveries = new Collection<DeliverySchedule>();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.itinerary.get_deliveries_1]";
                        //cmd.Parameters.AddWithValue("@user_id" , userId);
                        if (userId != 0)
                            cmd.Parameters.AddWithValue("@user_id", userId);
                        else cmd.Parameters.AddWithValue("@user_id", DBNull.Value);
                        if (zoneId != 0)
                            cmd.Parameters.AddWithValue("@zone_id", zoneId);
                        else cmd.Parameters.AddWithValue("@zone_id", DBNull.Value);
                        if (orderId != 0)
                            cmd.Parameters.AddWithValue("@order_id", orderId);
                        else cmd.Parameters.AddWithValue("@order_id", DBNull.Value);
                        if (driverId != 0)
                            cmd.Parameters.AddWithValue("@driver_id", driverId);
                        else cmd.Parameters.AddWithValue("@driver_id", DBNull.Value);
                        if (!string.IsNullOrEmpty(clientName))
                            cmd.Parameters.AddWithValue("@client", clientName);
                        else cmd.Parameters.AddWithValue("@client", DBNull.Value);
                        if (fecha != null)
                        {
                            cmd.Parameters.AddWithValue("@date_from", fecha);
                        }
                        else cmd.Parameters.AddWithValue("@date_from", DBNull.Value);
                        try
                        {
                            cmd.Connection.Open();
                            SqlDataReader reader = cmd.ExecuteReader();
                            while (reader.Read())
                            {
                                deliveries.items.Add(new DeliverySchedule()
                                {

                                    DeliverId = Convert.ToInt64(reader["DeliverId"]),
                                    HourDelivery = Convert.ToDateTime(reader["HourDelivery"]),
                                    ClientName = reader["ClientName"].ToString(),
                                    StrDateDelivery = Convert.ToDateTime(reader["HourDelivery"]).ToShortDateString() + " " + Convert.ToDateTime(reader["HourDelivery"]).ToShortTimeString(),
                                    DriverName = reader["DriverName"].ToString(),
                                    StrTimeEndDelivery = Convert.ToDateTime(reader["HourDelivery"]).AddMinutes(45).ToShortTimeString(),
                                    status = Convert.ToInt32(reader["StatusId"]),
                                    UserId = Convert.ToInt32(reader["UserId"]),
                                    //Address = reader["Address"].ToString(),
                                });
                            }
                        }
                        catch (Exception ex)
                        {
                            Logger.WriteError(ex.Message, ex);
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


                        return deliveries;
                    }
                }

                public GenerateDelivery GetDeliveryInfo(String orderId)
                {
                    GenerateDelivery delivery = new GenerateDelivery();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.itinerary.get_delivery_info]";

                        cmd.Parameters.AddWithValue("@delivery_id", orderId);
                        try
                        {
                            GenerateDelivery g;
                            cmd.Connection.Open();
                            SqlDataReader r = cmd.ExecuteReader();
                            while (r.Read())
                            {
                                g = new GenerateDelivery()
                                {
                                    OrderNumber = r["OrderNumber"].ToString(),
                                    DeliveryId = Convert.ToInt32(r["DeliveryId"]),
                                    lat = Convert.ToString(Convert.ToDecimal(r["Latitude"])),
                                    lng = Convert.ToString(Convert.ToDecimal(r["Longitude"])),
                                    dlat = Convert.ToDecimal(r["Latitude"]),
                                    dlng = Convert.ToDecimal(r["Longitude"]),
                                    status = Convert.ToInt32(r["StatusId"]),
                                    Observations = r["Observations"].ToString(),
                                    dateDelivery = Convert.ToDateTime(r["HourDelivery"]).ToShortDateString() + " " + Convert.ToDateTime(r["HourDelivery"]).ToShortTimeString(),
                                    Deliveries = r["Deliveries"].ToString(),
                                    ReferenceAddress = r["ReferenceAddress"].ToString(),
                                    client = new Client
                                    {
                                        ClientName = r["ClienteName"].ToString(),
                                        PhoneNumber = r["PhoneNumber"].ToString(),
                                        CellPhoneNumber = r["CellPhoneNumber"].ToString(),
                                        Province = r["Province"].ToString(),
                                        City = r["City"].ToString(),
                                        Address = r["Address"].ToString(),
                                        email = r["Email"].ToString(),
                                        SellerName = r["SellerName"].ToString()
                                    },
                                    driver = new Driver
                                    {
                                        user = new User
                                        {
                                            First_Name = r["first_name"].ToString(),
                                            Last_Name = r["last_name"].ToString(),
                                            Id = Convert.ToInt32(r["DriverId"]),
                                        },
                                        zone = new Zone
                                        {
                                            name = r["zone_name"].ToString(),
                                            Polygon = r["Polygon"].ToString(),
                                            Id = Convert.ToInt32(r["ZoneId"])
                                        }
                                    },
                                };
                                delivery = g;
                            }
                            if (r.NextResult())
                            {
                                List<ItemProduct> items = new List<ItemProduct>();
                                while (r.Read())
                                {
                                    ItemProduct item = new ItemProduct()
                                    {
                                        ProductCode = r["ProductCode"].ToString(),
                                        ProductName = r["ProductName"].ToString(),
                                        quantity = Convert.ToInt32(r["Quantity"]),
                                        ItemId = Convert.ToInt32(r["DetailId"]),
                                        Status = Convert.ToBoolean(r["Status"]),
                                        Dispatched = Convert.ToBoolean(r["Dispatched"]),
                                        quantityD = Convert.ToInt32(r["QuantityD"])
                                    };
                                    items.Add(item);
                                }
                                delivery.ListProducts = items;
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


                        return delivery;
                    }
                }

                public GenerateDelivery GetDeliveryInfoDispatched(String orderId)
                {
                    GenerateDelivery delivery = new GenerateDelivery();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.itinerary.get_delivery_info_dispatched]";

                        cmd.Parameters.AddWithValue("@delivery_id", orderId);
                        try
                        {
                            GenerateDelivery g;
                            cmd.Connection.Open();
                            SqlDataReader r = cmd.ExecuteReader();
                            while (r.Read())
                            {
                                g = new GenerateDelivery()
                                {
                                    OrderNumber = r["OrderNumber"].ToString(),
                                    DeliveryId = Convert.ToInt32(r["DeliveryId"]),
                                    lat = Convert.ToString(Convert.ToDecimal(r["Latitude"])),
                                    lng = Convert.ToString(Convert.ToDecimal(r["Longitude"])),
                                    dlat = Convert.ToDecimal(r["Latitude"]),
                                    dlng = Convert.ToDecimal(r["Longitude"]),
                                    deliverylat = r["LatitudeDelivery"].Equals(DBNull.Value) ? 0 : Convert.ToDecimal(r["LatitudeDelivery"]),
                                    deliverylng = r["LongitudeDelivery"].Equals(DBNull.Value) ? 0 : Convert.ToDecimal(r["LongitudeDelivery"]),
                                    status = Convert.ToInt32(r["StatusId"]),
                                    Observations = r["Observations"].ToString(),
                                    dateDelivery = Convert.ToDateTime(r["HourDelivery"]).ToShortDateString() + " " + Convert.ToDateTime(r["HourDelivery"]).ToShortTimeString(),
                                    Deliveries = r["Deliveries"].ToString(),
                                    ReferenceAddress = r["ReferenceAddress"].ToString(),
                                    StrDateHourDeliveryReception = r["DateHourDelivery"].Equals(DBNull.Value) ? ""
                      : Convert.ToDateTime(r["DateHourDelivery"]).ToShortDateString() + " " + Convert.ToDateTime(r["DateHourDelivery"]).ToShortTimeString(),
                                    ReceptorName = r["ReceptorName"].Equals(DBNull.Value) ? "" : r["ReceptorName"].ToString(),
                                    client = new Client
                                    {
                                        ClientName = r["ClienteName"].ToString(),
                                        PhoneNumber = r["PhoneNumber"].ToString(),
                                        CellPhoneNumber = r["CellPhoneNumber"].ToString(),
                                        Province = r["Province"].ToString(),
                                        City = r["City"].ToString(),
                                        Address = r["Address"].ToString(),
                                        email = r["Email"].ToString(),
                                        SellerName = r["SellerName"].ToString()
                                    },
                                    driver = new Driver
                                    {
                                        user = new User
                                        {
                                            First_Name = r["first_name"].ToString(),
                                            Last_Name = r["last_name"].ToString(),
                                        },
                                        zone = new Zone
                                        {
                                            name = r["zone_name"].ToString(),
                                            Polygon = r["Polygon"].ToString(),
                                        }
                                    },
                                };
                                delivery = g;
                            }
                            if (r.NextResult())
                            {
                                List<ItemProduct> items = new List<ItemProduct>();
                                while (r.Read())
                                {
                                    ItemProduct item = new ItemProduct()
                                    {
                                        ProductCode = r["ProductCode"].ToString(),
                                        ProductName = r["ProductName"].ToString(),
                                        quantity = Convert.ToInt32(r["Quantity"]),
                                        ItemId = Convert.ToInt32(r["DetailId"]),
                                        Status = Convert.ToBoolean(r["Status"]),
                                        Dispatched = Convert.ToBoolean(r["Dispatched"]),
                                    };
                                    items.Add(item);
                                }
                                delivery.ListProducts = items;
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


                        return delivery;
                    }
                }

                public int isExistDelivery(GenerateDelivery OrderDelivery, long userId)
                {
                    int statusCode = 0;
                    OrderDelivery.dateDelivery = OrderDelivery.dateDelivery.Replace("/", "-");
                    DateTime date = DateTime.ParseExact(OrderDelivery.dateDelivery, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[zvalidate_schedule]";
                        cmd.Parameters.AddWithValue("@ZonaId", OrderDelivery.driver.zone.Id);
                        cmd.Parameters.AddWithValue("@DateHourDelivery", date);
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

                public List<Search> GetSearchDelivery(string name)
                {
                    List<Search> orders = new List<Search>();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = _connection;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "[web.delivery_search]";
                        cmd.Parameters.AddWithValue("@order", name ?? "");
                        try
                        {
                            cmd.Connection.Open();
                            SqlDataReader r = cmd.ExecuteReader();
                            while (r.Read())
                            {
                                orders.Add(new Search()
                                {
                                    id = Convert.ToInt32(r["id"]),
                                    text = r["OrderNumber"].ToString(),
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
                        return orders;
                    }
                }
            }
        }
