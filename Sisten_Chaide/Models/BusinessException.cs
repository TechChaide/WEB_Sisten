using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sisten_Chaide.Models
{
	public class BusinessException : Exception
	{
		public int ExceptionCode { get; set; }
		public string AdditionalInformation { get; set; }

		public BusinessException(int exceptionCode)
			: this(exceptionCode, null)
		{			
		}

		public BusinessException(int exceptionCode, string additionalInformation)
			: this(exceptionCode, additionalInformation, null)
		{			
		}
		
		public BusinessException(int exceptionCode, string additionalInformation, string exceptionError):base(exceptionError)
		{
			ExceptionCode = exceptionCode;
			AdditionalInformation = additionalInformation;
		}

		
	}
}