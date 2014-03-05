﻿using System;
using System.Threading.Tasks;
using PropertyChanged;

namespace PlatformInstaller
{
    [ImplementPropertyChanged]
    public class MainViewModel
    {
        public string OutputText { get; set; }
        public bool CanInstall = true;

        public async void InstallServiceInsight()
        {
            await InstallPackage("ServiceInsight.install");
        }
        public bool CanInstallServiceInsight
        {
            get { return CanInstall; }
        }

        public async void InstallServiceControl()
        {
            await InstallPackage("ServiceControl.install");
        }
        public bool CanInstallServiceControl
        {
            get { return CanInstall; }
        }

        public async void InstallServicePulse()
        {
            await InstallPackage("ServicePulse.install");
        }
        public bool CanInstallServicePulse
        {
            get { return CanInstall; }
        }

        public async void InstallServiceMatrix()
        {
            await InstallPackage("ServiceMatrix.install");
        }
        public bool CanInstallServiceMatrix
        {
            get { return CanInstall; }
        }

        public async void InstallMsmq()
        {
            await InstallPackage("NServicebus.Msmq.install");
        }

        public bool CanInstallMsmq
        {
            get { return CanInstall; }
        }

        public async void InstallDtc()
        {
            await InstallPackage("NServicebus.Dtc.install");
        }
        public bool CanInstallDtc
        {
            get { return CanInstall; }
        }
        public async void InstallPerfCounters()
        {
            await InstallPackage("NServicebus.PerfCounters.install");
        }

        public bool CanInstallPerfCounters
        {
            get { return CanInstall; }
        }

        public async void InstallRavenDb()
        {
            await InstallPackage("RavenDB");
        }
        public bool CanInstallRavenDb
        {
            get { return CanInstall; }
        }

        async Task InstallPackage(string packageName)
        {
            OutputText = "";
            CanInstall = false;
            var packageInstaller = new PackageManager(packageName)
            {
                OutputDataReceived = s => { OutputText += s + Environment.NewLine; }
            };
            await packageInstaller.Install();
            CanInstall = true;
        }

    }
}