import * as React from "react";
import { SPTypes, Types } from "gd-sprest";
import { PrimaryButton } from "office-ui-fabric-react";
import { Components, WebParts } from "../build";
declare var SP;

/**
 * List Item Information
 */
export interface IListItem extends Types.SP.IListItemQueryResult {
    Attachments?: boolean;
    TestBoolean?: boolean;
    TestChoice?: string;
    TestDate?: string;
    TestDateTime?: string;
    TestLookup?: Types.SP.ComplexTypes.FieldLookupValue;
    TestLookupId?: string | number;
    TestMultiChoice?: string;
    TestMultiLookup?: string;
    TestMultiLookupId?: string;
    TestMultiUser?: { results: Array<number> };
    TestMultiUserId?: Array<number>;
    TestNote?: string;
    TestNumberDecimal?: number;
    TestNumberInteger?: number;
    TestUrl?: Types.SP.ComplexTypes.FieldUrlValue;
    TestUser?: Types.SP.ComplexTypes.FieldUserValue;
    TestUserId?: string | number;
    Title?: string;
}

/**
 * State
 */
export interface IListWebPartState extends WebParts.Types.IWebPartSearchState {
    controlMode?: number;
    errorMessage?: string;
    item?: IListItem;
}

/**
 * List WebPart
 */
export class ListWebpart extends WebParts.WebPartSearch<WebParts.Types.IWebPartSearchProps, IListWebPartState> {
    private _itemForm: Components.ItemForm = null;
    private _panel: Components.Panel = null;

    /**
     * Constructor
     */
    constructor(props) {
        super(props);

        // Enable caching
        this._cacheFl = true;

        // Update the query
        this._query.Expand = ["AttachmentFiles", "TestLookup", "TestMultiLookup", "TestMultiUser", "TestUser"];
        this._query.OrderBy = ["Title"];
        this._query.Select = ["*", "Attachments", "AttachmentFiles", "TestLookup/ID", "TestLookup/Title", "TestMultiLookup/ID", "TestMultiLookup/Title", "TestMultiUser/ID", "TestMultiUser/Title", "TestUser/ID", "TestUser/Title"];
    }

    // The render container event
    onRenderContainer = (items) => {
        let elItems = [];

        // Ensure items exist
        if (items && items.length > 0) {
            // Parse the items
            for (let i = 0; i < items.length; i++) {
                // Add the item
                elItems.push(this.onRenderItem(items[i]));
            }

            // Return the container
            return (
                <div className="list">
                    {elItems}
                    <div className="list-row" key="item_form">
                        <Components.Panel
                            headerText="Item Form"
                            onRenderFooterContent={this.renderFooter}
                            ref={panel => { this._panel = panel; }}>
                            <div className="">{this.state.errorMessage || ""}</div>
                            <Components.ItemForm
                                cacheKey="SPReactDemoListForm"
                                controlMode={this.state.controlMode}
                                item={this.state.item}
                                listName={this.props.cfg.ListName}
                                ref={form => { this._itemForm = form; }}
                                showAttachments={true}
                            />
                        </Components.Panel>
                    </div>
                </div>
            );
        }

        // Not items exist
        return (
            <div className="empty-list">No items exist...</div>
        );
    }

    // The render item event
    onRenderItem = (item: IListItem) => {
        // Return the item
        return (
            <div className="list-row" key={"item_" + item.Id}>
                <div className="list-col-button">
                    <PrimaryButton text="View" data-itemid={item.Id} onClick={this.viewItem} />
                </div>
                <div className="list-col-button">
                    <PrimaryButton text="Edit" data-itemid={item.Id} onClick={this.editItem} />
                </div>
                <div className="list-col">
                    {item.Title ? item.Title : ""}
                </div>
                <div className="list-col">
                    {item.TestChoice ? item.TestChoice : ""}
                </div>
                <div className="list-col">
                    {item.TestDate ? item.TestDate : ""}
                </div>
                <div className="list-col">
                    {item.TestUrl ? item.TestUrl.Description : ""}
                </div>
                <div className="list-col">
                    {item.TestUser ? item.TestUser.Title : ""}
                </div>
            </div>
        );
    }

    /**
     * Methods
     */

    // Method to edit the item
    private editItem = (el: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        el.preventDefault();

        // Clear the selected item
        this.setState({
            controlMode: SPTypes.ControlMode.Edit,
            item: this.getItem(parseInt(el.currentTarget.getAttribute("data-itemid")))
        }, () => {
            // Show the panel
            this._panel.show();
        });
    }

    // Method to get the item
    private getItem = (itemId) => {
        // Parse the items
        for (let i = 0; i < this.state.items.length; i++) {
            let item = this.state.items[i];

            // See if this is the target item
            if (itemId == item.Id) {
                // Return the item
                return item;
            }
        }

        // Item not found
        return null;
    }

    // Method to render the footer
    private renderFooter = () => {
        return (
            <div className="save-button">
                <PrimaryButton
                    onClick={this.save}
                    text="Save"
                />
            </div>
        );
    }

    // Method to save the item
    private save = () => {
        // Show a save dialog
        SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showWaitScreenWithNoClose", "Saving the Item", "This dialog will close after the request completes.");

        // Save the item
        let a
        this._itemForm.save<IListItem>().then(item => {
            // Close the dialog
            SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.commonModalDialogClose");
        });
    }

    // Method to view the item
    private viewItem = (el: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent postback
        el.preventDefault();

        // Clear the selected item
        this.setState({
            controlMode: SPTypes.ControlMode.Display,
            item: this.getItem(parseInt(el.currentTarget.getAttribute("data-itemid")))
        }, () => {
            // Show the panel
            this._panel.show();
        });
    }
}