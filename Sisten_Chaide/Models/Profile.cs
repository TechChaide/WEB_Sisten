using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Resources.Profiles;

namespace Sisten_Chaide.Models
{
  public class Profile
  {

    public int Id { get; set; }

    [Required(ErrorMessageResourceName = "RequiredName", ErrorMessageResourceType = typeof(Profiles))]
    public string Name { get; set; }

    public bool Enabled { get; set; }

    public bool active { get; set; }

    public List<Development_function> development_function { get; set; }

    public string dev_function_text { get; set; }

  }

  public class Development_function
  {
    public int id { get; set; }
    public string name { get; set; }
    public bool active { get; set; }

  }

  public class FormProfile
  {
    public Profile profile { get; set; }
    public bool is_new { get; set; }
    public List<string> users { get; set; }

    public FormProfile()
    {
      profile = new Profile();
      is_new = true;
    }
  }
}


