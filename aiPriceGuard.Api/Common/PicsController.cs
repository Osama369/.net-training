using System;
using System.Drawing;
using System.IO;

namespace aiPriceGuard.Api.Common
{
    public class PicsController
    {

        public int newHeight { get; set; } = 320;
        public int newWidth { get; set; } = 240;

        public PicsController() { }

        public Image ResizeImage(Image img)
        {
            return ResizeImage(img, newHeight, newWidth);
        }

        public Image ResizeImage(Stream stream)
        {
            return ResizeImage(Image.FromStream(stream), newHeight, newWidth);
        }

        public Image ResizeImage(Stream stream, int width, int height)
        {
            return ResizeImage(Image.FromStream(stream), width, height);
        }

        public Image ResizeImage(Stream stream, int width, int height, bool forceResize)
        {
            return ResizeImage(Image.FromStream(stream), width, height, forceResize);
        }

        //public Image ResizeImage(System.IO.Stream stream, int width, int height)
        //{
        //    Image image = Image.FromStream(stream);
        //    int newWidth;
        //    int newHeight;
        //    int originalWidth = image.Width;
        //    int originalHeight = image.Height;
        //    float percentWidth = (float)width / originalWidth;
        //    float percentHeight = (float)height / originalHeight;
        //    float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
        //    newWidth = (int)(originalWidth * percent);
        //    newHeight = (int)(originalHeight * percent);
        //    Image newImage = new Bitmap(newWidth, newHeight);
        //    using (Graphics graphicsHandle = Graphics.FromImage(newImage))
        //    {
        //        graphicsHandle.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        //        graphicsHandle.DrawImage(image, 0, 0, newWidth, newHeight);
        //    }
        //    return newImage;
        //}

        public Image ResizeImage(Image image, int width, int height)
        {
            try
            {
                int originalWidth = image.Width;
                int originalHeight = image.Height;

                if (originalHeight > height || originalWidth > width)
                {
                    int newWidth;
                    int newHeight;
                    float percentWidth = (float)width / originalWidth;
                    float percentHeight = (float)height / originalHeight;
                    float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
                    newWidth = (int)(originalWidth * percent);
                    newHeight = (int)(originalHeight * percent);
                    Image newImage = new Bitmap(newWidth, newHeight);
                    using (Graphics graphicsHandle = Graphics.FromImage(newImage))
                    {
                        graphicsHandle.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        graphicsHandle.DrawImage(image, 0, 0, newWidth, newHeight);
                    }
                    return newImage;
                }
                else { return image; }
            }
            catch (Exception) { return image; }
        }

        public Image ResizeImage(Image image, int width, int height, bool forceResize)
        {
            try
            {
                int originalWidth = image.Width;
                int originalHeight = image.Height;

                if (forceResize || originalHeight > height || originalWidth > width)
                {
                    int newWidth;
                    int newHeight;
                    float percentWidth = (float)width / originalWidth;
                    float percentHeight = (float)height / originalHeight;
                    float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
                    newWidth = (int)(originalWidth * percent);
                    newHeight = (int)(originalHeight * percent);
                    Image newImage = new Bitmap(newWidth, newHeight);
                    using (Graphics graphicsHandle = Graphics.FromImage(newImage))
                    {
                        graphicsHandle.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        graphicsHandle.DrawImage(image, 0, 0, newWidth, newHeight);
                    }
                    return newImage;
                }
                else { return image; }
            }
            catch (Exception) { return image; }
        }

        //public bool Save(Image img, int providerID)
        //{
        //    int year = 0;
        //    //try
        //    //{
        //    //    year = Convert.ToInt32(System.Web.HttpContext.Current.Session[SystemSettings.MultiDatabase.Session_DB_Year]);
        //    //}
        //    //catch (Exception) { }

        //    return Save(img, providerID);
        //}

        public bool Save(Image img, int providerID)
        {
            bool resp = true;

            /*     int System_Start_Year = DateTime.Today.Year;*/// new AppSettings().Sys_System_Start_Year;
                                                                 //if (year < System_Start_Year) { return false; }

            ///-----20190902 Saving images into single shared drive
            ///-----New image path will looks like
            ///-----D:\Images\2019\Student\1.jpg
            string sharedImgPath = System.Configuration.ConfigurationManager.AppSettings["imgPath"];///-----D:\Images
            /*  string sessionYear = year.ToString();*//// System.Web.HttpContext.Current.Session[SystemSettings.MultiDatabase.Session_DB_Year].ToString();
            string savedFileName = Path.Combine(sharedImgPath, "Images", $"{providerID}.png");
            FileInfo fileInfo = new FileInfo(savedFileName);

            try
            {
                if (!Directory.Exists(fileInfo.DirectoryName)) { Directory.CreateDirectory(fileInfo.DirectoryName); }
            }
            catch (Exception) { }

            try { if (File.Exists(savedFileName)) { File.Delete(savedFileName); } } catch (Exception) { }
            try { img.Save(savedFileName); } catch (Exception) { resp = false; }

            return resp;
        }
    }
}
