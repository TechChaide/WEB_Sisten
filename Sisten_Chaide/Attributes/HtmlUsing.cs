using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Sisten_Chaide.Models;
namespace Sisten_Chaide.Attributes
{
  public class HtmlUsing : ActionFilterAttribute
  {
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {

      Dictionary<string, HtmlInclude> css = new Dictionary<string, HtmlInclude>();
      css.Add("font", new HtmlInclude { url = "~/Content/css/webfontkit-eurostile/stylesheet.css", enabled = false });
      css.Add("main-style", new HtmlInclude { url = "~/Styles/app/style.css?v", enabled = false });
      css.Add("datatable", new HtmlInclude { url = "~/Scripts/plugins/datatable/jquery.dataTables.css", enabled = false });
      css.Add("jquery-ui-1.10.3", new HtmlInclude { url = "~/Scripts/plugins/jquery-ui/jqueryui.css", enabled = false });
      css.Add("select2", new HtmlInclude { url = "~/Scripts/plugins/select2/select2.css", enabled = false });
      css.Add("toggle", new HtmlInclude { url = "~/Scripts/plugins/toggle/bootstrap-switch.css", enabled = false });



      css.Add("timepicker", new HtmlInclude { url = "~/Content/css/jquery/jquery.ui.timepicker.css", enabled = false });
      css.Add("leaflet", new HtmlInclude { url = string.Format("~/Styles/leaflet/leaflet{0}.css", (HttpContext.Current.Request.Browser.Browser == "IE" && Convert.ToDouble(HttpContext.Current.Request.Browser.Version) < 9) ? ".ie" : ""), enabled = false });
      css.Add("cluster", new HtmlInclude { url = string.Format("~/Styles/leaflet/cluster{0}.css", (HttpContext.Current.Request.Browser.Browser == "IE" && Convert.ToDouble(HttpContext.Current.Request.Browser.Version) < 9) ? ".ie" : ""), enabled = false });
      css.Add("kendo-common", new HtmlInclude { url = "~/Styles/kendo/kendo.common.min.css", enabled = false });
      css.Add("kendo-default", new HtmlInclude { url = "~/Styles/kendo/kendo.default.min.css", enabled = false });
      css.Add("kendo-data", new HtmlInclude { url = "~/Styles/kendo/kendo.dataviz.min.css", enabled = false });
      css.Add("kendo-data-default", new HtmlInclude { url = "~/Styles/kendo/kendo.dataviz.default.min.css", enabled = false });
      css.Add("scrollbar", new HtmlInclude { url = "~/Content/css/perfect-scrollbar/perfect-scrollbar-0.4.4.css", enabled = false });
      css.Add("pagination", new HtmlInclude { url = "~/Content/css/simple-pagination/simple-pagination.css", enabled = false });
      css.Add("token-input-default", new HtmlInclude { url = "~/Content/css/token-input/token-input.css", enabled = false });
      css.Add("token-input-mac", new HtmlInclude { url = "~/Content/css/token-input/token-input-mac.css", enabled = false });
      css.Add("token-input-facebook", new HtmlInclude { url = "~/Content/css/token-input/token-input-facebook.css", enabled = false });

      filterContext.Controller.ViewData.Add("css", css);

      Dictionary<string, HtmlInclude> js = new Dictionary<string, HtmlInclude>();
      js.Add("jquery-1.8.2", new HtmlInclude { url = "~/Scripts/jquery/jquery-1.8.2.min.js", enabled = false });
      js.Add("jquery-ui-1.10.3", new HtmlInclude { url = "~/Scripts/plugins/jquery-ui/jquery-ui.min.js", enabled = false });
      js.Add("validate", new HtmlInclude { url = "~/Scripts/jquery/jquery.validate.min.js", enabled = false });
      js.Add("unobtrusive", new HtmlInclude { url = "~/Scripts/jquery/jquery.validate.unobtrusive.min.js", enabled = false });
      js.Add("custom-validators", new HtmlInclude { url = "~/Scripts/jquery/jquery.validate.custom.js", enabled = false });
      js.Add("bootstrap", new HtmlInclude { url = "~/Scripts/plugins/bootstrap.min.js", enabled = false });
      js.Add("datepicker", new HtmlInclude { url = string.Format("~/Scripts/plugins/datepicker/jquery.ui.datepicker-{0}.min.js", Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName), enabled = false });
      js.Add("toggle", new HtmlInclude { url = "~/Scripts/plugins/toggle/bootstrap-switch.min.js", enabled = false });
      js.Add("datatable", new HtmlInclude() { url = "~/Scripts/plugins/datatable/jquery.dataTables.min.js", enabled = false });
      js.Add("datatable-bootstrap", new HtmlInclude() { url = "~/Scripts/plugins/datatable/dataTables.bootstrap.js", enabled = false });
      js.Add("jeditable", new HtmlInclude { url = "~/Scripts/plugins/datatable/jquery.jeditable.js", enabled = false });
      js.Add("input-mask", new HtmlInclude { url = "~/Scripts/plugins/inputmask/jquery.inputmask.bundle.min.js", enabled = false });
      js.Add("select2", new HtmlInclude { url = "~/Scripts/plugins/select2/select2.min.js", enabled = false });
      js.Add("select2-lang", new HtmlInclude { url = string.Format("~/Scripts/plugins/select2/lang/select2_locale_{0}.js", Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName), enabled = false });
      js.Add("jeditable-select2", new HtmlInclude { url = "~/Scripts/plugins/datatable/jquery.jeditable.selector2.js", enabled = false });
      js.Add("jeditable-masked", new HtmlInclude { url = "~/Scripts/plugins/datatable/jquery.jeditable.masked.js", enabled = false });
      js.Add("utilities", new HtmlInclude { url = "~/Scripts/geo-fleet.utilities.js?v", enabled = false });
      js.Add("main", new HtmlInclude { url = "~/Scripts/geo-fleet.main.js?v", enabled = false });
      js.Add("devices", new HtmlInclude { url = "~/Scripts/geo-fleet.devices.js?v", enabled = false });
      js.Add("business", new HtmlInclude { url = "~/Scripts/geo-fleet.business.js?v", enabled = false });
      js.Add("orders", new HtmlInclude { url = "~/Scripts/geo-fleet.orders.js?v", enabled = false });
      js.Add("users", new HtmlInclude { url = "~/Scripts/geo-fleet.users.js?v", enabled = false });
      js.Add("order-reports", new HtmlInclude { url = "~/Scripts/geo-fleet.order-reports.js?v", enabled = false });
      js.Add("clients", new HtmlInclude { url = "~/Scripts/geo-fleet.clients.js?v", enabled = false });
      js.Add("profiles", new HtmlInclude { url = "~/Scripts/geo-fleet.profiles.js?v", enabled = false });
      js.Add("forgotpassword", new HtmlInclude { url = "~/Scripts/geo-fleet.forgotpassword.js?v", enabled = false });
      js.Add("settings", new HtmlInclude { url = "~/Scripts/geo-fleet.settings.js?v", enabled = false });
      js.Add("labels", new HtmlInclude { url = "~/Scripts/labels.js?v", enabled = false });



      js.Add("timepicker", new HtmlInclude { url = "~/Scripts/jquery.ui.timepicker.js", enabled = false });
      js.Add("watermark", new HtmlInclude { url = "~/Scripts/jquery.watermark.js", enabled = false });
      js.Add("kendo-all", new HtmlInclude { url = "~/Scripts/kendo/kendo.all.min.js", enabled = false });
      js.Add("kendo-mvc", new HtmlInclude { url = "~/Scripts/kendo/kendo.aspnetmvc.min.js", enabled = false });
      js.Add("leaflet", new HtmlInclude { url = "~/Scripts/plugins/leaflet/leaflet.js?v", enabled = false });
      js.Add("cluster", new HtmlInclude { url = "~/Scripts/plugins/leaflet/leaflet.markercluster.js", enabled = false });
      js.Add("bing", new HtmlInclude { url = "~/Scripts/leaflet.bing.js", enabled = false });
      js.Add("lw-api-wrapper", new HtmlInclude { url = "~/Scripts/lw.api-wrapper.js?v", enabled = false });

      js.Add("common", new HtmlInclude { url = "~/Scripts/geo-fleet.common.js?v", enabled = false });
      js.Add("map-tool-bar", new HtmlInclude { url = "~/Scripts/geo-fleet.map-tool-bar.js?v", enabled = false });
      js.Add("map-tip", new HtmlInclude { url = "~/Scripts/geo-fleet.map-tip.js?v", enabled = false });
      js.Add("reports", new HtmlInclude { url = "~/Scripts/geo-fleet.reports.js?v", enabled = false });      
      js.Add("widget", new HtmlInclude { url = "~/Scripts/geo-fleet.widget.js?v", enabled = false });
      js.Add("gates", new HtmlInclude { url = "~/Scripts/geo-fleet.gates.js?v", enabled = false });
      js.Add("alert-review", new HtmlInclude { url = "~/Scripts/geo-fleet.alert-review.js?v", enabled = false });
      js.Add("export-data", new HtmlInclude { url = "~/Scripts/geo-fleet.export-data.js?v", enabled = false });
      js.Add("info-menu", new HtmlInclude { url = "~/Scripts/geo-fleet.info-menu.js?v", enabled = false });
      js.Add("notification-window", new HtmlInclude { url = "~/Scripts/geo-fleet.notification-window.js?v", enabled = false });
      js.Add("online-traking", new HtmlInclude { url = "~/Scripts/geo-fleet.online-tracking.js?v", enabled = false });
      js.Add("tips-and-help", new HtmlInclude { url = "~/Scripts/geo-fleet.tips-and-help.js?v", enabled = false });
      js.Add("user-menu", new HtmlInclude { url = "~/Scripts/geo-fleet.user-menu.js?v", enabled = false });
      js.Add("scrollbar", new HtmlInclude { url = "~/Scripts/perfect-scrollbar-0.4.4.with-mousewheel.js", enabled = false });
      js.Add("pagination", new HtmlInclude { url = "~/Scripts/simple-pagination.js", enabled = false });
      js.Add("token-input", new HtmlInclude { url = "~/Scripts/jquery.tokeninput.js", enabled = false });

      filterContext.Controller.ViewData.Add("js", js);

      base.OnActionExecuting(filterContext);

    }
  }
}