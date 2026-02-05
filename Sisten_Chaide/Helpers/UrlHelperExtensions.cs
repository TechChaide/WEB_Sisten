using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace www.Helpers
{
  public static class UrlHelperExtensions
  {
    public static string VersionedUrl(this UrlHelper helper, string url, bool versioned = true)
    {
      return helper.Content(VersionHelper.GeneratePath(url, versioned));
    }
  }
}