using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Shared.Common
{
    public static class ExtensionMethods
    {
        public static List<EntityModelVM> GetEntity_MetaData<T>(this IEnumerable<T> entity) where T : IEntityBase
        {
            return MetaData<T>(entity.FirstOrDefault());

        }
        public static List<EntityModelVM> GetEntity_MetaData<T>(this T entity) where T : IEntityBase
        {
            return MetaData<T>(entity);
        }
        private static List<EntityModelVM> MetaData<T>(IEntityBase entity)
        {
            List<EntityModelVM> metaData = new List<EntityModelVM>();
            int rowID = 0, seq = 1;
            bool isHidden = false;
            bool uppercase = false;
            var obj = typeof(T);
            string headerTitle = string.Empty;
            foreach (System.Reflection.PropertyInfo property in typeof(T).GetProperties().ToList())
            {
                var ct = ControlType.Text;
                string formate = "none";

                headerTitle = property.Name.ToUpper();
                isHidden = false;
                uppercase = false;
                var attributes = property.GetCustomAttributes(true);
                if (attributes != null && attributes.Count() > 0)
                {
                    foreach (var attr in attributes)
                    {
                        if (attr.GetType() == typeof(HiddenOnRender)) { isHidden = true; }
                        else if (attr.GetType() == typeof(DisplayName))
                        {
                            var atr = attr as DisplayName;
                            headerTitle = atr.Name.ToUpper();
                        }
                        else if (attr.GetType() == typeof(UpperCase))
                        {
                            uppercase = true;
                        }
                        if (attr.GetType() == typeof(link))
                        {
                            ct = ControlType.link;
                        }
                    }
                }


                if (property.PropertyType == typeof(decimal))
                {
                    ct = ControlType.Currency;
                    formate = "USD";
                }
                else if (property.PropertyType == typeof(DateTime))
                {
                    ct = ControlType.Date;
                    formate = "dd-MMM-yyyy hh:mm:ss";
                }
                else if (property.PropertyType == typeof(bool))
                {
                    ct = ControlType.ToggleSwitch;
                }
                metaData.Add(new EntityModelVM
                {
                    columnName = property.Name,
                    controlType = ct,
                    formate = formate,
                    type = property.PropertyType.ToString().Split('.')[1],
                    field = property.Name.ToString(),
                    header = headerTitle,
                    isHidden = isHidden,
                    rowID = rowID++,
                    sequence = seq++,
                    uppercase = uppercase
                });
            }
            return metaData;
        }
    }
}
