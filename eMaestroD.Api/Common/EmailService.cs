using System.Net.Mail;
using System.Net;
using System.Net.Mime;

namespace eMaestroD.Api.Common;
public class EmailService : IEmailService
{
    public void SendEmail(string toEmail, string subject, string body)
    {
        using (var client = new SmtpClient())
        {
            client.Host = "smtp.gmail.com";
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("ali.raza@logicaltechnologist.com", "Raza@1234");
            client.Port = 587;
            client.EnableSsl = true;

            var message = new MailMessage
            {
                From = new MailAddress("no_reply@logicalTechnologist.com", "eMaestro"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            message.To.Add(toEmail);

            client.Send(message);
        }
    }

    public void SendEmailWithAttachment(string toEmail, string subject, string body, string attachmentPath)
    {
        using (var client = new SmtpClient())
        {
            client.Host = "smtp.gmail.com";
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("ali.raza@logicaltechnologist.com", "Raza@1234");
            client.Port = 587;
            client.EnableSsl = true;

            var message = new MailMessage
            {
                From = new MailAddress("no_reply@logicalTechnologist.com", "eMaestro"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            var attachment = new Attachment(attachmentPath, MediaTypeNames.Application.Pdf);
            message.Attachments.Add(attachment);

            client.Send(message);
        }
    }


}

public interface IEmailService
{
    void SendEmail(string toEmail, string subject, string body);
    public void SendEmailWithAttachment(string to, string subject, string body, string attachmentPath);
}

