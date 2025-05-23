using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace aiPriceGuard.Api.Common
{
    public class CustomJsonSerialization<T> : JsonConverter<T> where T : class, new()
    {
        public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {

            using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
            {
                var root = doc.RootElement;
                var item = new T();
                //JsonElement root = doc.RootElement;

                // Step 2: Remove unnecessary whitespaces and convert property names and string values to uppercase (or lowercase)
                string transformedJson = RemoveWhitespace(root.GetRawText());
                transformedJson = TransformJsonPropertyNamesAndValuesToLower(transformedJson);
                // Step 3: Convert transformed JSON back to a JsonElement
                using (JsonDocument transformedDoc = JsonDocument.Parse(transformedJson))
                {
                    JsonElement transformedRoot = transformedDoc.RootElement;
                    var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                    root = transformedRoot;
                    if(transformedRoot.TryGetProperty("supplierdetails",out var supplierDt) && transformedRoot.TryGetProperty("invoicedetails", out var invoiceDt))
                    {
                        root = invoiceDt;
                    }
                        foreach(var propertyOne in properties)
                        {
                           if(propertyOne.Name == "supplier" && transformedRoot.TryGetProperty("supplierdetails", out var supplier) && transformedRoot.TryGetProperty("invoicedetails", out var invDetails))
                            {
                                var suppObj =  new Supplier();
                                var suppProperties = typeof(Supplier).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                                foreach(var prop in suppProperties)
                                {
                                    if(supplier.TryGetProperty(prop.Name.ToLower(), out var value))
                                    {
                                        prop.SetValue(suppObj,value.GetString());

                                    }
                                }
                                
                                propertyOne.SetValue(item,suppObj);
                            }else
                            {
                                var invoiceDetails = new Invoice();
                                var invProperties = typeof(Invoice).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                            if (propertyOne.Name == "InvoiceDetails")
                            {
                                foreach (var property in invProperties)
                                {
                                    if (root.TryGetProperty(property.Name.ToLower(), out var jsonProperty) && (property.PropertyType.IsValueType || property.PropertyType == typeof(string)))
                                    {
                                        if (property.PropertyType == typeof(string) && jsonProperty.ValueKind == JsonValueKind.String)
                                        {
                                            property.SetValue(invoiceDetails, jsonProperty.GetString());
                                        }
                                        else if (property.PropertyType == typeof(int?) && jsonProperty.ValueKind == JsonValueKind.Number)
                                        {
                                            property.SetValue(invoiceDetails, jsonProperty.GetInt32());
                                        }
                                        else if (property.PropertyType == typeof(decimal?) && jsonProperty.ValueKind == JsonValueKind.Number)
                                        {
                                            property.SetValue(invoiceDetails, jsonProperty.GetDecimal());
                                        }
                                        else if (property.PropertyType == typeof(DateTime?) && jsonProperty.ValueKind == JsonValueKind.String)
                                        {
                                            if (DateTime.TryParse(jsonProperty.GetString(), out DateTime dateTimeValue))
                                            {
                                                property.SetValue(invoiceDetails, dateTimeValue);
                                            }
                                            else
                                            {
                                                // If the parsing fails, set it to null
                                                property.SetValue(invoiceDetails, null);
                                            }
                                        }
                                    }
                                    else if (root.TryGetProperty(property.Name.ToLower(), out var jsonObjProperty) && (property.Name == "Summary" || property.Name == "Items" || property.Name == "LineItems") && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                                    {
                                        if ((root.TryGetProperty("summary", out var summaryObj) || root.TryGetProperty("items", out var itemObj)
                                            || root.TryGetProperty("lineitems", out var lineitemObj)) && jsonProperty.ValueKind == JsonValueKind.Array)
                                        {
                                            var objectProperties = property.PropertyType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

                                            var invDtList = new List<InvoiceDetail>();
                                       
                                            foreach (var itemElement in jsonProperty.EnumerateArray())
                                            {
                                                var invDt = new InvoiceDetail();
                                                if (itemElement.TryGetProperty("item no", out var itemNoDotProp))
                                                {
                                                    invDt.ItemCode = itemNoDotProp.GetString();
                                                }
                                                else if (itemElement.TryGetProperty("itemcode", out var itemNoProp))
                                                {
                                                    invDt.ItemCode = itemNoProp.GetString();
                                                }
                                                else if (itemElement.TryGetProperty("itemno", out var item_NoProp))
                                                {
                                                    invDt.ItemCode = item_NoProp.GetString();
                                                }

                                                if (itemElement.TryGetProperty("unitprice", out var unitPrice))
                                                {
                                                    invDt.PriceEach = unitPrice.GetDecimal();
                                                }
                                                else if (itemElement.TryGetProperty("unit price", out var unitGPrice))
                                                {
                                                    invDt.PriceEach = unitGPrice.GetDecimal();
                                                }
                                                else if (itemElement.TryGetProperty("priceeach", out var priceEach))
                                                {
                                                    invDt.PriceEach = priceEach.GetDecimal();
                                                }

                                                if (itemElement.TryGetProperty("#", out var hash))
                                                {
                                                    invDt.SerialNo = hash.GetInt32();
                                                }
                                                else if (itemElement.TryGetProperty("serial no", out var serialNo))
                                                {
                                                    invDt.SerialNo = serialNo.GetInt32();
                                                }
                                                else if (itemElement.TryGetProperty("serialno", out var serialno))
                                                {
                                                    invDt.SerialNo = serialno.GetInt32();
                                                }

                                                if (itemElement.TryGetProperty("quantity", out var Quantity))
                                                {
                                                    invDt.ShippedQty = Quantity.GetInt32();
                                                }
                                                else if (itemElement.TryGetProperty("shippedqty", out var shippedQty))
                                                {
                                                    invDt.ShippedQty = shippedQty.GetInt32();
                                                }
                                                else if (itemElement.TryGetProperty("shipped qty", out var shipQty))
                                                {
                                                    invDt.ShippedQty = shipQty.GetInt32();
                                                }


                                                if (itemElement.TryGetProperty("linetotal", out var line_total))
                                                {
                                                    invDt.Amount = line_total.GetDecimal();
                                                }
                                                else if (itemElement.TryGetProperty("line total", out var lineTotal))
                                                {
                                                    invDt.Amount = lineTotal.GetDecimal();
                                                }
                                                else if (itemElement.TryGetProperty("amount", out var Amount))
                                                {
                                                    invDt.Amount = Amount.GetDecimal();
                                                }

                                                if (itemElement.TryGetProperty("description", out var description))
                                                {
                                                    invDt.ItemDesc = description.GetString();
                                                    invDt.productName = description.GetString();

                                                }
                                                if (itemElement.TryGetProperty("invline no", out var InvLineNo))
                                                {
                                                    invDt.InvLineNo = InvLineNo.GetInt32();
                                                }
                                                if (itemElement.TryGetProperty("item desc", out var itemDesc))
                                                {
                                                    invDt.ItemDesc = itemDesc.GetString();

                                                }
                                                if (itemElement.TryGetProperty("back ordered", out var BackOrdered))
                                                {
                                                    invDt.BackOrdered = BackOrdered.GetDecimal();
                                                }
                                                else if (itemElement.TryGetProperty("backordered", out var Backordered))
                                                {
                                                    invDt.BackOrdered = Backordered.GetDecimal();

                                                }
                                                if (itemElement.TryGetProperty("casepk", out var casepk))
                                                {
                                                    if (casepk.ValueKind == JsonValueKind.String)
                                                    {

                                                        invDt.CasePk = casepk.GetString();
                                                    }
                                                    else if (casepk.ValueKind == JsonValueKind.Number)
                                                    {

                                                        invDt.CasePk = casepk.GetInt32().ToString();
                                                    }
                                                }

                                                invDtList.Add(invDt);
                                            }
                                            property.SetValue(invoiceDetails, invDtList);
                                        }


                                    }
                                    if (property.Name == "purchaseOrderNo" && root.TryGetProperty(property.Name.ToLower(), out var purchaseOrderNo))
                                    {
                                        property.SetValue(invoiceDetails, purchaseOrderNo);
                                    }
                                    if (property.Name == "delAddress" && root.TryGetProperty("deliveryaddress", out var deliveryAddressProp))
                                    {
                                        var DelAddress = new DeliveryAddress();
                                        var addrProperties = typeof(DeliveryAddress).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                                        //var delAddressJson = root.TryGetProperty("deliveryaddress", out var deliveryAddressProp);
                                        var json = deliveryAddressProp.GetRawText();
                                        foreach (var addrProperty in addrProperties)
                                        {
                                            if (deliveryAddressProp.TryGetProperty(addrProperty.Name.ToLower(), out var delAddrName))
                                            {
                                                addrProperty.SetValue(DelAddress, delAddrName.GetString());

                                            }

                                        }
                                        property.SetValue(invoiceDetails, DelAddress);
                                    }
                                    if(property.Name == "InvNumber" && root.TryGetProperty("invno", out var invNo)  )
                                    {
                                        property.SetValue(invoiceDetails, invNo.GetString());
                                    }
                                    //if (property.Name == "InvNumber" && root.TryGetProperty(property.Name.ToLower(), out var invDate))
                                    //{

                                    //}
                                        if (property.PropertyType.IsValueType || property.PropertyType == typeof(string))
                                    {
                                        if (root.TryGetProperty("salesordernumber", out var sales_OrderNo) && property.Name == "OrderNo")
                                        {
                                            property.SetValue(invoiceDetails, sales_OrderNo.GetString());

                                        }
                                    }

                                    if (property.Name == "InvoiceTotal" && root.TryGetProperty("total", out var totalAmountObj))
                                    {
                                        if (totalAmountObj.TryGetProperty("amount", out var amount))
                                        {
                                            string str = amount.GetString().Split("$")[1];
                                         

                                            decimal dec = decimal.Parse(str);
                                            decimal? nullablDec = dec;
                                            //var propertyType = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;

                                            //if (propertyType == typeof(decimal?) || propertyType == typeof(decimal))
                                            //{
                                                property.SetValue(invoiceDetails, nullablDec);

                                            //}
                                        }
                                    }

                                }

                                propertyOne.SetValue(item, invoiceDetails);
                            }
                            }

                            if(propertyOne.Name =="Total" && root.TryGetProperty("total",out var totalObj))
                            {
                                if (totalObj.TryGetProperty("amount",out var amount))
                                {
                                    propertyOne.SetValue(item, amount.GetDecimal());
                                }
                            }
                       
                        }

                    return item;
                }
            }
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            throw new NotImplementedException();
        }
        private static string RemoveWhitespace(string jsonString)
        {
            // Use a JsonDocument to parse the original JSON and reserialize it without whitespace
            using (JsonDocument doc = JsonDocument.Parse(jsonString))
            {
                // Create a mutable list of transformed key-value pairs
                var transformedJsonObject = new Dictionary<string, JsonElement>();

                // Iterate through each property and transform the key names
                foreach (var property in doc.RootElement.EnumerateObject())
                {
                    // Transform the property name (remove spaces or any other transformation you want)
                    string transformedKey = property.Name.Replace(" ", ""); // Remove spaces

                    // Add the transformed property to the new dictionary
                    transformedJsonObject[transformedKey] = property.Value;
                }

                // Serialize the new object back into a JSON string
                return JsonSerializer.Serialize(transformedJsonObject);

            }
        }
        private static string TransformJsonPropertyNamesAndValuesToLower(string jsonString)
        {
            // Use regex to find and transform all keys (property names) in the JSON
            var regex = new Regex(@"""([^""]+)""\s*:", RegexOptions.Compiled);
            var transformedJson = regex.Replace(jsonString, match =>
            {
                string key = match.Groups[1].Value;
                // Remove dots and underscores, and convert the key to lowercase
                key = key.Replace(".", "").Replace("_", "").ToLower();
                return $"\"{key}\":";
            });

            // Use regex to find and transform all string values in the JSON (values between quotes)
            transformedJson = Regex.Replace(transformedJson, @"""([^""]+)""", match =>
            {
                string value = match.Groups[1].Value;
                // Remove dots and underscores, and convert the value to lowercase
                value = value.Replace(".", "").Replace("_", "").ToLower();
                return $"\"{value}\"";
            });

            return transformedJson;
        }

        private void IntializeInvoiceDetails(JsonElement root, PropertyInfo[]? properties, ref T? item)
        {
            foreach (var property in properties)
            {
                if (root.TryGetProperty(property.Name.ToLower(), out var jsonProperty) && (property.PropertyType.IsValueType || property.PropertyType == typeof(string)))
                {
                    if (property.PropertyType == typeof(string) && jsonProperty.ValueKind == JsonValueKind.String)
                    {
                        property.SetValue(item, jsonProperty.GetString());
                    }
                    else if (property.PropertyType == typeof(int?) && jsonProperty.ValueKind == JsonValueKind.Number)
                    {
                        property.SetValue(item, jsonProperty.GetInt32());
                    }
                    else if (property.PropertyType == typeof(decimal?) && jsonProperty.ValueKind == JsonValueKind.Number)
                    {
                        property.SetValue(item, jsonProperty.GetDecimal());
                    }
                    else if (property.PropertyType == typeof(DateTime?) && jsonProperty.ValueKind == JsonValueKind.String)
                    {
                        if (DateTime.TryParse(jsonProperty.GetString(), out DateTime dateTimeValue))
                        {
                            property.SetValue(item, dateTimeValue);
                        }
                        else
                        {
                            // If the parsing fails, set it to null
                            property.SetValue(item, null);
                        }
                    }

                }
                else if (root.TryGetProperty(property.Name.ToLower(), out var jsonObjProperty) && (property.Name == "Summary" || property.Name == "Items") && property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    if ((root.TryGetProperty("summary", out var summaryObj) || root.TryGetProperty("items", out var itemObj)) && jsonProperty.ValueKind == JsonValueKind.Array)
                    {
                        var objectProperties = property.PropertyType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

                        var invDtList = new List<InvoiceDetail>();
                        foreach (var itemElement in jsonProperty.EnumerateArray())
                        {
                            var invDt = new InvoiceDetail();
                            if (itemElement.TryGetProperty("item no", out var itemNoDotProp))
                            {
                                invDt.ItemCode = itemNoDotProp.GetString();
                            }
                            //else if (itemElement.TryGetProperty("item no", out var itemNoProp))
                            //{
                            //    invDt.ItemCode = itemNoProp.GetString();
                            //}
                            else if (itemElement.TryGetProperty("itemno", out var item_NoProp))
                            {
                                invDt.ItemCode = item_NoProp.GetString();
                            }

                            if (itemElement.TryGetProperty("unitprice", out var unitPrice))
                            {
                                invDt.PriceEach = unitPrice.GetDecimal();
                            }
                            else if (itemElement.TryGetProperty("unitprice", out var unitGPrice))
                            {
                                invDt.PriceEach = unitGPrice.GetDecimal();
                            }

                            if (itemElement.TryGetProperty("#", out var hash))
                            {
                                invDt.SerialNo = hash.GetInt32();
                            }
                            else if (itemElement.TryGetProperty("serial no", out var serialNo))
                            {
                                invDt.SerialNo = serialNo.GetInt32();
                            }

                            if (itemElement.TryGetProperty("quantity", out var Quantity))
                            {
                                invDt.ShippedQty = Quantity.GetInt32();
                            }
                            else if (itemElement.TryGetProperty("shippedqty", out var shippedQty))
                            {
                                invDt.ShippedQty = shippedQty.GetInt32();
                            }
                            else if (itemElement.TryGetProperty("shipped qty", out var shipQty))
                            {
                                invDt.ShippedQty = shipQty.GetInt32();
                            }


                            if (itemElement.TryGetProperty("linetotal", out var line_total))
                            {
                                invDt.Amount = line_total.GetDecimal();
                            }
                            else if (itemElement.TryGetProperty("line total", out var lineTotal))
                            {
                                invDt.Amount = lineTotal.GetDecimal();
                            }
                            else if (itemElement.TryGetProperty("amount", out var Amount))
                            {
                                invDt.Amount = Amount.GetDecimal();
                            }

                            if (itemElement.TryGetProperty("description", out var description))
                            {
                                invDt.ItemDesc = description.GetString();
                                invDt.productName = description.GetString();

                            }
                            if (itemElement.TryGetProperty("invline no", out var InvLineNo))
                            {
                                invDt.InvLineNo = InvLineNo.GetInt32();
                            }
                            if (itemElement.TryGetProperty("item desc", out var itemDesc))
                            {
                                invDt.ItemDesc = itemDesc.GetString();

                            }
                            if (itemElement.TryGetProperty("back ordered", out var BackOrdered))
                            {
                                invDt.BackOrdered = BackOrdered.GetDecimal();
                            }
                            if (itemElement.TryGetProperty("casepk", out var casepk))
                            {
                                if (casepk.ValueKind == JsonValueKind.String)
                                {

                                    invDt.CasePk = casepk.GetString();
                                }
                                else if (casepk.ValueKind == JsonValueKind.Number)
                                {

                                    invDt.CasePk = casepk.GetInt32().ToString();
                                }
                            }

                            invDtList.Add(invDt);
                        }
                        property.SetValue(item, invDtList);
                    }


                }

                if (property.Name == "delAddress")
                {
                    var DelAddress = new DeliveryAddress();
                    var addrProperties = typeof(DeliveryAddress).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                    var delAddressJson = root.TryGetProperty("deliveryaddress", out var deliveryAddressProp);
                    var json = deliveryAddressProp.GetRawText();
                    foreach (var addrProperty in addrProperties)
                    {
                        if (deliveryAddressProp.TryGetProperty(addrProperty.Name.ToLower(), out var delAddrName))
                        {
                            addrProperty.SetValue(DelAddress, delAddrName.GetString());

                        }

                    }

                    property.SetValue(item, DelAddress);
                }

                if (property.PropertyType.IsValueType || property.PropertyType == typeof(string))
                {
                    if (root.TryGetProperty("salesordernumber", out var sales_OrderNo) && property.Name == "OrderNo")
                    {
                        property.SetValue(item, sales_OrderNo.GetString());

                    }
                }
            }
        }

    }
}
