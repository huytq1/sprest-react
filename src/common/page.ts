import { ContextInfo } from "gd-sprest";
import { Promise } from "es6-promise";
declare var MSOWebPartPageFormName;
declare var SP;

/**
 * WebPart Information
 */
export interface IWebPartInfo {
    Context: any;
    Properties: any;
    WebPart: any;
    WebPartDefinition: any;
}

/**
 * Page Common Methods
 */
export class Page {
    // Method to get the webpart
    static getWebPart(wpId: string): PromiseLike<IWebPartInfo> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the current context
            let context = SP.ClientContext.get_current();

            // Get the webpart from the current page
            let page = context.get_web().getFileByServerRelativeUrl(ContextInfo.serverRequestPath);
            let wpMgr = page.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
            let wpDef = wpMgr.get_webParts().getById(wpId);
            let wp = wpDef.get_webPart();
            context.load(wp, "Properties");

            // Execute the request
            context.executeQueryAsync(
                // Success
                () => {
                    // Resolve the promise
                    resolve({
                        Context: context,
                        Properties: wp.get_properties(),
                        WebPart: wp,
                        WebPartDefinition: wpDef
                    } as IWebPartInfo)
                },
                // Error
                (...args) => {
                    // Reject the promise
                    reject(args[1] ? args[1].get_message() : "");
                }
            );
        });
    }

    // Method to get the webpart id for a specified element
    static getWebPartId(el: HTMLElement) {
        // Loop until we find the webpart id
        while (el) {
            // See if this element contains the webpart id
            let wpId = el.getAttribute("webpartid");
            if (wpId) {
                // Return the webpart id
                return wpId;
            }

            // Check the parent
            el = el.parentElement;
        }

        // Unable to detect
        return "";
    }

    // Method to detect if a page is being edited
    static isEditMode() {
        let formName = MSOWebPartPageFormName ? MSOWebPartPageFormName : "";

        // Get the form
        let form = document.forms[MSOWebPartPageFormName];
        if(form) {
            // Get the wiki page mode
            let wikiPageMode: any = form._wikiPageMode ? form._wikiPageMode.value : null;

            // Get the webpart page mode
            let wpPageMode = form.MSOLayout_InDesignMode ? form.MSOLayout_InDesignMode.value : null;

            // Determine if the page is being edited
            return wikiPageMode == "Edit" || wpPageMode == "1";
        }

        // Unable to determine
        return false;
    }

    // Method to detect if the page is a wiki page.
    static isWikiPage() {
    }
}