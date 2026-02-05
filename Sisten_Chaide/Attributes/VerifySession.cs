using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace www.Attributes
{
  public class VerifySessionAttribute : AuthorizeAttribute
  {

    public string KeyToTry;

    protected override bool AuthorizeCore(HttpContextBase httpContext)
    {
      if (httpContext == null)
        return false;

      return httpContext.Session[KeyToTry] != null;
    }
  }
}