﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Anotar.Serilog;

public class ChocolateyInstaller
{
    ProcessRunner processRunner;
    PowerShellRunner powerShellRunner;
    public Version MinimumChocolateyVersion = new Version(0, 9, 8, 23);

    public ChocolateyInstaller(ProcessRunner processRunner, PowerShellRunner powerShellRunner)
    {
        this.processRunner = processRunner;
        this.powerShellRunner = powerShellRunner;
    }

    public string GetChocolateyPs1Path()
    {
        return Path.Combine(GetInstallPath(), @"chocolateyinstall\chocolatey.ps1");
    }

    public Task<int> InstallChocolatey(Action<string> outputAction, Action<string> errorAction)
    {
        outputAction = outputAction.ValueOrDefault();
        errorAction = errorAction.ValueOrDefault();
        var arguments = @"/c @powershell -NoProfile -ExecutionPolicy unrestricted -Command ""iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))"" && SET PATH=%PATH%;%systemdrive%\chocolatey\bin";
        return processRunner.RunProcess("cmd.exe", arguments, outputAction, errorAction);
    }

    public bool IsInstalled()
    {
        return GetInstallPath() != null;
    }

    public string GetInstallPath()
    {
        var environmentVariable = Environment.GetEnvironmentVariable("ChocolateyInstall");
        if (environmentVariable == null)
        {
            if (Directory.Exists(@"C:\Chocolatey"))
            {
                return @"C:\Chocolatey";
            }
        }
        return environmentVariable;
    }

    public async Task<bool> ChocolateyUpgradeRequired()
    {
        var installVersion = await GetInstalledVersion();
        if (installVersion == null)
        {
            LogTo.Information("Could not determine chocolatey version. Execution will proceed under the assumption the installed version is adequate.");
            return false;
        }
        return installVersion < MinimumChocolateyVersion;
    }

    public async Task<Version> GetInstalledVersion()
    {
        var version = await GetVersionFromRawFile();
        if (version != null)
        {
            return version;
        }
        return await GetVersionFromHelpOutput();
    }

    public async Task<Version> GetVersionFromHelpOutput()
    {
        var output = new List<string>();
        await powerShellRunner.Run(GetChocolateyPs1Path(), null, output.Add, null, null, null);
        return ParseVersionFromHelpOutput(output);
    }

    public static Version ParseVersionFromHelpOutput(List<string> output)
    {
        var lineWithVersion = output.FirstOrDefault(x => x.Contains("chocolatey v"));
        if (lineWithVersion == null)
        {
            return null;
        }
        var versionPart = lineWithVersion.Split(new[]
            {
                "chocolatey v"
            }, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
        if (versionPart == null)
        {
            return null;
        }
        Version version;
        Version.TryParse(versionPart, out version);
        return version;
    }

    public async Task<Version> GetVersionFromRawFile()
    {
        return ParseVersionFromRawFile(GetChocolateyPs1Path());
    }

    public static Version ParseVersionFromRawFile(string filePath)
    {
        var lineWithVersion = File.ReadAllLines(filePath).FirstOrDefault(x => x.Contains("$chocVer = '"));
        if (lineWithVersion == null)
        {
            return null;
        }
      var versionPart = lineWithVersion
          .Replace("$chocVer = '", "")
          .Replace("'", "")
          .Trim()
          .Split(new []{'-'},StringSplitOptions.RemoveEmptyEntries)
          .FirstOrDefault();
        Version version = null;
        if (versionPart != null)
        {
            Version.TryParse(versionPart, out version);
        }
        return version;
    }

}
