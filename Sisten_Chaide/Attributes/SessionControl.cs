using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Sisten_Chaide
{
  public class SessionControl : ActionFilterAttribute
  {
    private string _permissionCode;
    private bool _allAccess;

    public string PermissionCode
    {
      get
      {
        return _permissionCode;
      }

      set
      {
        _permissionCode = value;
      }
    }

    public bool AllAccess
    {
      get
      {
        return _allAccess;
      }

      set
      {
        _allAccess = value;
      }
    }

    public SessionControl()
    {
      _permissionCode = "";
      _allAccess = false;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
      UrlHelper helper = new UrlHelper(filterContext.RequestContext);
      if (ApplicationContext.LoggedUser != null)
      {
        string[] permissionList = _permissionCode.Split(',');
        bool canContinue = ApplicationContext.LoggedUser.is_super || _allAccess;

        if (!canContinue)
        {
          foreach (string code in permissionList)
          {
            canContinue = canContinue || (code.Length > 0 && ApplicationContext.LoggedUser.HasPermission(code));
          }
        }

        if (!canContinue)
        {
          if (!filterContext.RequestContext.HttpContext.Request.IsAjaxRequest())
          {
            filterContext.Result = new RedirectResult(helper.RouteUrl(new { controller = "Account", action = "AccessDenied" }), false);
          }
          else
          {
            filterContext.HttpContext.Response.StatusCode = 500;
            filterContext.HttpContext.Response.ContentType = "text/plain";
            filterContext.HttpContext.Response.Write("You don't have enough privileges to access at this page. Call your administrator for better assistance.");
            filterContext.HttpContext.Response.Flush();
            filterContext.HttpContext.Response.End();
            filterContext.Result = new HttpUnauthorizedResult();
          }
        }

        base.OnActionExecuting(filterContext);
      }
      else
      {
        filterContext.HttpContext.Response.Redirect(helper.RouteUrl(new { controller = "Account", action = "Logout" }), true);
      }
    }
  }
}