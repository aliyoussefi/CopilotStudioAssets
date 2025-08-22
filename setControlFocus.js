/**
 * Sets focus to a specific control on a Dynamics 365 form
 * @param {Object} executionContext - The execution context containing formContext
 * @param {string} controlName - The logical name of the control to set focus to
 * @returns {boolean} - Returns true if focus was set successfully, false otherwise
 */
function setControlFocus(executionContext, controlName) {
    try {
        // Get the form context from execution context
        const formContext = executionContext.getFormContext();
        
        // Validate inputs
        if (!formContext) {
            console.error("Form context is not available");
            return false;
        }
        
        if (!controlName || typeof controlName !== 'string') {
            console.error("Control name must be a valid string");
            return false;
        }
        
        // Get the control by name
        const control = formContext.getControl(controlName);
        
        if (!control) {
            console.error(`Control '${controlName}' not found on the form`);
            return false;
        }
        
        // Check if the control is visible and enabled
        if (!control.getVisible()) {
            console.warn(`Control '${controlName}' is not visible`);
            return false;
        }
        
        // Set focus to the control
        control.setFocus();
        console.log(`Focus set to control: ${controlName}`);
        return true;
        
    } catch (error) {
        console.error(`Error setting focus to control '${controlName}':`, error);
        return false;
    }
}

/**
 * Alternative function that works with formContext directly (for ribbon buttons or other scenarios)
 * @param {Object} formContext - The form context object
 * @param {string} controlName - The logical name of the control to set focus to
 * @returns {boolean} - Returns true if focus was set successfully, false otherwise
 */
function setControlFocusWithFormContext(formContext, controlName) {
    try {
        // Validate inputs
        if (!formContext) {
            console.error("Form context is required");
            return false;
        }
        
        if (!controlName || typeof controlName !== 'string') {
            console.error("Control name must be a valid string");
            return false;
        }
        
        // Get the control by name
        const control = formContext.getControl(controlName);
        
        if (!control) {
            console.error(`Control '${controlName}' not found on the form`);
            return false;
        }
        
        // Check if the control is visible
        if (!control.getVisible()) {
            console.warn(`Control '${controlName}' is not visible`);
            return false;
        }
        
        // Set focus to the control
        control.setFocus();
        console.log(`Focus set to control: ${controlName}`);
        return true;
        
    } catch (error) {
        console.error(`Error setting focus to control '${controlName}':`, error);
        return false;
    }
}

/**
 * Sets focus to the first available control from a list of control names
 * Useful when you have multiple possible controls and want to focus on the first available one
 * @param {Object} executionContext - The execution context containing formContext
 * @param {Array<string>} controlNames - Array of control names to try
 * @returns {string|null} - Returns the name of the control that received focus, or null if none
 */
function setFocusToFirstAvailableControl(executionContext, controlNames) {
    try {
        const formContext = executionContext.getFormContext();
        
        if (!formContext) {
            console.error("Form context is not available");
            return null;
        }
        
        if (!Array.isArray(controlNames) || controlNames.length === 0) {
            console.error("Control names must be a non-empty array");
            return null;
        }
        
        for (const controlName of controlNames) {
            const control = formContext.getControl(controlName);
            
            if (control && control.getVisible()) {
                control.setFocus();
                console.log(`Focus set to control: ${controlName}`);
                return controlName;
            }
        }
        
        console.warn("No available controls found to set focus");
        return null;
        
    } catch (error) {
        console.error("Error setting focus to available controls:", error);
        return null;
    }
}

/**
 * Sets focus to a control within a specific tab
 * @param {Object} executionContext - The execution context containing formContext
 * @param {string} tabName - The name of the tab
 * @param {string} controlName - The logical name of the control to set focus to
 * @returns {boolean} - Returns true if focus was set successfully, false otherwise
 */
function setControlFocusInTab(executionContext, tabName, controlName) {
    try {
        const formContext = executionContext.getFormContext();
        
        if (!formContext) {
            console.error("Form context is not available");
            return false;
        }
        
        // Get the tab
        const tab = formContext.ui.tabs.get(tabName);
        if (!tab) {
            console.error(`Tab '${tabName}' not found`);
            return false;
        }
        
        // Expand the tab if it's collapsed
        if (!tab.getDisplayState() === "expanded") {
            tab.setDisplayState("expanded");
        }
        
        // Set focus to the control
        return setControlFocusWithFormContext(formContext, controlName);
        
    } catch (error) {
        console.error(`Error setting focus to control '${controlName}' in tab '${tabName}':`, error);
        return false;
    }
}

// Example usage:
/*
// In a form event handler (OnLoad, OnSave, etc.)
function onFormLoad(executionContext) {
    // Set focus to the 'name' field
    setControlFocus(executionContext, "name");
}

// In a ribbon button command
function onRibbonButtonClick(primaryControl) {
    // Set focus to the 'emailaddress1' field
    setControlFocusWithFormContext(primaryControl, "emailaddress1");
}

// Set focus to first available contact method
function focusOnContactMethod(executionContext) {
    const contactControls = ["telephone1", "emailaddress1", "mobilephone"];
    setFocusToFirstAvailableControl(executionContext, contactControls);
}

// Set focus to a control in a specific tab
function focusOnAddressTab(executionContext) {
    setControlFocusInTab(executionContext, "SUMMARY_TAB", "address1_line1");
}
*/
