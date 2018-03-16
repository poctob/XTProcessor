"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("./controllers");
var app = express();
var port = parseInt(process.env.PORT) || 3000;
app.use('/welcome', controllers_1.WelcomeController);
app.listen(port, function () {
    console.log("Listening at http://localhost:" + port + "/");
});
