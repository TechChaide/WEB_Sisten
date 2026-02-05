using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Sisten_Chaide.Models;

namespace Sisten_Chaide.Attributes
{
  public class LocalizationAttribute : ActionFilterAttribute
  {
    ArrayList SupportedLanguages = new ArrayList { "es", "en", "pt" };
    public bool TryToCreateSpecificCulture(string lang, out CultureInfo culture)
    {
      try
      {
        culture = CultureInfo.CreateSpecificCulture(lang);
        return true;
      }
      catch (Exception)
      {
        culture = CultureInfo.CreateSpecificCulture("es");
      }
      return false;
    }

    //public override void OnActionExecuting(ActionExecutingContext filterContext)
    //{
    //  string controllerName = "";
    //  bool noLang = false;
    //  CultureInfo culture;
    //  if (filterContext.RouteData.Values["lang"] != null &&
    //      !string.IsNullOrWhiteSpace(filterContext.RouteData.Values["lang"].ToString()) && SupportedLanguages.IndexOf(filterContext.RouteData.Values["lang"]) >= 0)
    //  {
    //    var lang = filterContext.RouteData.Values["lang"].ToString();
    //     if (TryToCreateSpecificCulture(lang, out culture))
    //    {
    //      Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(lang);        
    //    }
    //    else
    //    {
    //      controllerName = filterContext.RouteData.Values["lang"].ToString();
    //      noLang = true;
    //    }
    //  }
    //  else
    //  {
    //    noLang = true;
    //  }

    //  HttpCookie cookie;
    //  if (noLang)
    //  {
    //    cookie = filterContext.HttpContext.Request.Cookies["GeoFleet.CurrentUICulture"];
    //    string langHeader;
    //    if (cookie != null)
    //    {
    //      langHeader = cookie.Value;
    //      Thread.CurrentThread.CurrentUICulture = TryToCreateSpecificCulture(langHeader, out culture) ? culture : CultureInfo.CreateSpecificCulture("es");
    //    }
    //    else
    //    {
    //      langHeader = filterContext.HttpContext.Request.UserLanguages != null ? (SupportedLanguages.IndexOf(filterContext.HttpContext.Request.UserLanguages[0]) >= 0 ? filterContext.HttpContext.Request.UserLanguages[0] : "en") : "en";
    //      Thread.CurrentThread.CurrentUICulture = TryToCreateSpecificCulture(langHeader, out culture) ? culture : CultureInfo.CreateSpecificCulture("es");
    //    }
    //    filterContext.RouteData.Values["lang"] = langHeader;
    //    if (controllerName != "")
    //      filterContext.RouteData.Values["controller"] = controllerName;
    //  }

    //  cookie = new HttpCookie("GeoFleet.CurrentUICulture", Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName)
    //  {
    //    Expires = DateTime.Now.AddYears(1),
    //    HttpOnly = true
    //  };
    //  filterContext.HttpContext.Response.SetCookie(cookie);

    //  if (HttpContext.Current.Session["user"] != null)
    //  {
    //    var user = (SessionUser)HttpContext.Current.Session["user"];
    //    if (user.two_letters_culture != Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName)
    //    {
    //      var q = new QUsers(ApplicationContext.SqlDbConnection);
    //      q.UpdateCulture(user.id, Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName);
    //      user.two_letters_culture = Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;
    //      HttpContext.Current.Session["user"] = user;
    //    }
    //  }
    //  base.OnActionExecuting(filterContext);
    //}
  }
}