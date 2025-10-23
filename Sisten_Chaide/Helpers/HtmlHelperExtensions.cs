using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Sisten_Chaide.Attributes;
using Sisten_Chaide.Models;

namespace Sisten_Chaide.Helpers
{
  
  public static class HtmlHelperExtensions
  {
    public static MvcHtmlString UsingCss(this HtmlHelper helper, string t)
    {
      HtmlInclude h = ((Dictionary<string, HtmlInclude>)helper.ViewData["css"])[t];
      h.enabled = true;
      return new MvcHtmlString("");
    }

    public static MvcHtmlString UsingJs(this HtmlHelper helper, string t)
    {
      HtmlInclude h = ((Dictionary<string, HtmlInclude>)helper.ViewData["js"])[t];
      h.enabled = true;
      return new MvcHtmlString("");
    }

    public static MvcHtmlString LabelColon(this HtmlHelper helper, string label)
    {
      return new MvcHtmlString(string.Format("{0}:", label));
    }

    public static MvcHtmlString SwitcherFor<TModel, TProperty>(this HtmlHelper<TModel> helper, Expression<Func<TModel, TProperty>> expression, IEnumerable<SelectListItem> list, object selectedValue = null, object htmlAttributes = null)
    {
      var switcher = new TagBuilder("ul");
      string name = ExpressionHelper.GetExpressionText(expression);
      ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, helper.ViewData);
      switcher.MergeAttribute("class", "selector");
      switcher.MergeAttribute("data-switcher", name);
      if (htmlAttributes != null)
      {
        switcher.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);
      }

      foreach (var item in list)
      {
        var li = new TagBuilder("li");
        li.MergeAttribute("data-val", item.Value);
        li.SetInnerText(item.Text);
        bool selected =
          selectedValue != null && selectedValue.ToString().Equals(item.Value) ||
          item.Value.Equals(metadata.Model.ToString());
        if (selected)
        {
          li.MergeAttribute("class", "selected");
        }
        if(item.Value != "4" )
          switcher.InnerHtml += li;
        else
        {
          if ( ApplicationContext.LoggedUser.HasPermission("ORD0013"))
            switcher.InnerHtml += li;
        }
          
      }

      StringBuilder sb = new StringBuilder();
      sb.Append(switcher);
      sb.AppendFormat("<input type='hidden' name='{0}' value='{1}'/>", name, metadata.Model);
      return MvcHtmlString.Create(sb.ToString());
    }

    //public static MvcHtmlString OperatorSelector(this HtmlHelper helper, int selectedOperator, object htmlAttributes)
    //{
    //  TagBuilder select = new TagBuilder("select");

    //  QOperators q = new QOperators(ApplicationContext.SqlDbConnection);
    //  IEnumerable<Operator> operators = q.GetAll();

    //  select.MergeAttributes(new RouteValueDictionary(htmlAttributes));
    //  var html = new StringBuilder("");
    //  html.AppendLine(select.ToString(TagRenderMode.StartTag));
    //  foreach (Operator x in operators)
    //  {
    //    html.AppendLine(string.Format("<option value=\"{0}\" {1}>{2}</option>", x.id, x.id == selectedOperator ? "selected" : "", x.name));
    //  }
    //  html.AppendLine(select.ToString(TagRenderMode.EndTag));
    //  return new MvcHtmlString(html.ToString());
    //}

    //public static MvcHtmlString ModelSelector(this HtmlHelper helper, int selectedModel, object htmlAttributes, int business_id)
    //{
    //  TagBuilder select = new TagBuilder("select");

    //  QDevices q = new QDevices(ApplicationContext.SqlDbConnection);
    //  IEnumerable<DeviceModel> models = q.GetModels(ApplicationContext.LoggedUser, business_id);

    //  select.MergeAttributes(new RouteValueDictionary(htmlAttributes));
    //  var html = new StringBuilder("");
    //  html.AppendLine(select.ToString(TagRenderMode.StartTag));
    //  foreach (DeviceModel x in models)
    //  {
    //    html.AppendLine(string.Format("<option value=\"{0}\" {1}>{2}</option>", x.id, x.id == selectedModel ? "selected" : "", x.name));
    //  }
    //  html.AppendLine(select.ToString(TagRenderMode.EndTag));
    //  return new MvcHtmlString(html.ToString());
    //}

    //public static MvcHtmlString TypeSelector(this HtmlHelper helper, int selectedType, object htmlAttributes, int business_id)
    //{
    //  TagBuilder select = new TagBuilder("select");

    //  QClients qc = new QClients(ApplicationContext.SqlDbConnection);


    //  QDevices q = new QDevices(ApplicationContext.SqlDbConnection);
    //  IEnumerable<DeviceType> types = q.GetTypes(ApplicationContext.LoggedUser, business_id);

    //  select.MergeAttributes(new RouteValueDictionary(htmlAttributes));
    //  var html = new StringBuilder("");
    //  html.AppendLine(select.ToString(TagRenderMode.StartTag));
    //  foreach (DeviceType x in types)
    //  {
    //    html.AppendLine(string.Format("<option value=\"{0}\" {1}>{2}</option>", x.id, x.id == selectedType ? "selected" : "", x.name));
    //  }
    //  html.AppendLine(select.ToString(TagRenderMode.EndTag));
    //  return new MvcHtmlString(html.ToString());
    //}

    //public static MvcHtmlString CountrySelector(this HtmlHelper helper, int selectedCountry, object htmlAttributes)
    //{
    //  TagBuilder select = new TagBuilder("select");

    //  QCountriesAndLanguages q = new QCountriesAndLanguages(ApplicationContext.SqlDbConnection);
    //  IEnumerable<Country> models = q.GetAllCountries();

    //  select.MergeAttributes(new RouteValueDictionary(htmlAttributes));
    //  var html = new StringBuilder("");
    //  html.AppendLine(select.ToString(TagRenderMode.StartTag));
    //  foreach (Country x in models)
    //  {
    //    html.AppendLine(string.Format("<option value=\"{0}\" {1}>{2}</option>", x.id, x.id == selectedCountry ? "selected" : "", x.name));
    //  }
    //  html.AppendLine(select.ToString(TagRenderMode.EndTag));
    //  return new MvcHtmlString(html.ToString());
    //}

  }
}