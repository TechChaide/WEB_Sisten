using System.Collections.Generic;
using System.Web;
using Sisten_Chaide.Resources.Labels;


namespace Sisten_Chaide
{
  public class MessageHandler
  {
    private Stack<string> _errorStack;
    private Stack<string> _infoStack;

    public static MessageHandler Instance
    {
      get
      {
        if (HttpContext.Current.Session["App.MessageHandler"] == null)
        {
          MessageHandler handler = new MessageHandler();
          HttpContext.Current.Session["App.MessageHandler"] = handler;
          return handler;
        }
        else
        {
          return HttpContext.Current.Session["App.MessageHandler"] as MessageHandler;
        }
      }
    }

    public bool HasErrors { get { return _errorStack.Count > 0; } }

    private MessageHandler()
    {
      _errorStack = new Stack<string>();
      _infoStack = new Stack<string>();
    }

    public void AddError(string message)
    {
      _errorStack.Push(message);
    }

    public void AddInfo(string message)
    {
      _infoStack.Push(message);
    }

    public string RenderHTMLMessages()
    {
      System.Text.StringBuilder builder = new System.Text.StringBuilder();
      builder.AppendFormat("<ul class='{0}-list'>", HasErrors ? "error" : "info");
      if (HasErrors)
      {
        while (_errorStack.Count > 0)
        {
          builder.AppendFormat("<li>{0}</li>", HttpUtility.HtmlEncode(_errorStack.Pop()));
        }
      }
      else
      {
        while (_infoStack.Count > 0)
        {
          builder.AppendFormat("<li>{0}</li>", HttpUtility.HtmlEncode(_infoStack.Pop()));
        }
      }
      builder.Append("</ul>");
      return builder.ToString();
    }

    public void RenderErrors(System.Web.Mvc.Controller context)
    {
      while (_errorStack.Count > 0)
      {
        context.ModelState.AddModelError("", _errorStack.Pop());
      }
    }
  }

  public static class MessageBuilder
  {
    public static Message Info(string message)
    {
      return new Message() { message_type = "info", message_body = message };
    }

    public static Message Warning(string message)
    {
      return new Message() { message_type = "warning", message_body = message };
    }

    public static Message Success(string message)
    {
      return new Message() { message_type = "success", message_body = message };
    }

    public static Message Error(string message)
    {
      return new Message() { message_type = "danger", message_body = message, is_error = true };
    }
  }

  public class Message
  {
    public string message_type { get; set; }
    public string message_body { get; set; }
    public bool is_error { get; set; }
  }

  public static class MessageResourceHandler
  {
    static string MessageReferenceName = "Message";

    private static string GetResourceMessage(string resourceName, System.Type resourceType)
    {
      System.Resources.ResourceManager rm = (System.Resources.ResourceManager)resourceType.GetProperty("ResourceManager").GetValue(resourceType, null);

      string resourceValue = null;
      if (rm != null)
      {
        resourceValue = rm.GetString(resourceName, System.Globalization.CultureInfo.CurrentUICulture);
      }

      return resourceValue == null ? GetResourceMessage(resourceName) : resourceValue;
    }

    private static string GetResourceMessage(string resourceName)
    {
      return Labels.ResourceManager.GetString(resourceName);
    }

    private static string LocalizeMessage(int messageCode, System.Type resourceType)
    {
      string tagName = string.Format("Message_{0}", messageCode);
      if (resourceType == null)
      {
        return GetResourceMessage(tagName);
      }

      return GetResourceMessage(tagName, resourceType);
    }

    public static void AddBusinessModelMessage(this System.Web.Mvc.Controller controller, int messageCode)
    {
      controller.TempData[MessageReferenceName] = messageCode > 99
        ? GetErrorMessageByCode(messageCode)
        : GetSuccessMessageByCode(messageCode);
    }

    public static void AddBusinessModelMessage(this System.Web.Mvc.Controller controller, int messageCode, System.Type resourceType)
    {
      controller.TempData[MessageReferenceName] = messageCode > 99
        ? GetErrorMessageByCode(messageCode, resourceType)
        : GetSuccessMessageByCode(messageCode, resourceType);
    }

    public static void AddBusinessModelMessage(this System.Web.Mvc.Controller controller, Models.BusinessException bex, System.Type resourceType)
    {

      Message m = GetErrorMessageByCode(bex.ExceptionCode, resourceType);
      if (bex.AdditionalInformation != null)
      {
        m.message_body = string.Format(m.message_body, bex.AdditionalInformation);
      }
      controller.TempData[MessageReferenceName] = m;
    }

    public static void AddBusinessModelMessage(this System.Web.Mvc.Controller controller, int messageCode, System.Type resourceType, object[] additionalParameters)
    {
      Message m = messageCode > 99
        ? GetErrorMessageByCode(messageCode, resourceType)
        : GetSuccessMessageByCode(messageCode, resourceType);

      m.message_body = string.Format(m.message_body, additionalParameters);
      controller.TempData[MessageReferenceName] = m;
    }

    public static Message GetSuccessMessageByCode(int messageCode)
    {
      return GetSuccessMessageByCode(messageCode, null);
    }

    public static Message GetSuccessMessageByCode(int messageCode, System.Type resourceType)
    {
      string message = LocalizeMessage(messageCode, resourceType);
      return MessageBuilder.Success(message);
    }

    public static Message GetErrorMessageByCode(int errorCode)
    {
      return GetErrorMessageByCode(errorCode, null);
    }

    public static Message GetErrorMessageByCode(int errorCode, System.Type resourceType)
    {
      string errorMessage = LocalizeMessage(errorCode, resourceType);
      return MessageBuilder.Error(errorMessage);
    }

    public static string GetMessageByCode(int messageCode)
    {
      return GetResourceMessage(string.Format("Message_{0}", messageCode));
    }
  }
}