import * as React from "react";
import { Checkbox, ICheckboxProps, Label } from "office-ui-fabric-react";
import { BaseField } from "../../common";
import { IFieldBoolean, IFieldBooleanProps, IFieldBooleanState } from "../../definitions";

/**
 * Boolean field
 */
export class FieldBoolean extends BaseField<IFieldBooleanProps, IFieldBooleanState> implements IFieldBoolean {
    // Render the field
    renderField() {
        // Update the checkbox properties
        let props: ICheckboxProps = this.props.props || {};
        props.checked = this.getValue();
        props.onChange = this.onChange;

        // Render the component
        return (
            <div>
                <Label ref="label">{props.label || this.state.label}</Label>
                <Checkbox {...props as any} ref="checkbox" />
            </div>
        );
    }

    // Method to get the value
    private getValue = () => {
        // Get the field value
        let value = this.getFieldValue();

        // Return a boolean value
        return typeof (value) === "boolean" ? value : false;
    }

    // The on change event
    private onChange = (ev: React.MouseEvent<HTMLInputElement>, checked: boolean) => {
        // Update the value
        this.updateValue(checked);
    }
}