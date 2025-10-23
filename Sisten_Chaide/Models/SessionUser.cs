using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sisten_Chaide.Models
{
  public class SessionUser
  {
    public long id { get; set; }
    public string username { get; set; }

    public bool is_super { get; set; }

    public List<string> features { get; set; }

    public bool HasPermission(string featureCode)
    {
      return features.Contains(featureCode);
    }

    public SessionUser()
    {
    }

    public SessionUser(User u)
    {
      this.id = u.Id;
      this.username = u.User_Name;
    }
  }
}
