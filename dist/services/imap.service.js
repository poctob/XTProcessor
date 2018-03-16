"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Imap = require("imap");
var util_1 = require("util");
var IMAPService = /** @class */ (function () {
    function IMAPService(config) {
        var _this = this;
        this.config = config;
        this.openInbox = function () {
            if (_this._imap)
                _this._imap.openBox("INBOX", true, _this.onInboxOpen);
            else
                console.log("Imap is null :(");
        };
        this.onInboxOpen = function (err, mailbox) {
            if (err)
                throw err;
            var fetch = _this._imap.seq.fetch("1:1", {
                bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
                struct: true
            });
            fetch.on("message", _this.onMessage);
            fetch.once("error", _this.onError);
            fetch.once("end", function () {
                console.log("Done fetchnig messages");
                _this._imap.end();
            });
        };
        this.onMessage = function (msg, seqno) {
            console.log("Message #%d", seqno);
            var prefix = "(#" + seqno + ") ";
            msg.on("body", _this.onBody);
            msg.once("attributes", function (attributes) {
                console.log(prefix + "Attributes: %s", util_1.inspect(attributes, false, 8));
            });
            msg.once("end", function () {
                console.log(prefix + "Finished");
            });
        };
        this.onBody = function (stream, info) {
            var buffer = "";
            stream.on("data", function (chunk) {
                buffer += chunk.toString("utf8");
            });
            stream.once("end", function () {
                console.log("Parsed header: %s", util_1.inspect(Imap.parseHeader(buffer)));
            });
        };
        this.onError = function (err) {
            console.log(err);
        };
        this.onDisconnect = function () {
            console.log("connection closed");
        };
        this._imap = new Imap(config);
    }
    IMAPService.prototype.Connect = function () {
        this._imap.once("ready", this.openInbox);
        this._imap.once("error", this.onError);
        this._imap.once("end", this.onDisconnect);
        this._imap.connect();
    };
    return IMAPService;
}());
exports.IMAPService = IMAPService;
