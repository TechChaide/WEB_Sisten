using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Sisten_Chaide.Models;
using Sisten_Chaide.Data;
using Sisten_Chaide.Attributes;
using Resources.Users;
using Resources.Zones;
using Sisten_Chaide.Models.RestModels;

namespace Sisten_Chaide.Controllers
{
    [HtmlUsing]
    [Localization]
    [SessionControl(PermissionCode = "ZONE0006")]
    public class ZonesController : Controller
    {
        const int PageSize = 10;
        private static JavaScriptSerializer serializer = new JavaScriptSerializer
        {
            MaxJsonLength = Int32.MaxValue,
            RecursionLimit = 150
        };
        private ZoneProvider z = new ZoneProvider();
        private UsersProvider p = new UsersProvider();

        // GET: Zones
        [SessionControl(PermissionCode = "ZONE0006")]
        public ActionResult Index()
        {
            return View();
        }

        private void PrepareForm(out FormUser c, long userID)
        {
            c = p.GetAvailableZonesByUser(ApplicationContext.LoggedUser, userID);

            c.enabled = new SelectListItem[]
            {
                new SelectListItem(){ Text = Users.Active, Value = "True" },
                new SelectListItem(){ Text = Users.Inactive, Value = "False" },
            };
        }

        [HttpGet]
        [Compress]
        public ContentResult GetZones(int iDisplayStart, int iDisplayLength, string sSearch)
        {
            var settings = new CollectionSettings { page_size = iDisplayLength, page_number = (iDisplayStart > 0 ? iDisplayStart / iDisplayLength : 0) + 1, enabled = true };
            var zones = z.Get(ApplicationContext.LoggedUser, sSearch != "" ? sSearch : null, settings);
            var result = zones.items.Select(x => new
            {
                x.Id,
                x.name,
                x.CreationDate,
                x.CreationDateStr,
                actions = "",
                logged_user_id = ApplicationContext.LoggedUser.id
            });
            return new ContentResult
            {
                Content = serializer.Serialize(new
                {
                    aaData = result.ToList(),
                    iTotalRecords = settings.total_items,
                    iTotalDisplayRecords = settings.total_filtered_items
                }),
                ContentType = "application/json"
            };
        }


        [SessionControl(PermissionCode = "ZONE0002")]
        public ActionResult NewZone()
        {
            return RedirectToAction("EditZone", "Zones", new { zoneId = "0" });
        }

        public ActionResult addZone(Zone zone)
        {
            try
            {
                if (zone.CreationDate.Year != 1)
                    z.Update(zone, ApplicationContext.LoggedUser.id);
                else
                    z.Add(zone, ApplicationContext.LoggedUser.id);

                this.AddBusinessModelMessage(0, typeof(Users));
                return RedirectToAction("Index");
            }
            catch (BusinessException bex)
            {
                this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Users));
                return View("EditZone", zone);
            }
        }

        [SessionControl(PermissionCode = "ZONE0001,ZONE0002")]
        public ActionResult EditZone(int zoneId)
        {
            if (zoneId != 0)
            {
                ViewBag.id = zoneId;
                ViewBag.PageTitle = Users.ZoneInformation;
                Zone zone = z.GetOne(zoneId);
                return View(zone);
            }
            ViewBag.id = "0";
            ViewBag.PageTitle = Users.ZoneInformation;
            ViewBag.UserId = ApplicationContext.LoggedUser.id;
            return View("EditZone");
        }
        [SessionControl(PermissionCode = "ZONE0003")]
        [HttpPost]
        public ActionResult DeleteZone(int zoneId)
        {
            try
            {
                z.DeleteZone(ApplicationContext.LoggedUser.id, zoneId);
                this.AddBusinessModelMessage(0, typeof(Zones));
                return RedirectToAction("Index");
            }
            catch (BusinessException bex)
            {
                this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Users));
                return RedirectToAction("Index");
            }
        }

        [SessionControl(PermissionCode = "ZONE0005")]
        public ActionResult AssingIndex()
        {
            return View(new Dictionary<string, object> { });
        }

        [HttpGet]
        [Compress]
        public ContentResult GetDrivers(int iDisplayStart, int iDisplayLength, string sSearch)
        {
            var settings = new CollectionSettings { page_size = iDisplayLength, page_number = (iDisplayStart > 0 ? iDisplayStart / iDisplayLength : 0) + 1, enabled = true };
            var users = z.GetDrivers(ApplicationContext.LoggedUser, sSearch != "" ? sSearch : null, settings);
            var result = users.items.Select(x => new
            {
                x.Id,
                x.First_Name,
                x.Last_Name,
                x.User_Name,
                actions = "",
                logged_user_id = ApplicationContext.LoggedUser.id
            });
            return new ContentResult
            {
                Content = serializer.Serialize(new
                {
                    aaData = result.ToList(),
                    iTotalRecords = settings.total_items,
                    iTotalDisplayRecords = settings.total_filtered_items
                }),
                ContentType = "application/json"
            };
        }

        [SessionControl(PermissionCode = "ZONE0004")]
        public ActionResult AssingDriverZone(long userID)
        {
            FormUser c;
            PrepareForm(out c, userID);
            ViewBag.PageTitle = Zones.ZoneTitle;
            return View(c);
        }
        [HttpPost]
        public ActionResult AssingDriverZone(FormUser d)
        {
            FormUser u;
            PrepareForm(out u, d.user.Id);
            u.enabled = new SelectListItem[]   {
            new SelectListItem(){ Text = Users.Active, Value = "True" },
            new SelectListItem(){ Text = Users.Inactive, Value = "False" },
                };
            try
            {
                for (int i = 0; i < u.user.list_zone.Count; i++)
                {
                    d.user.list_zone[i].Id = u.user.list_zone[i].Id;
                    d.user.list_zone[i].name = u.user.list_zone[i].name;
                    //d.user.list_zone[i].UserAssing = u.user.list_zone[i].UserAssing;
                }
                u.user = d.user;
                p.AddUpdateZoneByUser(ApplicationContext.LoggedUser, u);

                this.AddBusinessModelMessage(0, typeof(Users));
                return RedirectToAction("AssingIndex");
            }
            catch (BusinessException bex)
            {
                this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Users));
                return View("AssingDriverZone", u);
            }
        }
        [SessionControl(PermissionCode = "DELI0001")]
        [HttpGet]
        public ActionResult GetZoneList(string orderId)
        {
            var response = new Dictionary<string, object> { };
            Models.Collection<Zone> zones = z.GetListZones();
            response.Add("result", zones);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetSearchZones(string name)
        {
            var response = new Dictionary<string, object> { };
            List<Search> zones = z.GetSearchZone(name);
            response.Add("result", zones);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }

}