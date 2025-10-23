using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
  public class Menu
  {
    private const string MenuFileName = "~/Content/menu/Menu.es.xml";

    private List<MenuItem> _menuItems;

    public List<MenuItem> Items
    {
      get
      {
        return _menuItems;
      }
    }

    public Menu()
    {
      _menuItems = new List<MenuItem>();
      LoadSchema();
    }

    private void LoadSchema()
    {
      string file = HttpContext.Current.Server.MapPath(MenuFileName);
      if (System.IO.File.Exists(file))
      {
        XElement main = XElement.Load(file);
        foreach (XElement grp in main.Elements("item"))
        {
          List<MenuItem> childs = new List<MenuItem>();
          foreach (XElement item in grp.Elements("item"))
          {
            bool zeroRestricted = item.Attribute("zero-restricted") != null ? Convert.ToBoolean(item.Attribute("zero-restricted").Value) : false;
            if (ApplicationContext.LoggedUser.id == 0 || !zeroRestricted)
            {
              childs.Add(new MenuItem()
              {
                Name = item.Attribute("name") != null ? item.Attribute("name").Value : null,
                Url = item.Attribute("url") != null ? item.Attribute("url").Value : null,
                NoControl = item.Attribute("nocontrol") != null ? Convert.ToInt32(grp.Attribute("nocontrol").Value) == 1 : false,
                Code = item.Attribute("code") != null ? item.Attribute("code").Value : null,
                Text = item.Attribute("text") != null ? item.Attribute("text").Value : null,
                Icon = item.Attribute("icon") != null ? item.Attribute("icon").Value : null,
                ForceView = item.Attribute("force-view") != null ? Convert.ToBoolean(item.Attribute("force-view").Value) : false
              });
            }
          }
          _menuItems.Add(new MenuItem()
          {
            Name = grp.Attribute("name") != null ? grp.Attribute("name").Value : null,
            Url = grp.Attribute("url") != null ? grp.Attribute("url").Value : null,
            NoControl = grp.Attribute("nocontrol") != null ? Convert.ToInt32(grp.Attribute("nocontrol").Value) == 1 : false,
            Code = grp.Attribute("code") != null ? grp.Attribute("code").Value : null,
            Text = grp.Attribute("text") != null ? grp.Attribute("text").Value : null,
            Icon = grp.Attribute("icon") != null ? grp.Attribute("icon").Value : null,
            ForceView = grp.Attribute("force-view") != null ? Convert.ToBoolean(grp.Attribute("force-view").Value) : false,
            Childs = childs.Count > 0 ? childs : null
          });
        }
      }
    }
  }

  public class MenuItem
  {
    public string Code { get; set; }
    public string Name { get; set; }
    public string Url { get; set; }
    public string Text { get; set; }
    public bool ForceView { get; set; }
    public string Icon { get; set; }
    public bool NoControl { get; set; }
    public List<MenuItem> Childs { get; set; }
  }
}