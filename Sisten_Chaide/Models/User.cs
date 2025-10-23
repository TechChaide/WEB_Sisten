using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Resources.Users;

namespace Sisten_Chaide.Models
{

	public class User
	{

		public int Id { get; set; }
		[Required(ErrorMessageResourceName = "RequiredFirstName" , ErrorMessageResourceType = typeof(Users))]
		public string First_Name { get; set; }
		[Required(ErrorMessageResourceName = "RequiredLastName" , ErrorMessageResourceType = typeof(Users))]
		public string Last_Name { get; set; }

		[Required(ErrorMessageResourceName = "RequiredUserName" , ErrorMessageResourceType = typeof(Users))]
		public string User_Name { get; set; }

		[Required(ErrorMessageResourceName = "RequiredField" , ErrorMessageResourceType = typeof(Users))]
		[DataType(DataType.Password)]
		public string password { get; set; }

		[Required(ErrorMessageResourceName = "RequiredField" , ErrorMessageResourceType = typeof(Users))]
		[DataType(DataType.Password)]
		public string confirm_password { get; set; }
		public bool Enabled { get; set; }
		public bool isDriver { get; set; }

		//Edit Users

		[DataType(DataType.Password)]
		public string password_edit { get; set; }

		[DataType(DataType.Password)]
		public string confirm_password_edit { get; set; }

		public List<Profile> list_profile { get; set; }

		public List<Zone> list_zone { get; set; }

	}
	public class FormUser
	{
		public User user { get; set; }
		public bool is_new { get; set; }
		public IEnumerable<System.Web.Mvc.SelectListItem> enabled { get; set; }
		public IEnumerable<System.Web.Mvc.SelectListItem> available { get; set; }
		public string list_perfils { get; set; }
		public string users_name { get; set; }
		public string list_zones { get; set; }

		public long user_IdSession;

		public FormUser ()
		{
			user = new User();
			is_new = true;
		}
	}
}
