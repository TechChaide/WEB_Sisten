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

namespace Sisten_Chaide.Controllers
{
  [HtmlUsing]
  [Localization]
  [SessionControl(PermissionCode = "USER001")]
  public class UsersController : Controller
  {
    const int PageSize = 10;

    static JavaScriptSerializer serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue, RecursionLimit = 150 };

    private UsersProvider p = new UsersProvider();

    private void PrepareForm(out FormUser c, long userID)
    {
      ViewBag.PageTitle = Users.NewUser;
      c = p.GetOne(ApplicationContext.LoggedUser, userID);

      c.enabled = new SelectListItem[]
      {
        new SelectListItem(){ Text = Users.Active, Value = "True" },
        new SelectListItem(){ Text = Users.Inactive, Value = "False" },				
      };
    }

    public ActionResult Index()
    {
      return View(new Dictionary<string, object> { });
    }

    [HttpGet]
    [Compress]
    public ContentResult GetUsers(int iDisplayStart, int iDisplayLength, string sSearch)
    {
      var settings = new CollectionSettings { page_size = iDisplayLength, page_number = (iDisplayStart > 0 ? iDisplayStart / iDisplayLength : 0) + 1, enabled = true };
      var users = p.Get(ApplicationContext.LoggedUser, sSearch != "" ? sSearch : null, settings);
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

    //[SessionControl(PermissionCode = "USER0002")]
    public ActionResult New()
    {
      FormUser c;
      PrepareForm(out c, -1);

      return View("Edit", c);
    }

    //[SessionControl(PermissionCode = "USER0003")]
    public ActionResult Edit(long userID)
    {
      FormUser c;
      PrepareForm(out c, userID);
      ViewBag.PageTitle = Users.EditUser;

      return View(c);
    }

    //[SessionControl(PermissionCode = "USER0004")]
    //public ActionResult Delete(long userID)
    //{
    //  if (ApplicationContext.LoggedUser.id != userID)
    //  {
    //    int iError = 0;
    //    try
    //    {
    //      p.Delete(ApplicationContext.LoggedUser, userID);
    //    }
    //    catch
    //    {
    //      iError = 999;
    //    }
    //    this.AddBusinessModelMessage(iError, typeof(Users));
    //  }
    //  else
    //  {
    //    this.AddBusinessModelMessage(200, typeof(Users));
    //  }
    //  return RedirectToAction("Index");
    //}

    //[SessionControl(PermissionCode = "USER0002,USER0003")]
    [HttpPost]
    public ActionResult Edit(FormUser d)
    {
      FormUser u;
      PrepareForm(out u, d.user.Id);
      string passwd;
      try
      {

        for (int i = 0; i < d.user.list_profile.Count; i++)
        {
          d.user.list_profile[i].Id= u.user.list_profile[i].Id;
          d.user.list_profile[i].Name = u.user.list_profile[i].Name;
          d.user.list_profile[i].Enabled = u.user.list_profile[i].Enabled;
        }

        if (d.is_new)
        {
          u.user = d.user;
          passwd = SecurityContext.EncryptPassword(u.user.password != null ? u.user.password : u.user.password_edit);
          u.user.password = passwd;
          p.Add(ApplicationContext.LoggedUser, u);
        }
        else
        {
          if (d.user.password_edit == null)
            d.user.password = u.user.password;
          else
          {
            passwd = SecurityContext.EncryptPassword(d.user.password_edit);
            d.user.password = passwd;
          }
          u.user = d.user;
          p.Update(ApplicationContext.LoggedUser, u);
        }

        this.AddBusinessModelMessage(0, typeof(Users));
        return RedirectToAction("Index");
      }
      catch (BusinessException bex)
      {
        this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Users));
        return View("Edit", u);
      }
    }

    //public string Control_banned(int profile_id)
    //{
    //  string banned = "";
    //  try
    //  {
    //    banned = qp.Get_banned_profile(profile_id);
    //  }
    //  catch (BusinessException bex)
    //  {
    //    this.AddBusinessModelMessage(bex.ExceptionCode, typeof(Users));
    //  }

    //  return banned.Replace("\"", "");
    //}



  }
}
