using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using Sisten_Chaide.Models;

namespace Sisten_Chaide
{
  public static class ApplicationContext
  {

  
    public static readonly string DefaultConnection = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
	public static readonly string DefaultConnection1 = ConfigurationManager.ConnectionStrings["DefaultConnection1"].ConnectionString;

    public static SessionUser LoggedUser
    {
      get
      {
        return HttpContext.Current.Session["App.LoggedUser"] as SessionUser;
      }
      set
      {
        HttpContext.Current.Session["App.LoggedUser"] = value;
      }
    }

    public static List<MenuItem> ApplicationMenu
    {
      get
      {
        if (HttpContext.Current.Session["AppMenu"] != null)
        {
          return HttpContext.Current.Session["AppMenu"] as List<MenuItem>;
        }
        else
        {
          return new List<MenuItem>();
        }
      }

      set
      {
        HttpContext.Current.Session["AppMenu"] = value;
      }
    }

  }
}