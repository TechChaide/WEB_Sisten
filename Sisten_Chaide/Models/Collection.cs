using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Resources.Shared;

namespace Sisten_Chaide.Models
{
	public class Collection<T>
	{
		public List<T> items { get; set; }

		public CollectionSettings pagging_settings { get; set; }

		public bool has_items { get { return items.Count > 0; } }

		public Dictionary<string , object> extra_fields { get; set; }

		public Collection ()
		{
			items = new List<T>();
			pagging_settings = new CollectionSettings();
			extra_fields = new Dictionary<string , object>();
		}
	}

	public class CollectionSettings
	{
		const int DisplayedPages = 10;
		public int page_number { get; set; }
		public int page_size { get; set; }
		public long total_items { get; set; }
		public long total_filtered_items { get; set; }
		public bool enabled { get; set; }
		public String startDate { get; set; }
		public String endDate { get; set; }
		public int zoneId { get; set; }

		public System.Web.HtmlString GetPager (System.Web.Mvc.ViewContext context)
		{

			if (!enabled)
				return new System.Web.HtmlString("");

			var route = context.RouteData;

			int pageCount = (int) Math.Ceiling(total_items / (double) page_size);

			StringBuilder sb = new StringBuilder();
			sb.Append("<div class='table-paging'>");
			sb.Append("	<ol class='pagination pagination-sm'>");
			sb.AppendFormat("		<li class='prev{0}'><a href='{2}'><i class='fa fa-long-arrow-left'></i>&nbsp;<span>{1}</span></a></li>" , page_number > 1 ? "" : " disabled" , global::Resources.Shared.Common.Previous , GenerateLink(route , page_number - 1));

			int start = 1;
			int end = pageCount;

			if (pageCount > DisplayedPages)
			{
				int middle = (int) Math.Ceiling(DisplayedPages / 2d) - 1;
				int below = page_number - middle;
				int above = page_number + middle;

				if (below < 4)
				{
					above = DisplayedPages;
					below = 1;
				} else if (above > (pageCount - 4))
				{
					above = pageCount;
					below = (pageCount - DisplayedPages);
				}

				start = below;
				end = above;
			}

			if (start > 3)
			{
				sb.AppendFormat("<li><a href='{0}'>1</a></li>" , GenerateLink(route , 1));
				sb.AppendFormat("<li><a href='{0}'>2</a></li>" , GenerateLink(route , 2));
				sb.Append("<li>...</li>");
			}

			for (int i = start ; i <= end ; i++)
			{
				if (i == page_number || (page_number <= 0 && i == 0))
				{
					sb.AppendFormat("<li class='active'><a href='#'>{0}</a></li>" , i);
				} else
				{
					sb.AppendFormat("<li><a href='{1}'>{0}</a></li>" , i , GenerateLink(route , i));
				}
			}

			if (end < (pageCount - 3))
			{
				sb.Append("<li>...</li>");
				sb.AppendFormat("<li><a href='{1}'>{0}</a></li>" , pageCount - 1 , GenerateLink(route , pageCount - 1));
				sb.AppendFormat("<li><a href='{1}'>{0}</a></li>" , pageCount , GenerateLink(route , pageCount));
			}

			sb.AppendFormat("<li class='next{0}'><a href='{2}'><span>{1}&nbsp;<i class='fa fa-long-arrow-right'></i></span></a></li>" , page_number < pageCount ? "" : " disabled" , global::Resources.Shared.Common.Next , GenerateLink(route , page_number + 1));

			sb.Append("	</ol>");
			sb.Append("</div>");

			return new System.Web.HtmlString(sb.ToString());
		}

		private static string GenerateLink (System.Web.Routing.RouteData route , int page)
		{
			//List<string> items = new List<string>();
			//foreach (string item in route.Values.Keys)
			//{
			//	items.Add(route.Values[item].ToString());
			//}
			//return string.Format("{0}?page={1}", string.Join<string>("/", items), page);
			return string.Format("?page={0}" , page);
		}
	}
}
