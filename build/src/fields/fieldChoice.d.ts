import { IDropdownOption } from "office-ui-fabric-react";
import { IFieldChoice, IFieldChoiceProps, IFieldChoiceState } from "../definitions";
import { BaseField } from ".";
/**
 * Choice field
 */
export declare class FieldChoice extends BaseField<IFieldChoiceProps, IFieldChoiceState> implements IFieldChoice {
    /**
     * Render the field
     */
    renderField: () => any;
    /**
     * Events
     */
    /**
     * The change event for the dropdown list
     * @param option - The dropdown option.
     * @param idx - The dropdown option index.
     */
    protected onChanged: (option: IDropdownOption, idx: number) => void;
    /**
     * The field initialized event
     * @param field - The field.
     * @param state - The current state.
     */
    onFieldInit: (field: any, state: IFieldChoiceState) => void;
    /**
     * Methods
     */
    /**
     * Method to convert the field value to options
     */
    private toOptions;
}
