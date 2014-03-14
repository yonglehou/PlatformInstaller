using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using NuGet;

public class PackageManager
{
    PowerShellRunner powerShellRunner;

    public PackageManager(PowerShellRunner powerShellRunner)
    {
        this.powerShellRunner = powerShellRunner;
    }

    public async Task Install(string packageName)
    {
        var parameters = new Dictionary<string, object>
        {
                {"command", "install"},
                {"packageNames", packageName},
                {"source", @"C:\ChocolateyResourceCache;http://chocolatey.org/api/v2"},
                {"verbosity", true},
                {"pre", true}
        };
        await powerShellRunner.Run(@"C:\Chocolatey\chocolateyinstall\chocolatey.ps1", parameters);
    }

    public Task Uninstall(string packageName)
    {
        var parameters = new Dictionary<string, object>
        {
                {"command", "uninstall"},
                {"packageNames", packageName}
        };
        return powerShellRunner.Run(@"C:\Chocolatey\chocolateyinstall\chocolatey.ps1", parameters);
    }
    public bool TryGetInstalledVersion(string packageName, out SemanticVersion version)
    {
        version = null;
        foreach (var directory in Directory.EnumerateDirectories(@"C:\Chocolatey\lib", packageName + ".*"))
        {
            var versionString = Path.GetFileName(directory).ReplaceCaseless(packageName +".","");
            SemanticVersion newVersion;
            if (SemanticVersion.TryParse(versionString, out newVersion))
            {
                if (version == null || newVersion > version)
                {
                    version = newVersion;
                }
            }
        }
        return version != null;
    }
    public bool IsInstalled(string packageName)
    {
        SemanticVersion version;
        return TryGetInstalledVersion(packageName, out version);
    }
}

