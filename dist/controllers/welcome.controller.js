"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var imap_service_1 = require("../services/imap.service");
var Config = require('../../config.json');
var router = express_1.Router();
router.get('/', function (req, res) {
    var config = Config.mailSettings;
    config.user = 'xt@xpresstek.net';
    config.password = 'rAM&4I4yXvE9';
    config.host = 'imap.1and1.com';
    config.port = 993;
    config.tls = true;
    var imap = new imap_service_1.IMAPService(config);
    imap.Connect();
    res.send('Hello world');
});
exports.WelcomeController = router;
