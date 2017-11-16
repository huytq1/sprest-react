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
var gd_sprest_1 = require("gd-sprest");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
require("../../sass/fieldAttachments.scss");
/**
 * Attachments field
 */
var FieldAttachments = /** @class */ (function (_super) {
    __extends(FieldAttachments, _super);
    /**
     * Constructor
     * @param props - The attachment field properties.
     */
    function FieldAttachments(props) {
        var _this = _super.call(this, props) || this;
        _this._file = null;
        /**
         * Method to save the attachments to the item
         * @param itemId - The item id.
         */
        _this.save = function (itemId) {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // Delete the attachments
                _this.deleteAttachments().then(function () {
                    // Save the attachments
                    _this.saveAttachments(itemId).then(function () {
                        // Resolve the promise
                        resolve();
                    });
                });
            });
        };
        /**
         * Method to show the file dialog
         */
        _this.showFileDialog = function () {
            // Show the file dialog
            _this._file.click();
        };
        /**
         * Methods
         */
        /**
         * Event triggered by the user selecting a file to upload
         * @param ev - The button click event.
         */
        _this.addAttachment = function (ev) {
            // Get the file information
            var srcFile = ev.target.files[0];
            if (srcFile) {
                var reader = new FileReader();
                // Update the state
                _this.setState({
                    errorMessage: "",
                    loadingFl: true
                });
                // Set the file loaded event
                reader.onloadend = function (ev) {
                    var newFl = true;
                    var attachment = null;
                    var files = _this.state.files;
                    // Parse the attachments
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        // See if the file already exists
                        if (file.name.toLowerCase() == srcFile.name.toLowerCase()) {
                            // Set the flag
                            newFl = false;
                            // Update the file
                            file.data = ev.target.result;
                            file.deleteFl = false;
                            file.name = srcFile.name;
                            file.ext = file.name.split(".");
                            file.ext = file.ext[file.ext.length - 1].toLowerCase();
                            // Set the attachment
                            attachment = file;
                            // Break from the loop
                            break;
                        }
                    }
                    // See if this is a new attachment
                    if (newFl) {
                        var ext = srcFile.name.split(".");
                        ext = ext[ext.length - 1].toLowerCase();
                        // Set the attachment
                        attachment = {
                            data: ev.target.result,
                            deleteFl: false,
                            existsFl: false,
                            ext: ext,
                            name: srcFile.name
                        };
                        // Add the file
                        files.push(attachment);
                    }
                    // Call the file added event
                    _this.props.onFileAdded ? _this.props.onFileAdded(attachment) : null;
                    // Update the state
                    _this.setState({
                        files: files,
                        loadingFl: false
                    });
                };
                // Set the error
                reader.onerror = function (ev) {
                    // Update the state
                    _this.setState({
                        errorMessage: ev.target.error,
                        loadingFl: false
                    });
                };
                // Read the file
                reader.readAsArrayBuffer(srcFile);
            }
        };
        /**
         * Method to delete the attachments
         */
        _this.deleteAttachments = function () {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // Get the web
                var web = new gd_sprest_1.Web(_this.props.webUrl);
                // Parse the files
                for (var i = 0; i < _this.state.files.length; i++) {
                    var file = _this.state.files[i];
                    // See if we are deleting the file
                    if (file.deleteFl) {
                        // Get the file
                        web.getFileByServerRelativeUrl(file.url)
                            .delete()
                            .execute(true);
                    }
                }
                // Wait for the requests to complete
                web.done(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    // Resolve the proimse
                    resolve(args);
                });
            });
        };
        /**
         * Method to load the attachment files from the item.
         */
        _this.loadAttachments = function () {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // Set the state
                _this.setState({ loadingFl: true });
                // Ensure the list and item id exists
                if (_this.props.listName && _this.props.itemId && _this.props.itemId > 0) {
                    // Get the web
                    (new gd_sprest_1.Web(_this.props.webUrl))
                        .Lists(_this.props.listName)
                        .Items(_this.props.itemId)
                        .AttachmentFiles()
                        .execute(function (attachments) {
                        // Update the state
                        _this.setState({
                            files: _this.toArray(attachments),
                            loadingFl: false
                        });
                    });
                }
                else {
                    // Set the state
                    _this.setState({ files: [], loadingFl: false });
                }
            });
        };
        /**
         * The click event for the link.
         */
        _this.linkClick = function (ev) {
            // Prevent postback
            ev.preventDefault();
            // Execute the event
            if (_this.props.onFileClick) {
                // Get the file name
                var fileName = ev.currentTarget.getAttribute("data-filename");
                // Parse the attachments
                var files = _this.state.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    // See if this is the attachment to remove
                    if (file.name.toLowerCase() == fileName) {
                        // Execute the event
                        _this.props.onFileClick(file);
                        // Break from the loop
                        break;
                    }
                }
            }
        };
        /**
         * Event triggered by clicking on the attachment delete icon
         * @param ev - The button click event.
         */
        _this.removeAttachment = function (ev) {
            // Prevent postback
            ev.preventDefault();
            // Get the file name
            var fileName = ev.currentTarget.getAttribute("data-filename");
            // Parse the attachments
            var files = _this.state.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                // See if this is the attachment to remove
                if (file.name.toLowerCase() == fileName) {
                    // See if this item exists
                    if (file.existsFl) {
                        // Set the delete flag
                        file.deleteFl = true;
                    }
                    else {
                        // Remove the file
                        files.splice(i, 1);
                    }
                    // Break from the loop
                    break;
                }
            }
            // Update the state
            _this.setState({ files: files });
        };
        /**
         * Method to render the attachments
         */
        _this.renderAttachments = function () {
            var files = [];
            // Parse the files
            for (var i = 0; i < _this.state.files.length; i++) {
                var file = _this.state.files[i];
                // Ensure we are not deleting this field
                if (file.deleteFl) {
                    continue;
                }
                // See if the render event exists
                var attachment = null;
                if (_this.props.onFileRender) {
                    // Set the attachment
                    attachment = _this.props.onFileRender(file);
                }
                // Add the attachment
                files.push(attachment ||
                    React.createElement(office_ui_fabric_react_1.Link, { className: "ms-AttachmentLink", key: file.name, href: file.url, "data-filename": file.name.toLowerCase(), download: true, onClick: _this.linkClick },
                        React.createElement("span", { className: "ms-fontSize-m" }, file.name),
                        _this.props.controlMode == gd_sprest_1.SPTypes.ControlMode.Display ? null :
                            React.createElement("i", { className: "ms-Icon ms-Icon--Delete", "data-filename": file.name.toLowerCase(), onClick: _this.removeAttachment })));
            }
            // Return the files
            return files;
        };
        /**
         * Method to save the attachments
         * @param itemId - The item id.
         */
        _this.saveAttachments = function (itemId) {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // Get the list item
                var item = (new gd_sprest_1.Web(_this.props.webUrl))
                    .Lists(_this.props.listName)
                    .Items(itemId);
                // Parse the files
                for (var i = 0; i < _this.state.files.length; i++) {
                    var file = _this.state.files[i];
                    // See if we are deleting the file
                    if (file.deleteFl) {
                        continue;
                    }
                    // See if the binary data exists
                    if (file.data) {
                        // Get the item attachments
                        item.AttachmentFiles()
                            .add(file.name, file.data)
                            .execute(true);
                    }
                }
                // Wait for the requests to complete
                item.done(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    // Resolve the promise
                    resolve(args);
                });
            });
        };
        /**
         * Method to convert the item value to the attachment file array
         * @param attachments - The file attachments.
         */
        _this.toArray = function (attachments) {
            var files = [];
            // Ensure attachments exist
            if (attachments && attachments.results) {
                // Parse the attachments
                for (var i = 0; i < attachments.results.length; i++) {
                    var attachment = attachments.results[i];
                    // Set the file extension
                    var ext = attachment.FileName.split(".");
                    ext = ext[ext.length - 1].toLowerCase();
                    // Add the file
                    files.push({
                        data: null,
                        deleteFl: false,
                        existsFl: true,
                        ext: ext,
                        name: attachment.FileName,
                        url: attachment.ServerRelativeUrl
                    });
                }
            }
            // Return the files
            return files;
        };
        // Update the state
        _this.state = {
            errorMessage: "",
            files: _this.toArray(props.files),
            loadingFl: false
        };
        return _this;
    }
    /**
     * Method to render the component
     */
    FieldAttachments.prototype.render = function () {
        var _this = this;
        // See if the render method exists
        if (this.props.onRender) {
            return this.props.onRender(this.state.files);
        }
        // Ensure the files exist
        if (this.state.files) {
            // Load the attachments
            this.loadAttachments();
        }
        // See if we are loading the attachments
        if (this.state.loadingFl) {
            // Render a loading dialog
            return (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Uploading the file" }));
        }
        // See if this is the display mode
        if (this.props.controlMode == gd_sprest_1.SPTypes.ControlMode.Display) {
            // Render the attachments
            return (React.createElement("div", null,
                React.createElement("div", { className: (this.props.className || "") }, this.renderAttachments()),
                React.createElement("input", { type: "file", hidden: true, onChange: this.addAttachment, ref: function (file) { _this._file = file; } })));
        }
        // Render the attachments
        return (React.createElement("div", { className: (this.props.className || "") },
            this.renderAttachments(),
            React.createElement(office_ui_fabric_react_1.Link, { className: "ms-AttachmentLink", onClick: this.showFileDialog }, "Add an attachment"),
            this.state.errorMessage == "" ? null :
                React.createElement("span", { className: "ms-fontSize-m ms-fontColor-redDark" }, this.state.errorMessage),
            React.createElement("input", { type: "file", hidden: true, onChange: this.addAttachment, ref: function (file) { _this._file = file; } })));
    };
    return FieldAttachments;
}(React.Component));
exports.FieldAttachments = FieldAttachments;
//# sourceMappingURL=fieldAttachments.js.map