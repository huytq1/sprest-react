"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
/**
 * WebPart Tabs
 */
var WebPartTabs = /** @class */ (function (_super) {
    __extends(WebPartTabs, _super);
    /**
     * Constructor
     * @param props - The webpart tabs properties.
     */
    function WebPartTabs(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Flag to determine if the webpart is inside a content zone.
         */
        _this._isContentZone = false;
        /**
         * The render footer event
         */
        _this.onRenderFooter = function () { return null; };
        /**
         * The render header event
         */
        _this.onRenderHeader = function () { return null; };
        /**
         * Methods
         */
        /**
         * Methods to get the webparts
         */
        _this.getWebParts = function () {
            var wps = [];
            // Get the webpart element and zone
            var elWebPart = document.querySelector("div[webpartid='" + _this.props.cfg.WebPartId + "']");
            var elWebPartZone = elWebPart ? _this.getWebPartZone(elWebPart) : null;
            if (elWebPart && elWebPartZone) {
                // Parse the webparts in this zone
                var webparts = elWebPartZone.querySelectorAll(".ms-webpartzone-cell[id^='MSOZoneCell_WebPart']");
                for (var i = 0; i < webparts.length; i++) {
                    var webpart = webparts[i];
                    // Skip this webpart
                    if (webpart.querySelector("div[webpartid='" + _this.props.cfg.WebPartId + "']")) {
                        continue;
                    }
                    // Skip hidden webparts
                    var wpTitle = (webpart.querySelector(".ms-webpart-titleText") || {}).innerText || "";
                    var isHidden = webpart.firstElementChild && webpart.firstElementChild.className.indexOf("ms-hide") >= 0;
                    isHidden = isHidden || wpTitle.startsWith("(Hidden)");
                    if (isHidden) {
                        continue;
                    }
                    // See if this is within a content zone
                    if (_this._isContentZone) {
                        // Get the parent webpart box
                        while (webpart.parentNode) {
                            // See if this is the webpart box element
                            if (webpart.className.indexOf("ms-rte-wpbox") >= 0) {
                                // Add this webpart and break from the loop
                                wps.push(webpart);
                                break;
                            }
                            // Check the parent element
                            webpart = webpart.parentNode;
                        }
                    }
                    else {
                        // Add the webpart
                        wps.push(webpart);
                    }
                }
            }
            // Return the webparts
            return wps;
        };
        /**
         * Method to get the webpart zone
         */
        _this.getWebPartZone = function (el) {
            // Ensure the element exists
            if (el) {
                // See if this is the webpart zone element
                if (el.className.indexOf("ms-webpart-zone") >= 0) {
                    // Return it
                    return el;
                }
                // See if this is the inner page zone
                if (el.className.indexOf("ms-rte-layoutszone-inner") >= 0) {
                    // Set the flag
                    _this._isContentZone = true;
                    // Return it
                    return el;
                }
                // Check the parent element
                return _this.getWebPartZone(el.parentNode);
            }
            // Return nothing
            return null;
        };
        /**
         * Method to render the tabs
         */
        _this.renderTabs = function () {
            var tabs = [];
            // Parse the webparts
            for (var i = 0; i < _this.state.webparts.length; i++) {
                var webpart = _this.state.webparts[i];
                // Get the webpart title
                var wpTitle = webpart.querySelector(".ms-webpart-titleText");
                wpTitle = wpTitle ? wpTitle.innerText : null;
                if (wpTitle) {
                    // Add the tab
                    tabs.push(React.createElement(office_ui_fabric_react_1.PivotItem, { itemID: i.toString(), linkText: wpTitle, key: i, onRenderItemLink: _this.props.onRenderTab }));
                    // Get the webpart title element
                    var elWebPartTitle = webpart.querySelector(".ms-webpart-chrome-title");
                    if (elWebPartTitle) {
                        // Hide the title element
                        elWebPartTitle.style.display = "none";
                    }
                }
            }
            // Return the tabs
            return tabs;
        };
        /**
         * Method to update the
         * @param item - The pivot item.
         * @param ev - The tab click event.
         */
        _this.updateSelectedTab = function (item, ev) {
            // Update the state
            _this.setState({
                selectedTabId: parseInt(item.props.itemID)
            });
        };
        /**
         * Method to update the webpart visibility
         */
        _this.updateWebPartVisibility = function () {
            // Parse the webparts
            for (var i = 0; i < _this.state.webparts.length; i++) {
                // Get the webpart
                var webpart = document.querySelector("#" + _this.state.webparts[i].id);
                if (webpart) {
                    // Update the visibility
                    webpart.style.display = i == _this.state.selectedTabId ? "" : "none";
                }
            }
        };
        // Get the webparts
        var webparts = _this.getWebParts();
        // Parse the webparts
        var selectedTabId = 0;
        for (selectedTabId = 0; selectedTabId < webparts.length; selectedTabId++) {
            // Break if this webpart has a title
            if (webparts[selectedTabId].querySelector(".ms-webpart-titleText")) {
                break;
            }
        }
        // Set the state
        _this.state = { selectedTabId: selectedTabId, webparts: webparts };
        return _this;
    }
    /**
     * Events
     */
    /**
     * Component initialized event
     */
    WebPartTabs.prototype.componentDidMount = function () {
        // Update the webpart visibility
        this.updateWebPartVisibility();
    };
    /**
     * Component updated event
     */
    WebPartTabs.prototype.componentDidUpdate = function () {
        // Update the webpart visibility
        this.updateWebPartVisibility();
    };
    /**
     * Method to render the component
     */
    WebPartTabs.prototype.render = function () {
        return (React.createElement("div", { className: (this.props.className || "") },
            this.onRenderHeader(),
            React.createElement(office_ui_fabric_react_1.Pivot, { onLinkClick: this.updateSelectedTab, linkFormat: this.props.linkFormat, linkSize: this.props.linkSize }, this.renderTabs()),
            this.onRenderFooter()));
    };
    return WebPartTabs;
}(React.Component));
exports.WebPartTabs = WebPartTabs;
