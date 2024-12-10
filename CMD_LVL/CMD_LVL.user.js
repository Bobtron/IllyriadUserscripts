// ==UserScript==
// @name         Commander Max Possible Level
// @namespace    https://github.com/Bobtron
// @version      1.0
// @description  Displays the possible level of a commander next to the actual level.
// @author       Bobtron
// @match        https://elgea.illyriad.co.uk/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Bobtron/IllyriadUserscripts/refs/heads/master/CMD_LVL/CMD_LVL.user.js
// @updateURL    https://raw.githubusercontent.com/Bobtron/IllyriadUserscripts/refs/heads/master/CMD_LVL/CMD_LVL.user.js
// ==/UserScript==

var js = `https://raw.githubusercontent.com/Bobtron/IllyriadUserscripts/refs/heads/master/CMD_LVL/CMD_LVL.js`
var script = document.createElement('script');
script.setAttribute('src',js);
script.setAttribute('type','text/javascript');
document.getElementsByTagName('head')[0].appendChild(script);
