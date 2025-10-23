using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Sisten_Chaide.Models;
using Sisten_Chaide.Data;
using Sisten_Chaide.Attributes;

using Sisten_Chaide.Resources.Labels;

namespace Sisten_Chaide.Controllers
{
  //[Authorize]
  [HtmlUsing]
  //[SessionControl(PermissionCode = "PROF0001")]
  public class ProfilesController : Controller
  {
    const int PageSize = 10;

    static JavaScriptSerializer serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue, RecursionLimit = 150 };

    private ProfilesProvider q = new ProfilesProvider();
    
    private void PrepareForm(out FormProfile c, int id)
    {
      ViewBag.PageTitle = @Labels.NewProfile;
      c = q.GetOne(id);

      
    }

    public ActionResult Index(int? page)
    {
      return View(new Dictionary<string, object> { });
    }

    [HttpGet]
    [Compress]
    public ContentResult GetProfiles(int iDisplayStart, int iDisplayLength, string sSearch)
    {
      var settings = new CollectionSettings { page_size = iDisplayLength, page_number = (iDisplayStart > 0 ? iDisplayStart / iDisplayLength : 0) + 1, enabled = true };
      var profiles = q.Get(ApplicationContext.LoggedUser, sSearch != "" ? sSearch : null, settings);
      var result = profiles.items.Select(x => new
      {
        x.Id,
        x.Name,
        //x.erasable,
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

    //[SessionControl(PermissionCode = "PROF0003")]
    public ActionResult Edit(int profileID)
    {
      FormProfile c;
      PrepareForm(out c, profileID);
      ViewBag.PageTitle = @Labels.EditProfile;

      return View(c);
    }

    //[SessionControl(PermissionCode = "PROF0002")]
    public ActionResult New()
    {
      FormProfile c;
      PrepareForm(out c, -1);

      return View("Edit", c);
    }

    //[SessionControl(PermissionCode = "PROF0002,PROF0003")]
    [HttpPost]
    public ActionResult Edit(FormProfile d)
    {
      FormProfile p;
      PrepareForm(out p, d.profile.Id);
      
      try
      {
        p.profile.Id = d.profile.Id;
        p.profile.Name = d.profile.Name;
        //p.profile.is_public = d.profile.is_public;
        for (int i = 0; i < d.profile.development_function.Count; i++ )
        {
          p.profile.development_function[i].active = d.profile.development_function[i].active;
        }

        if (d.is_new)
        {          
          q.Add(p);
        }
        else
        {          
          q.Update(p);
        }

        this.AddBusinessModelMessage(0, typeof(Labels));
        return RedirectToAction("Index");
      }
      catch (BusinessException bex)
      {
        this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Labels));
        return View("Edit", p);
      }
    }

    [SessionControl(PermissionCode = "PROF0004")]
    public ActionResult Delete(int profileID)
    {

      int iError = 0;
      try
      {
        q.Delete(profileID);
      }
      catch
      {
        iError = 999;
      }
      this.AddBusinessModelMessage(iError, typeof(Labels));

      return RedirectToAction("Index");

    }

  }
}
