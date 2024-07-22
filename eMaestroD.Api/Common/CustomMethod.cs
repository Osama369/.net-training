using System.Security.Cryptography;
using System.Text;

namespace eMaestroD.Api.Common
{
    public class CustomMethod
    {
        private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        private const string NumericChars = "0123456789";
        private const string SpecialChars = "@_";

        public string GenerateStrongPassword(int length)
        {
            if (length < 4)
            {
                throw new ArgumentException("Password length must be at least 4 characters.");
            }

            StringBuilder password = new StringBuilder();
            Random random = new Random();

            // Include at least one character from each character set
            password.Append(UppercaseChars[random.Next(UppercaseChars.Length)]);
            password.Append(LowercaseChars[random.Next(LowercaseChars.Length)]);
            password.Append(NumericChars[random.Next(NumericChars.Length)]);
            password.Append(SpecialChars[random.Next(SpecialChars.Length)]);

            // Fill the rest of the password with random characters
            for (int i = 4; i < length; i++)
            {
                string charSet = GetRandomCharSet(random);
                password.Append(charSet[random.Next(charSet.Length)]);
            }

            // Shuffle the characters to make the password more random
            return Shuffle(password.ToString());
        }

        private string GetRandomCharSet(Random random)
        {
            string[] charSets = { UppercaseChars, LowercaseChars, NumericChars, SpecialChars };
            return charSets[random.Next(charSets.Length)];
        }

        private string Shuffle(string input)
        {
            char[] chars = input.ToCharArray();
            Random random = new Random();
            int n = chars.Length;
            while (n > 1)
            {
                n--;
                int k = random.Next(n + 1);
                char value = chars[k];
                chars[k] = chars[n];
                chars[n] = value;
            }
            return new string(chars);
        }
        public string Encrypt(string clearText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }

            return clearText;
        }

        public string Decrypt(string cipherText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }

            return cipherText;
        }

    }
}
