using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace dotnet_todo_api.core.Utility
{
    public static class SecurityUtil
    {
        public static string GenerateSha512Hash(string input)
        {
            // Convert input string to byte array
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);

            // Create SHA512 hash
            byte[] hashBytes = SHA512.HashData(inputBytes);

            // Convert hash to hexadecimal string
            StringBuilder sb = new();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("x2"));
            }

            return sb.ToString();
        }
    }
}
