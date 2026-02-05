using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace www.Helpers
{
    public static class VersionHelper
    {
      private readonly static string _version = System.Configuration.ConfigurationManager.AppSettings["Version"];
      public static string GeneratePath(string url, bool versioned)
      {
        bool m = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["UseMinifiedResources"]);
        return string.Format(versioned ? "{0}?v={1}" : "{0}", url, _version).Replace(".js", m ? ".min.js" : ".js").Replace(".css", m ? ".min.css" : ".css");
      }
      public static string GetVersion()
      {
        return string.Format("v{0}", _version);
      }
    }
}