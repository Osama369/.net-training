namespace eMaestroD.Models.Models
{
    public class EntityModelVM
    {
        public int id { get; set; }
        public int rowID { get; set; }
        public int sequence { get; set; }
        public string? type { get; set; }
        public string? value { get; set; }
        public string? displayName { get; set; }
        public ControlType controlType { get; set; }
        public string? columnName { get; set; }
        public string? formate { get; set; }
        public string? headerFormat { get; set; }
        public string? headerFilterFormat { get; set; }
        public string? field { get; set; }
        public string? header { get; set; }
        public bool? isHidden { get; set; }
        public bool? isRequired { get; set; }
        public string? grpName { get; set; }
        public string? description { get; set; }
        public string? settingKey { get; set; }
        public bool? isSysSetting { get; set; }
        public bool? active { get; set; }
        public bool? uppercase { get; set; }
        public DateTime? created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? updated { get; set; }
        public string? modBy { get; set; }
    }

    public enum ControlType
    {
        Text = 0,
        Input = 1,
        Textarea = 2,
        Checkbox = 3,
        Radio = 4,
        ToggleSwitch = 5,
        Image = 6,
        Rating = 7,
        Slider = 8,
        Currency = 9,
        StatusMessage = 10,
        Date = 11,
        CustomDetailControl = 12,
        Dropdown = 13,
        link = 14
    }
}
