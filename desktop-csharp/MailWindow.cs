using System.Diagnostics;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
namespace WarLike.Mail;

public sealed class MailWindow : Form
{
    private readonly WebView2 view = new() { Dock = DockStyle.Fill };
    private readonly Label status = new() { Dock = DockStyle.Bottom, AutoSize = false, Height = 27, Padding = new Padding(8, 4, 0, 0), Text = "Connexion à WarLike…" };
    private readonly string start;
    private static Task<CoreWebView2Environment>? environment;
    private Task? initialization;
    public MailWindow(string start)
    {
        if (!NavigationPolicy.Internal(start)) throw new ArgumentException("Adresse non autorisée.");
        this.start = start; Text = "WarLike Mail"; Width = 1440; Height = 920; MinimumSize = new Size(600, 580);
        var menu = new MenuStrip();
        var file = new ToolStripMenuItem("Fichier");
        file.DropDownItems.Add("Nouveau message", null, (_, _) => new MailWindow(NavigationPolicy.Home + "compose").Show());
        file.DropDownItems.Add("Ouvrir dans le navigateur", null, (_, _) => External(NavigationPolicy.Home));
        file.DropDownItems.Add("Quitter", null, (_, _) => Close());
        var edit = new ToolStripMenuItem("Édition");
        edit.DropDownItems.Add("Copier", null, (_, _) => view.CoreWebView2?.CallDevToolsProtocolMethodAsync("Input.dispatchKeyEvent", "{\"type\":\"keyDown\",\"key\":\"c\",\"modifiers\":2,\"windowsVirtualKeyCode\":67}"));
        var display = new ToolStripMenuItem("Affichage");
        display.DropDownItems.Add("Actualiser", null, (_, _) => view.Reload());
        display.DropDownItems.Add("Zoom avant", null, (_, _) => view.ZoomFactor = Math.Min(2, view.ZoomFactor + 0.1));
        display.DropDownItems.Add("Zoom arrière", null, (_, _) => view.ZoomFactor = Math.Max(0.7, view.ZoomFactor - 0.1));
        menu.Items.AddRange([file, edit, display]); MainMenuStrip = menu;
        Controls.Add(view); Controls.Add(status); Controls.Add(menu);
        Shown += async (_, _) => { try { await Initialize(); } catch { status.Text = "Microsoft Edge WebView2 est requis. Utilise aussi « Ouvrir dans le navigateur »."; } };
        FormClosed += (_, _) => view.Dispose();
    }
    private Task Initialize() => initialization ??= InitializeCore();
    private async Task InitializeCore()
    {
        var profile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WarLike", "MailNative");
        environment ??= CoreWebView2Environment.CreateAsync(null, profile);
        await view.EnsureCoreWebView2Async(await environment);
        var core = view.CoreWebView2; var settings = core.Settings;
        settings.AreHostObjectsAllowed = false; settings.IsWebMessageEnabled = false;
        settings.IsPasswordAutosaveEnabled = false; settings.IsGeneralAutofillEnabled = false;
        settings.AreDevToolsEnabled = false;
        core.PermissionRequested += (_, e) => e.State = CoreWebView2PermissionState.Deny;
        core.ServerCertificateErrorDetected += (_, e) => e.Action = CoreWebView2ServerCertificateErrorAction.Cancel;
        core.NavigationStarting += (_, e) => { if (!NavigationPolicy.Internal(e.Uri)) { e.Cancel = true; if (e.IsUserInitiated) External(e.Uri); } };
        core.FrameNavigationStarting += (_, e) => { if (!NavigationPolicy.Internal(e.Uri)) e.Cancel = true; };
        core.DownloadStarting += (_, e) => { if (!NavigationPolicy.AppDownload(e.DownloadOperation.Uri)) e.Cancel = true; };
        core.NewWindowRequested += async (_, e) => {
            e.Handled = true;
            if (!NavigationPolicy.Internal(e.Uri)) { if (e.IsUserInitiated) External(e.Uri); return; }
            using var deferral = e.GetDeferral();
            var child = new MailWindow(e.Uri); child.Show();
            try { await child.Initialize(); e.NewWindow = child.view.CoreWebView2; } catch { child.Close(); }
        };
        core.NavigationCompleted += (_, e) => status.Text = e.IsSuccess ? "WarLike Mail · Connexion HTTPS · Aucun accès natif exposé aux pages" : "Chargement interrompu. Actualise ou utilise le navigateur.";
        core.ProcessFailed += (_, _) => status.Text = "Le moteur d’affichage s’est arrêté. Ferme puis rouvre cette fenêtre.";
        core.Navigate(start);
    }
    private static void External(string value)
    {
        if (!NavigationPolicy.SafeHttps(value, out var uri)) return;
        try { Process.Start(new ProcessStartInfo(uri!.AbsoluteUri) { UseShellExecute = true }); } catch { }
    }
}
