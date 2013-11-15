/*
 * Method used to set installer properties based user selection
 * from the HTML view.
 *
 * example of call:  SelectProduct("#controlId", "CONTROL_PROP");
 */

function SelectProduct(aProdId, aProdProperty)
{
    $(aProdId).click(function() {

    if($(this).is(":checked"))
    {
        external.MsiSetProperty(aProdProperty, 'set');
    }
    else
    {
            // delete property
        external.MsiSetProperty(aProdProperty, '[~]');
    }

  });
}

/*
 * Method used to tick a checknox based on the value of a property.
 *
 * example of call:  TickCheckbox("#checkboId", "CHECKBOX_PROP");
 */

function TickCheckbox(aProdId, aProdProperty)
{
    if (external.MsiGetProperty(aProdProperty))
    {
        //alert( external.MsiGetProperty(aProdProperty) );
        $(aProdId).prop('checked', true);
    }
}

/*
 * Method used to set initial products names, identical with what is on Chocolatey,
 * to be used by the "InstallSelectedApplications" custom action.
 */


function InitProdandRepoNamesProps()
{
    //prod names
    external.MsiSetProperty("SI_PROD_NAME", 'ServiceInsight');
    external.MsiSetProperty("SC_PROD_NAME", 'ServiceControl');
    external.MsiSetProperty("SP_PROD_NAME", 'ServicePulse');
    external.MsiSetProperty("SM_PROD_NAME", 'ServiceMatrix');


    //repo names
    external.MsiSetProperty("NSB_REPO_NAME", 'Particular/NServiceBus');
    external.MsiSetProperty("SC_REPO_NAME", 'Particular/ServiceControl');
    external.MsiSetProperty("SI_REPO_NAME", 'Particular/ServiceInsight');
    external.MsiSetProperty("SM_REPO_NAME", 'Particular/ServiceMatrix');
    external.MsiSetProperty("SP_REPO_NAME", 'Particular/ServicePulse');
}