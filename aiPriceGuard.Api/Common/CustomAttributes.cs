namespace aiPriceGuard.Api.Common
{
    public class HiddenOnRender : Attribute { }
    public class DisplayName : Attribute { public string Name { get; set; } }
    public class Date : Attribute { }
    public class UpperCase : Attribute { }
    public class link : Attribute { }
}
