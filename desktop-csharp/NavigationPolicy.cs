namespace WarLike.Mail;

public static class NavigationPolicy
{
    public const string Home = "https://warlike-mail.vikktor7.chatgpt.site/";
    private static readonly HashSet<string> Apps = new(StringComparer.OrdinalIgnoreCase) {
        "warlike-mail.vikktor7.chatgpt.site", "warlike-server.vikktor7.chatgpt.site"
    };
    private static readonly HashSet<string> Auth = new(StringComparer.OrdinalIgnoreCase) {
        "chatgpt.com", "auth.openai.com", "auth0.openai.com", "accounts.google.com",
        "login.microsoftonline.com", "appleid.apple.com"
    };
    public static bool SafeHttps(string? value, out Uri? uri)
    {
        uri = null;
        if (string.IsNullOrEmpty(value) || value.Length > 8192 || value.Any(char.IsControl) ||
            !Uri.TryCreate(value, UriKind.Absolute, out var candidate) || candidate.Scheme != Uri.UriSchemeHttps ||
            !candidate.IsDefaultPort || candidate.UserInfo.Length != 0 || candidate.HostNameType != UriHostNameType.Dns) return false;
        uri = candidate; return true;
    }
    public static bool Internal(string? value) => SafeHttps(value, out var uri) && (Apps.Contains(uri!.IdnHost) || Auth.Contains(uri.IdnHost));
    public static bool AppDownload(string? value) => SafeHttps(value, out var uri) && Apps.Contains(uri!.IdnHost);
}
