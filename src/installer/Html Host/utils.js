/*
 *global variable, and helper methods, used to count how many product selections have changes,
* used later on during the installation for progress reporting
 */

var changedSelections = 0;


function CountSelections(aProdProp)
{
    if ( external.MsiGetProperty(aProdProp) )
        {
            changedSelections++;
        }
    else
        {
            changedSelections--;
        }

     external.MsiSetProperty("CHANGED_SELECTIONS", changedSelections.toString());
}



// NOT used for the moment, new design requires other code
function IncrementSelectionsCount(aProdId)
{
    if ( external.MsiGetProperty(aProdId.substr(1) + '_SEARCH') )
        {
            changedSelections--; // this is the case where the user unchecks and checks back an installed component 
        }
    else
        {
            changedSelections++;
        }

    external.MsiSetProperty("CHANGED_SELECTIONS", changedSelections.toString());
}

// NOT used for the moment, new design requires other code
function DecrementIncrementSelectionsCount(aProdProperty)
{
    if (aProdProperty == "NSB_PROP" && StringIsEmpty(external.MsiGetProperty("NSB_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "NSB_PROP" && external.MsiGetProperty("NSB_SEARCH"))
        changedSelections++;
        
    if (aProdProperty == "SC_PROP" && StringIsEmpty(external.MsiGetProperty("SC_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "SC_PROP" && external.MsiGetProperty("SC_SEARCH"))
        changedSelections++;

   if (aProdProperty == "SI_PROP" && StringIsEmpty(external.MsiGetProperty("SI_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "SI_PROP" && external.MsiGetProperty("SI_SEARCH"))
        changedSelections++;        
      
   if (aProdProperty == "SP_PROP" && StringIsEmpty(external.MsiGetProperty("SP_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "SP_PROP" && external.MsiGetProperty("SP_SEARCH"))
        changedSelections++;        
        
   if (aProdProperty == "SAMP_PROP" && StringIsEmpty(external.MsiGetProperty("SAMP_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "SAMP_PROP" && external.MsiGetProperty("SAMP_SEARCH"))
        changedSelections++;        
        
   if (aProdProperty == "TOOL_PROP" && StringIsEmpty(external.MsiGetProperty("TOOL_SEARCH")))
        changedSelections--;
    else if (aProdProperty == "TOOL_PROP" && external.MsiGetProperty("TOOL_SEARCH"))
        changedSelections++;        
   
    external.MsiSetProperty("CHANGED_SELECTIONS", changedSelections.toString());   
}


function StringIsEmpty(aString)
{
    return (!aString || 0 === aString.length);
}

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
        CountSelections(aProdProperty);
        //IncrementSelectionsCount(aProdId);
    }
    else
    {
            // delete property
        external.MsiSetProperty(aProdProperty, '[~]');
        CountSelections(aProdProperty);
        //DecrementIncrementSelectionsCount(aProdProperty);
    }

  });
}


/*
 * Method used to use uncheck and delete property for a control.
 * Usefull when toogling controls based on another's control state.
 * 
 * example of call:  DeSelectProduct("#controlId", "CONTROL_PROP");
 */
function DeSelectProduct(aProdId, aProdProperty)
{
   if(external.MsiGetProperty(aProdProperty))
    {
        external.MsiSetProperty(aProdProperty, '[~]');
        $(aProdId).removeAttr("checked");
        CountSelections(aProdProperty);
        //DecrementIncrementSelectionsCount(aProdProperty);
    }
}


/*
 * Method used to tick a checknox based on the value of a property.
 *
 * example of call:  TickCheckbox("#checkboId", "CHECKBOX_PROP");
 *
 * note that each product ID and property are the same, except the property names end with "_PROP", 
 * this is MANDATORY for the code to work
 */

function TickCheckbox(aProdId, aProdProperty)
{
    if (external.MsiGetProperty(aProdProperty))
    {
        //alert( external.MsiGetProperty(aProdProperty) );
        $(aProdId).prop('checked', true);
        external.MsiSetProperty(aProdId.substr(1) + '_PROP', 'set');
    }
}

/*
 * Method used to set initial products names, identical with what is on Chocolatey,
 * to be used by the "InstallSelectedApplications" custom action.
 */


function InitProdandRepoNamesProps()
{
    //prod names
    external.MsiSetProperty("NSB_PROD_NAME", 'NServiceBus');
    external.MsiSetProperty("SC_PROD_NAME", 'ServiceControl');
    external.MsiSetProperty("SI_PROD_NAME", 'ServiceInsight');
    external.MsiSetProperty("SP_PROD_NAME", 'ServicePulse');
    external.MsiSetProperty("SM_PROD_NAME", 'ServiceMatrix');

    //repo names
    external.MsiSetProperty("NSB_REPO_NAME", 'Particular/NServiceBus');
    external.MsiSetProperty("SC_REPO_NAME", 'Particular/ServiceControl');
    external.MsiSetProperty("SI_REPO_NAME", 'Particular/ServiceInsight');
    external.MsiSetProperty("SP_REPO_NAME", 'Particular/ServicePulse');
    external.MsiSetProperty("SM_REPO_NAME", 'Particular/ServiceMatrix');
}


/*
 * Method used to enabled/disable SI and SP checkboxes based on SC selection.
 * 
 */

function ToogleSIandSPCheckboxes()
{
  if (this.checked) {
    $("input.ckb").removeAttr("disabled");
  } else {
    $("input.ckb").attr("disabled", true);
    DeSelectProduct("#SI", "SI_PROP");
    DeSelectProduct("#SP", "SP_PROP");
  }
}


/*
 * Method used to enabled/disable SI and SP checkboxes based on SC search, just when the installer is launched.
 */

function LoadToogleSIandSPCheckboxes()
{
  if (external.MsiGetProperty("SC_SEARCH")) {
    $("input.ckb").removeAttr("disabled");
  } else {
    $("input.ckb").attr("disabled", true);
  }
}

// Because IE does not work correctly with Toggle() from jQuery
// The below should work, but still is not. In Chrome it works

function Toggle(aClassname)
{
    var elem = $(aClassname)[0];
    if(elem.style.display == 'none')
         $(aClassname).show();
    else
    {
         $(aClassname).hide();
    }
}

/*
 * The following two methods are used to initialize and control the option for silent UI installs
 */

function InitSilentInstallOption()
{

    if (external.MsiGetProperty("INSTALL_APPS_SILENT"))
    {
        $("#S_INST").prop('checked', true);
    }
}

function SilentInstallOption()
{
    
    $("#S_INST").click(function() {

        if($(this).is(":checked"))
        {
            // set property
            external.MsiSetProperty("INSTALL_APPS_SILENT", 'set');
        }
        else
        {
            // delete property
            external.MsiSetProperty("INSTALL_APPS_SILENT", '[~]');
        }
    });
}


/*
 * Methods used for saving install path in APPDI_SI prop
 * and showing/hiding list of components that can be installed
 */

function DismissChanges()
{
    //TODO by Mark
}

function SetInstallOptions(frame)
{
   alert(frame.InstallPath.value);
   //save root install path
   external.MsiSetProperty("APPDIR_PI", frame.InstallPath.value);

   //show/hide installation components
    // Mark should do this, I tried but could not get it working correctly
    // basically it needs to hide all the other checkboxes from the UI, as visible in
    // the designs from sergio

    // the ID of the checkbox controlling this is SHOW_OPTIONS



}

function InitializeInstallPath()
{
    var elem = document.getElementById("APPDIR_PI");
    elem.value = external.MsiGetProperty("APPDIR_PI");
}


/* 

These methods must be finished by mark, as explained below. Also please uncomment
their calls from the HTML file. 

function SelectAllProducts()
{  // only if no product is already installed
  if (StringIsEmpty(external.MsiGetProperty("NSB_SEARCH")) &&
      StringIsEmpty(external.MsiGetProperty("SC_SEARCH"))  &&
      StringIsEmpty(external.MsiGetProperty("SI_SEARCH"))  &&
      StringIsEmpty(external.MsiGetProperty("SP_SEARCH"))  &&
      StringIsEmpty(external.MsiGetProperty("SM_SEARCH")))
  {
    external.MsiSetProperty('NSB_PROP', 'set');
    external.MsiSetProperty('SC_PROP', 'set');
    external.MsiSetProperty('SI_PROP', 'set');
    external.MsiSetProperty('SP_PROP', 'set');
    external.MsiSetProperty('SM_PROP', 'set');
  }
  else
  {
    // we should show the entire list of products for the user by default
    // showing which is installed and which isn't

    // here Mark should add code to automatically show the detailed list of products
  }
}


function ToogleProducts()
{
    // here mark must hide show products based on the folowing ifs
    if (StringIsEmpty(external.MsiGetProperty("NSB_SEARCH"))

        //hide checkbox with id NSB and show the one with ID NSB_REM
        // else, the other way around

    if (StringIsEmpty(external.MsiGetProperty("SC_SEARCH"))

        //hide checkbox with id SC and show the one with ID SC_REM
        // else, the other way around

    if (StringIsEmpty(external.MsiGetProperty("SI_SEARCH"))

        //hide checkbox with id SI and show the one with ID SI_REM
        // else, the other way around

    if (StringIsEmpty(external.MsiGetProperty("SP_SEARCH"))

        //hide checkbox with id SP and show the one with ID SP_REM
        // else, the other way around

    if (StringIsEmpty(external.MsiGetProperty("SM_SEARCH"))

        //hide checkbox with id SM and show the one with ID SM_REM
        // else, the other way around
}

*/