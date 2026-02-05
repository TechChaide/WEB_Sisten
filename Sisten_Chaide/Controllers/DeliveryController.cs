using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Sisten_Chaide.Models;
using Sisten_Chaide.Data;
using Sisten_Chaide.Attributes;

using Resources.Users;
using Resources.Shared;
using System.Globalization;
using Sisten_Chaide.Models.RestModels;

namespace Sisten_Chaide.Controllers
{
	[HtmlUsing]
	[Localization]
	[SessionControl(PermissionCode = "DELI0001,CEMO0001")]
	public class DeliveryController : Controller
	{

		const int PageSize = 10;

		static JavaScriptSerializer serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue , RecursionLimit = 150 };

		private UsersProvider p = new UsersProvider();
		private DeliveryProvider z = new DeliveryProvider();
        private ZoneProvider zp = new ZoneProvider();

		[SessionControl(PermissionCode = "DELI0001")]
		public ActionResult Index ()
		{
			return View();
		}

		[SessionControl(PermissionCode = "DELI0002")]
		public ActionResult GenerateDelivery ()
		{
			return View();
		}

		[SessionControl(PermissionCode = "CEMO0001")]
		public ActionResult Itinerary ()
		{
			return View();
		}

		[SessionControl(PermissionCode = "DELI0003")]
		public ActionResult EditDelivery ( string DeliveryId )
		{
			GenerateDelivery delivery = z.GetDeliveryInfo(DeliveryId);
			return View(delivery);
		}

		[HttpGet]
		public ActionResult GetOrderInfo ( long id )
		{
			var response = new Dictionary<string , object> { };
			GenerateDelivery r = z.GetOrder(id);
			response.Add("result" , r);
			return Json(response , JsonRequestBehavior.AllowGet);
		}

