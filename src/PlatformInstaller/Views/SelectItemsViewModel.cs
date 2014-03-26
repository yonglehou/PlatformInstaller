using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Caliburn.Micro;

public class SelectItemsViewModel : Screen
{
    public SelectItemsViewModel(PackageDefinitionService packageDefinitionDiscovery, IEventAggregator eventAggregator)
    {
        this.eventAggregator = eventAggregator;
        PackageDefinitions = packageDefinitionDiscovery
            .GetPackages()
            .Select(x=>new PackageDefinitionBindable
            {
                ImageUrl ="pack://application:,,,/PlatformInstaller;component" + x.Image,
                Installed = x.IsInstalledAction(),
                Name = x.Name,
            }).ToList();
        PackageDefinitions.BindActionToPropChanged(() =>
        {
            IsInstallEnabled = PackageDefinitions.Any(p => p.Selected);
        }, "Selected");
    }
    

    public bool IsInstallEnabled;
    IEventAggregator eventAggregator;
    public List<PackageDefinitionBindable> PackageDefinitions;

    public void Install()
    {
        var selectedItems = PackageDefinitions.Where(p => p.Selected).Select(x => x.Name).ToList();
        var runInstallEvent = new RunInstallEvent
        {
            SelectedItems = selectedItems
        };
        eventAggregator.Publish(runInstallEvent);
    }

    public void Close()
    {
        eventAggregator.Publish<CloseApplicationEvent>();
    }

    public class PackageDefinitionBindable : INotifyPropertyChanged
    {

        public string Name;
        public string ImageUrl;
        public bool Selected;
        public bool Installed;
        public event PropertyChangedEventHandler PropertyChanged;

    }
}