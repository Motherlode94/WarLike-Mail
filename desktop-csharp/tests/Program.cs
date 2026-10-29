using WarLike.Mail;
var cases = new Dictionary<string, bool> {
    [NavigationPolicy.Home] = true,
    [NavigationPolicy.Home + "compose"] = true,
    ["https://auth.openai.com/authorize"] = true,
    ["https://warlike-mail.vikktor7.chatgpt.site.evil.test/"] = false,
    ["https://warlike-mail.vikktor7.chatgpt.site@evil.test/"] = false,
    ["https://evil.test@warlike-mail.vikktor7.chatgpt.site/"] = false,
    ["https://warlike-mail.vikktor7.chatgpt.site:444/"] = false,
    ["http://warlike-mail.vikktor7.chatgpt.site/"] = false,
    ["file:///C:/Windows/System32/cmd.exe"] = false,
    ["javascript:alert(1)"] = false,
    ["https://127.0.0.1/"] = false,
    ["https://warlike-mail.vikktor7.chatgpt.site/\nattack"] = false
};
foreach (var (url, expected) in cases) if (NavigationPolicy.Internal(url) != expected) throw new Exception("Navigation policy failed");
if (NavigationPolicy.AppDownload("https://auth.openai.com/file.exe")) throw new Exception("Auth origin cannot provide app downloads");
Console.WriteLine($"{cases.Count + 1} navigation security checks passed.");
