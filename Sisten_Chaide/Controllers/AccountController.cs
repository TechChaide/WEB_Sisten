using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Sisten_Chaide.Models;
using Sisten_Chaide.Attributes;

namespace Sisten_Chaide.Controllers
{

	public class AccountController : Controller
	{
		// GET: Account
		public ActionResult Login ()
		{
			return View();
		}
		[HttpPost]
		public ActionResult Login ( FormCollection coll )
		{

			SecurityContext.Login(coll["User_Name"] , coll["password"]);

			if (MessageHandler.Instance.HasErrors)
			{
				MessageHandler.Instance.RenderErrors(this);
				return View(new User() { User_Name = coll["User_Name"] });
			} else
			{
				FormsAuthentication.SetAuthCookie(ApplicationContext.LoggedUser.username , true);
				return RedirectToAction("Index" , "Home");
			}
		}
		public ActionResult Logout ()
		{
			Session.Abandon();
			FormsAuthentication.SignOut();
			return RedirectToAction("Login");
		}

		public ViewResult AccessDenied ()
		{
			return View("500");
		}

		public ActionResult NotFound ()
		{
			return View("404");
		}

	}
}