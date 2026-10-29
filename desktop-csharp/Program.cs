namespace WarLike.Mail;
internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MailWindow(NavigationPolicy.Home));
    }
}
