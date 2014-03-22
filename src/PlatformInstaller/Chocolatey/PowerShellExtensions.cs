using System.Management.Automation.Runspaces;
using System.Text;

public static class PowerShellExtensions
{
    public static string ToExecutableString(this Command command)
    {
        var stringBuilder = new StringBuilder("powershell -executionpolicy unrestricted \"" +command.CommandText);
        foreach (var parameter in command.Parameters)
        {
            if (parameter.Value == null)
            {
                stringBuilder.AppendFormat(" -{0} ", parameter.Name);
            }
            else
            {
                if (parameter.Value is string)
                {
                    stringBuilder.AppendFormat(" -{0} \'{1}\'", parameter.Name, parameter.Value);
                    continue;
                }
                if (parameter.Value is bool)
                {
                    var paramValue = (bool) parameter.Value;
                    if (paramValue)
                    {
                        stringBuilder.AppendFormat(" -{0}", parameter.Name);
                    }
                    continue;
                }
                stringBuilder.AppendFormat(" -{0} {1}", parameter.Name, parameter.Value);
            }
        }
        stringBuilder.Append("\"");
        return stringBuilder.ToString();
    }
}