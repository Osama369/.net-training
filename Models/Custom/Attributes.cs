using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Custom
{
    public class HiddenOnRender : Attribute { }
    public class DisplayName : Attribute { public string Name { get; set; } }
    public class Date : Attribute { }
    public class UpperCase : Attribute { }
    public class link : Attribute { }
}
