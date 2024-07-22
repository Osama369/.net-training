namespace eMaestroD.Api.Hub
{
    public class Notification
    {
        public int? comID { get; set; }
        public string tenantID { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string voucherNo { get; set; }
        public string message { get; set; }
        public DateTime createdDate { get; set; }
        public bool active { get; set; }
    }

    public interface INotificationHub
    {
        public Task SendMessage(Notification notification);
    }
}
