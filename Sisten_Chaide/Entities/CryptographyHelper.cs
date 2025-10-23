using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Sisten_Chaide.Common
{
    public class CryptographyHelper
    {
        protected SymmetricAlgorithm Coder;

        protected byte[] Key;

        protected byte[] IV;

        protected int Method;

        protected internal byte[] salt = new byte[] { 155, 26, 93, 86 };

        protected CryptographyHelper()
        {
        }

        public CryptographyHelper(int methodIn)
        {
            this.Method = methodIn;
            if (this.Method == 0)
            {
                this.Coder = DES.Create();
                return;
            }
            this.Coder = RC2.Create();
        }

        public byte[] Decode(byte[] buf)
        {
            return this.PassThrough(buf, this.Coder.CreateDecryptor(this.Key, this.IV));
        }

        public string DecodeFromBase64(string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            byte[] numArray = this.Decode(Convert.FromBase64String(val));
            return Encoding.UTF8.GetString(numArray);
        }

        public static string DecodeFromBase64(int method, int key, string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            CryptographyHelper cryptographyHelper = new CryptographyHelper(method);
            Random random = new Random(key);
            cryptographyHelper.SetKey(ref random);
            return cryptographyHelper.DecodeFromBase64(val);
        }

        public static string DecodeFromBase64(int method, string key, string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            CryptographyHelper cryptographyHelper = new CryptographyHelper(method);
            cryptographyHelper.SetKey(key);
            return cryptographyHelper.DecodeFromBase64(val);
        }

        public byte[] Encode(byte[] buf)
        {
            return this.PassThrough(buf, this.Coder.CreateEncryptor(this.Key, this.IV));
        }

        public string EncodeToBase64(string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            byte[] bytes = Encoding.UTF8.GetBytes(val);
            return Convert.ToBase64String(this.Encode(bytes));
        }

        public static string EncodeToBase64(int method, int key, string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            CryptographyHelper cryptographyHelper = new CryptographyHelper(method);
            Random random = new Random(key);
            cryptographyHelper.SetKey(ref random);
            return cryptographyHelper.EncodeToBase64(val);
        }

        public static string EncodeToBase64(int method, string key, string val)
        {
            if (val.Length == 0)
            {
                return val;
            }
            CryptographyHelper cryptographyHelper = new CryptographyHelper(method);
            cryptographyHelper.SetKey(key);
            return cryptographyHelper.EncodeToBase64(val);
        }

        protected byte[] PassThrough(byte[] buf, ICryptoTransform transformation)
        {
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, transformation, CryptoStreamMode.Write);
            cryptoStream.Write(buf, 0, (int)buf.Length);
            cryptoStream.FlushFinalBlock();
            memoryStream.Seek((long)0, SeekOrigin.Begin);
            //byte[] numArray = new byte[checked((IntPtr)memoryStream.Length)];
            byte[] numArray = new byte[checked((int)memoryStream.Length)];
            memoryStream.Read(numArray, 0, (int)memoryStream.Length);
            cryptoStream.Close();
            memoryStream.Close();
            return numArray;
        }

        public void SetKey(string key)
        {
            int num;
            num = (this.Method != 0 ? 5 : 8);
            PasswordDeriveBytes passwordDeriveByte = new PasswordDeriveBytes(key, this.salt);
            this.Key = passwordDeriveByte.GetBytes(num);
            this.IV = passwordDeriveByte.GetBytes(num);
        }

        public void SetKey(ref Random rnd)
        {
            int num;
            num = (this.Method != 0 ? 5 : 8);
            this.Key = new byte[num];
            this.IV = new byte[num];
            rnd.NextBytes(this.Key);
            rnd.NextBytes(this.IV);
        }

        public void SetKey(byte[] keyIn, byte[] ivIn)
        {
            int num;
            num = (this.Method != 0 ? 5 : 8);
            this.Key = new byte[num];
            this.IV = new byte[num];
            Array.Copy(keyIn, 0, this.Key, 0, num);
            Array.Copy(ivIn, 0, this.IV, 0, num);
        }
    }
}