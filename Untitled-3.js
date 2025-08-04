/**
 * Dataverse JavaScript functions for Power Platform integration
 * This script contains functions to work with XRM namespace and handle API calls
 */

// Main namespace for our custom functions
var PowerPlatformUtils = PowerPlatformUtils || {};

/**
 * Sets focus to a specific control on the form
 * @param {Object} executionContext - The execution context passed from the form event
 * @param {string} controlName - The name of the control to set focus to
 */
PowerPlatformUtils.setControlFocus = function(executionContext, controlName) {
    try {
        // Get the form context
        var formContext = executionContext.getFormContext();
        
        // Get the control
        var control = formContext.getControl(controlName);
        
        if (control) {
            // Set focus to the control
            control.setFocus();
            console.log("Focus set to control: " + controlName);
        } else {
            console.warn("Control not found: " + controlName);
        }
    } catch (error) {
        console.error("Error setting focus to control: " + error.message);
    }
};

/**
 * Makes an XHR request to get bot application insights configuration
 * @param {Object} executionContext - The execution context passed from the form event
 */
PowerPlatformUtils.getBotInsightsConfiguration = function(executionContext) {
    try {
        var formContext = executionContext.getFormContext();
        
        // The API endpoint URL
        var apiUrl = "https://powervamg.us-il108.gateway.prod.island.powerapps.com/api/botmanagement/2022-01-15/environments/01b5cf34-eeb7-e5dd-8e96-1f07f7a3e814/bots/50ffbcdd-125c-f011-bec1-00224809fb4c/applicationinsightsconfiguration";
        
        // Create XMLHttpRequest
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", apiUrl, true);
        
        // Set headers if needed (you may need to add authentication headers)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        
        // Handle the response
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        // Parse the JSON response
                        var response = JSON.parse(xhr.responseText);
                        console.log("Bot Insights Configuration retrieved successfully:", response);
                        
                        // Process the response data
                        PowerPlatformUtils.processBotInsightsResponse(formContext, response);
                        
                    } catch (parseError) {
                        console.error("Error parsing response:", parseError.message);
                        Xrm.Navigation.openErrorDialog({
                            message: "Failed to parse API response: " + parseError.message
                        });
                    }
                } else {
                    console.error("HTTP Error:", xhr.status, xhr.statusText);
                    Xrm.Navigation.openErrorDialog({
                        message: "API request failed with status: " + xhr.status + " - " + xhr.statusText
                    });
                }
            }
        };
        
        // Handle network errors
        xhr.onerror = function() {
            console.error("Network error occurred while making the request");
            Xrm.Navigation.openErrorDialog({
                message: "Network error occurred. Please check your connection and try again."
            });
        };
        
        // Send the request
        xhr.send();
        
    } catch (error) {
        console.error("Error making XHR request:", error.message);
        Xrm.Navigation.openErrorDialog({
            message: "Error occurred: " + error.message
        });
    }
};

/**
 * Processes the bot insights configuration response
 * @param {Object} formContext - The form context
 * @param {Object} response - The parsed response data
 */
PowerPlatformUtils.processBotInsightsResponse = function(formContext, response) {
    try {
        // Example of processing the response data
        // You can customize this based on your specific needs
        
        if (response) {
            console.log("Processing bot insights configuration...");
            
            // Example: Update form fields with response data
            if (response.instrumentationKey) {
                // Set a field value if it exists on the form
                var instrumentationKeyField = formContext.getAttribute("new_instrumentationkey");
                if (instrumentationKeyField) {
                    instrumentationKeyField.setValue(response.instrumentationKey);
                }
            }
            
            if (response.applicationId) {
                var applicationIdField = formContext.getAttribute("new_applicationid");
                if (applicationIdField) {
                    applicationIdField.setValue(response.applicationId);
                }
            }
            
            // Show success notification
            Xrm.Navigation.openAlertDialog({
                confirmButtonLabel: "OK",
                text: "Bot insights configuration loaded successfully!"
            });
        }
        
    } catch (error) {
        console.error("Error processing bot insights response:", error.message);
    }
};

/**
 * Form OnLoad event handler - registers the main functions
 * @param {Object} executionContext - The execution context from the form event
 */
PowerPlatformUtils.onFormLoad = function(executionContext) {
    try {
        console.log("Form loaded - PowerPlatformUtils initialized");
        
        // Get the form context
        var formContext = executionContext.getFormContext();
        
        // Automatically load bot insights configuration on form load
        PowerPlatformUtils.getBotInsightsConfiguration(executionContext);
        
        // Example: Set focus to a specific control after form loads
        // Uncomment and modify the control name as needed
        // setTimeout(function() {
        //     PowerPlatformUtils.setControlFocus(executionContext, "name");
        // }, 1000);
        
    } catch (error) {
        console.error("Error in form load handler:", error.message);
    }
};

/**
 * Alternative function to make the API call with Fetch API (modern approach)
 * @param {Object} executionContext - The execution context passed from the form event
 */
PowerPlatformUtils.getBotInsightsConfigurationFetch = function(executionContext) {
    try {
        var formContext = executionContext.getFormContext();
        
        var apiUrl = "https://powervamg.us-il108.gateway.prod.island.powerapps.com/api/botmanagement/2022-01-15/environments/01b5cf34-eeb7-e5dd-8e96-1f07f7a3e814/bots/50ffbcdd-125c-f011-bec1-00224809fb4c/applicationinsightsconfiguration";
        
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                // Add authentication headers as needed
            }
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            console.log("Bot Insights Configuration retrieved successfully:", data);
            PowerPlatformUtils.processBotInsightsResponse(formContext, data);
        })
        .catch(function(error) {
            console.error("Error:", error);
            Xrm.Navigation.openErrorDialog({
                message: "Error occurred: " + error.message
            });
        });
        
    } catch (error) {
        console.error("Error making Fetch request:", error.message);
    }
};

// Export functions for use in Power Platform
// Register the onFormLoad function to be called when the form loads