﻿using System;
using System.Diagnostics;
using System.Reflection;

public class VersionFinder
{
    public static string GetVersion()
    {
        var type = typeof(VersionFinder);

        if (!String.IsNullOrEmpty(type.Assembly.Location))
        {
            var fileVersion = FileVersionInfo.GetVersionInfo(type.Assembly.Location);

            return new Version(fileVersion.FileMajorPart, fileVersion.FileMinorPart, fileVersion.FileBuildPart).ToString(3);
        }

        var customAttributes = type.Assembly.GetCustomAttributes(typeof(AssemblyFileVersionAttribute), false);

        if (customAttributes.Length >= 1)
        {
            var fileVersion = (AssemblyFileVersionAttribute) customAttributes[0];
            Version version;
            if (Version.TryParse(fileVersion.Version, out version))
            {
                return version.ToString(3);
            }
        }

        return type.Assembly.GetName().Version.ToString(3);
    }
}