using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Sisten_Chaide.Data;
using Sisten_Chaide.Models;

namespace Sisten_Chaide
{
    public static class SecurityContext
    {

        private static UserSesionProvider Provider = new UserSesionProvider(ApplicationContext.DefaultConnection);

        public static void Login(string username, string passwd)
        {
            string encryptedPassword = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(passwd, "SHA1");
            try
            {
                ApplicationContext.LoggedUser = Provider.Login(username, encryptedPassword);
                LoadApplicationMenu();
            }
            catch (BusinessException bex)
            {
                int errorCode = 0;
                switch (bex.ExceptionCode)
                {
                    case -100:
                        errorCode = 102;
                        break;
                    case -200:
                        errorCode = 101;
                        break;
                    case -300:
                        errorCode = 300;
                        break;
                }
                MessageHandler.Instance.AddError(MessageResourceHandler.GetMessageByCode(errorCode));
            }
        }

        public static void LoadApplicationMenu()
        {
            ApplicationContext.ApplicationMenu = GetMenuByPermissions();
        }

        public static string EncryptPassword(string passwd)
        {
            return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(passwd, "SHA1");
        }

        public static string GetRandomPassword(int length)
        {
            string validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
            Random rnumber = new Random();
            string newAlias = "";
            for (int i = 0; i < length; i++)
            {
                newAlias += validCharacters.Substring(rnumber.Next(0, validCharacters.Length - 1), 1);
            }
            return newAlias;
        }

        private static List<MenuItem> GetMenuByPermissions()
        {
            Menu menu = new Menu();
            if (!ApplicationContext.LoggedUser.is_super)
            {
                List<MenuItem> filteredMenuItems = new List<MenuItem>();
                foreach (MenuItem menuItem in menu.Items)
                {
                    //cambio para ocultar menu de Seguridad para usuarios resiflex 25/10/2021
                    if (ApplicationContext.LoggedUser.username.Contains("resiflex") && menuItem.Text == "Seguridad")
                    {
                        //se salta el menu de administracion           
                    }
                    else
                    {

                        List<MenuItem> submenus = new List<MenuItem>();
                        if (menuItem.Childs != null)
                        {
                            foreach (MenuItem submenuItem in menuItem.Childs)
                            {
                                bool hasAccess = submenuItem.Code == null;
                                if (submenuItem.Code != null)
                                {
                                    string[] codeList = submenuItem.Code.Split(',');
                                    foreach (string code in codeList)
                                    {
                                        hasAccess = hasAccess || submenuItem.NoControl || ApplicationContext.LoggedUser.HasPermission(code.Trim());
                                    }
                                }
                                if (hasAccess)
                                {
                                    //cambio para ocultar menu de administracion de entregas para usuarios resiflex 25/10/2021
                                   /* if (ApplicationContext.LoggedUser.username.Contains("resiflex") && submenuItem.Text == "Administrador de entregas")
                                    {
                                        //se salta el menu de administracion           
                                    }
                                    else
                                    {*/
                                        submenus.Add(submenuItem);
                                    //}

                                }
                            }
                        }

                        if (menuItem.ForceView || submenus.Count > 0)
                        {
                            filteredMenuItems.Add(new MenuItem()
                            {
                                Code = menuItem.Code,
                                Name = menuItem.Name,
                                Text = menuItem.Text,
                                Url = menuItem.Url,
                                Icon = menuItem.Icon,
                                Childs = submenus
                            });
                        }

                    }

                }

                return filteredMenuItems;
            }
            else
            {
                return menu.Items;
            }
        }
    }
}