        [HttpGet]
        public ActionResult GetPedidoResiflex(string id)
        {
            var response = new Dictionary<string, object> { };
            GenerateDelivery r = z.GetOrderResiflex(id);
            response.Add("result", r);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetItemInfo ( long id )
		{
			var ItemProducts = z.Get(id);
			var result = ItemProducts.items.Select(x => new
			{
				x.ProductCode ,
				x.ProductName ,
				x.quantity ,
				x.OrderNumber ,
				x.Status,
				x.Dispatched,
                x.quantityD
			});
			return new ContentResult
			{
				Content = serializer.Serialize(new
				{
					aaData = result.ToList() ,
				}) ,
				ContentType = "application/json"
			};
		}

		[HttpGet]
		public ActionResult GetDriverByPoint ( string point )
		{
			var response = new Dictionary<string , object> { };
			Driver driver = z.GetDriverByPoint(point);
			response.Add("result" , driver);
			return Json(response , JsonRequestBehavior.AllowGet);
		}

        [HttpGet]
        public ActionResult GetZoneByPoint(string point)
        {
            var response = new Dictionary<string, object> { };
            Zone zone = z.GetZoneByPoint(point);
            response.Add("result", zone);
            return Json(response, JsonRequestBehavior.AllowGet);
        }


		[HttpGet]
		public ActionResult Horarios(string codMaterial)
		{
			var response = new Dictionary<string, object> { };
			HorariosXclase zone = z.Horarios(codMaterial);
			response.Add("result", zone);
			return Json(response, JsonRequestBehavior.AllowGet);
		}

		[HttpGet]
		public ContentResult GetGenerateDeliveries ( int iDisplayStart , int iDisplayLength , string sSearch , string initDate , string endDate , string zone_id )
	{

			var settings = new CollectionSettings { page_size = iDisplayLength , page_number = (iDisplayStart > 0 ? iDisplayStart / iDisplayLength : 0) + 1 , enabled = true , startDate = initDate , endDate = endDate , zoneId= (zone_id !="" ? Convert.ToInt16(zone_id) : 0)};
			var deliveries = z.GetDeliveries(ApplicationContext.LoggedUser , sSearch != "" ? sSearch : null , settings);
			var result = deliveries.items.Select(x => new
			{
				x.DeliverId ,
				x.Deliveries,
				x.OrderNumber ,
				x.DriverName ,
				x.StrDateDelivery ,
				x.ClientName ,
				x.ZoneName ,
				x.UserId,
				actions = "" ,
				logged_user_id = ApplicationContext.LoggedUser.id
			});
			return new ContentResult
			{
				Content = serializer.Serialize(new
				{
					aaData = result.ToList() ,
					iTotalRecords = settings.total_items ,
					iTotalDisplayRecords = settings.total_filtered_items
				}) ,
				ContentType = "application/json"
			};
		}

		public ActionResult AddDelivery ( GenerateDelivery DeliveryOrder )
		{
			try
			{
                int i = 0;
                //Cambio para ocultar el calendario para usuarios resiflex por una zona 
                if (DeliveryOrder.driver.zone.Id.ToString() != "70" || DeliveryOrder.driver.zone.Id.ToString() != "72")
                {
                    i = z.isExistDelivery(DeliveryOrder, ApplicationContext.LoggedUser.id);
                }
               
                if (i == 1) {
                    this.AddBusinessModelMessage(501, typeof(Users));
                    return View("GenerateDelivery",DeliveryOrder);
                }
                int aux = z.AddDelivery(DeliveryOrder , ApplicationContext.LoggedUser.id);
                if (aux == 0)
                {
                    //validación para usuarios resiflex evitar redireccion a menu de pedidos
                    if (ApplicationContext.LoggedUser.username.Contains("resiflex"))
                    {
                        this.AddBusinessModelMessage(0, typeof(Users));
                        return RedirectToAction("GenerateDelivery");
                    }
                    else
                    {
                        this.AddBusinessModelMessage(0, typeof(Users));
                        return RedirectToAction("Index");
                    }
                    
                }
                else
                {
                    this.AddBusinessModelMessage(503, typeof(Users));
                    return RedirectToAction("GenerateDelivery");
                }

			}
			catch (BusinessException bex)
			{
				this.AddBusinessModelMessage(bex.ExceptionCode , typeof(Users));
				return View("GenerateDelivery",DeliveryOrder);
			}
		}

		[SessionControl(PermissionCode = "DELI0004")]
		[HttpPost]
		public ActionResult DeleteDelivery ( int deliveryId )
		{
			try
			{
				z.DeleteZone(ApplicationContext.LoggedUser.id , deliveryId);
				this.AddBusinessModelMessage(0 , typeof(Users));
				return RedirectToAction("Index");
			}
			catch (BusinessException bex)
			{
				this.AddBusinessModelMessage(bex.ExceptionCode , typeof(Users));
				return RedirectToAction("Index");
			}
		}

		public ActionResult EditDeliverySchedule ( GenerateDelivery DeliveryOrder )
		{
			try
			{
				z.EditDelivery(DeliveryOrder , ApplicationContext.LoggedUser.id);
				this.AddBusinessModelMessage(0 , typeof(Users));
				return RedirectToAction("Index");
			}
			catch (BusinessException bex)
			{
				this.AddBusinessModelMessage(bex.ExceptionCode , typeof(Users));
				return View();
			}
		}

		[HttpGet]
		public ActionResult GetIteneraryDeliveries (long userId = 0, long zoneId = 0, long orderId = 0, long driverId = 0, string clientName = "", DateTime? fecha = (DateTime?)null)
		{
			var response = new Dictionary<string , object> { };
            //if (userId == 0) userId = ApplicationContext.LoggedUser.id;
            Collection<DeliverySchedule> deliveries = z.GetDeliveriesSchedule(userId, zoneId, orderId, driverId, clientName, fecha);
			response.Add("result" , deliveries);
            var jSonResult = Json(response, JsonRequestBehavior.AllowGet);
            jSonResult.MaxJsonLength = int.MaxValue;
            return jSonResult;
		}

        [HttpGet]
		public ActionResult GetDeliveryInfo ( string orderId )
		{
			var response = new Dictionary<string , object> { };
			GenerateDelivery delivery = z.GetDeliveryInfo(orderId);
			response.Add("result" , delivery);
			return Json(response , JsonRequestBehavior.AllowGet);
		}

		[HttpGet]
		public ActionResult GetDeliveryInfoDispatched ( string orderId )
		{
			var response = new Dictionary<string , object> { };
            zp.GetListZones();
			GenerateDelivery delivery = z.GetDeliveryInfoDispatched(orderId);
			response.Add("result" , delivery);
			return Json(response , JsonRequestBehavior.AllowGet);
		}

        [HttpGet]
        public ActionResult GetSearchOrders(string name)
        {
            var response = new Dictionary<string, object> { };
            List<Search> zones = z.GetSearchDelivery(name);
            response.Add("result", zones);
            return Json(response, JsonRequestBehavior.AllowGet);
        }


        ///// <summary>
        ///// Obtiene los datos de la compañía a resetear el password
        ///// </summary>
        ///// <param name="model"></param>
        ///// <returns></returns>
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> SearchCompaniesByRuc([Bind(Exclude = "Email")] RequestTemporalPassViewModel model)
        //{
        //    try
        //    {
        //        ModelState.Remove("Email");
        //        if (!ModelState.IsValid)
        //        {
        //            TempData["model"] = ModelState;
        //            ManagerLogger.LogWarning(string.Format("{0} {1} Datos inválidos", MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name));
        //            return RedirectToAction("Index");
        //        }
        //        var country = (CountryViewModel)Session["country"];
        //        var company = await PayphonizadorManagement.GetCompany(country.Id, model.CompanyCode);
        //        if (company == null)
        //        {
        //            TempData["Error"] = TranslationManagement.T("Company not registered");
        //            ManagerLogger.LogWarning(string.Format("{0} {1} Empresa no existe " + model.CompanyCode, MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name));
        //            return RedirectToAction("Index");
        //        }

        //        var ip = HttpContext != null ? HttpContext.Request.UserHostAddress : null; CompanyManagement.SaveCompanyStoreHistoryTask(company.CompanyId, Enums.CompanyStoreEvent.SearchedByPayphonizador, ip, 0, "", int.Parse(User.Identity.GetUserId()));
        //        TempData["temporalData"] = company;
        //        TempData["generate"] = true;
        //        return RedirectToAction("Index");
        //    }
        //    catch (EntityException e)
        //    {
        //        TempData["Error"] = errorService;
        //        ManagerLogger.LogError(String.Format("{0} {1} error al trabajar con la BD", MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name), e);
        //        return RedirectToAction("Index");
        //    }
        //    catch (Exception e)
        //    {
        //        TempData["Error"] = errorService;
        //        ManagerLogger.LogError(String.Format("{0} {1} error al cargar datos de empresa " + model.CompanyCode, MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name), e);
        //        return RedirectToAction("Index");
        //    }
        //}
    }
}