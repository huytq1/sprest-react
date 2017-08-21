import * as React from "react";
import { SPTypes, Types } from "gd-sprest";
import { Dropdown, IDropdownOption, IDropdownProps } from "office-ui-fabric-react";
import { BaseField } from "../../common";
import { IFieldChoice, IFieldChoiceProps, IFieldChoiceState } from "../../definitions";

/**
 * Choice field
 */
export class FieldChoice extends BaseField<IFieldChoiceProps, IFieldChoiceState> implements IFieldChoice {
    /**
     * Public Interface
     */

    // Render the field
    renderField() {
        // Update the properties
        let props: IDropdownProps = this.props.props || {};
        props.errorMessage = props.errorMessage ? props.errorMessage : this.state.fieldInfo.errorMessage;
        props.errorMessage = this.state.showErrorMessage ? (props.selectedKey ? "" : props.errorMessage) : "";
        props.label = props.label || this.state.label;
        props.multiSelect = this.state.fieldInfo.multiChoice;
        props.onChanged = this.onChanged;
        props.options = this.state.options;
        props.required = props.required || this.state.fieldInfo.required;

        // See if this is a multi-choice
        if (props.multiSelect) {
            // Set the selected keys
            props.selectedKeys = this.state.value.results;
        } else {
            // Set the selected key
            props.selectedKey = this.state.value;
        }

        // Return the dropdown
        return (
            <Dropdown {...props} ref="choice" />
        );
    }

    /**
     * Events
     */

    // The change event for the dropdown list
    protected onChanged = (option: IDropdownOption, idx: number) => {
        // See if this is a multi-choice field
        if (this.state.fieldInfo.multiChoice) {
            let fieldValue = this.state.value;

            // Append the option if it was selected
            if (option.selected) {
                fieldValue.results.push(option.key);
            } else {
                // Parse the results
                for (let i = 0; i < fieldValue.results.length; i++) {
                    if (fieldValue.results[i] == option.key) {
                        // Remove the selected option
                        fieldValue.results.splice(i, 1);
                        break;
                    }
                }
            }

            // Update the field value
            this.updateValue(fieldValue);
        } else {
            // Update the field value
            this.updateValue(option.selected ? option.key : null);
        }
    }

    // The field initialized event
    onFieldInit = (field: any, state: IFieldChoiceState) => {
        let choiceField = field as Types.IFieldChoice;

        // Ensure this is a choice field
        if (field.FieldTypeKind != SPTypes.FieldType.Choice && field.FieldTypeKind != SPTypes.FieldType.MultiChoice) {
            // Log
            console.warn("[gd-sprest] The field '" + field.InternalName + "' is not a choice field.");
            return;
        }

        // Update the state
        state.fieldInfo.choices = choiceField.Choices;
        state.fieldInfo.multiChoice = choiceField.FieldTypeKind == SPTypes.FieldType.MultiChoice;
        state.options = this.toOptions();

        // See if the default value is provided
        if (this.props.defaultValue) {
            // Set the value
            state.value = this.props.defaultValue;
        }
        // Else, see if this is a new form, and a default value exists
        else if (this.props.controlMode == SPTypes.ControlMode.New && choiceField.DefaultValue) {
            // Set the value
            state.value = state.fieldInfo.multiChoice ? { results: [choiceField.DefaultValue] } : choiceField.DefaultValue;
        } else {
            // Set the default value
            state.value = state.fieldInfo.multiChoice ? { results: [] } : null;
        }
    }

    /**
     * Methods
     */

    // Method to convert the options to a multi-choice field value
    private toFieldValue = (options: Array<IDropdownOption> = []) => {
        let results = [];

        // Parse the options
        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            // See if this option is selected
            if (option.selected) {
                // Add the result
                results.push(option.key);
            }
        }

        // Return the field value
        return { results };
    }

    // Method to convert the field value to options
    private toOptions = () => {
        let options: Array<IDropdownOption> = [];

        // See if this is not a required multi-choice field
        if (!this.state.fieldInfo.required && !this.state.fieldInfo.multiChoice) {
            // Add a blank option
            options.push({
                key: null,
                text: ""
            });
        }

        // Parse the choices
        for (let i = 0; i < this.state.fieldInfo.choices.results.length; i++) {
            let choice = this.state.fieldInfo.choices.results[i];

            // Add the option
            options.push({
                key: choice,
                text: choice
            });
        }

        // Return the options
        return options;
    }
}