'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HTTPRequest = exports.performer = exports.Actions = undefined;

var _effectjs = require('effectjs');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Actions = exports.Actions = (0, _effectjs.Types)('error', 'response');

var Effects = (0, _effectjs.Types)('request');
var performer = exports.performer = _defineProperty({}, Effects.request, function (effect) {
    var data = effect.data;
    var method = data.method;
    var url = data.url;
    var headers = data.headers;
    var body = data.body;

    return fetch(url, { headers: headers, method: method, body: body }).then(function (response) {
        if (response.status >= 400 && response.status < 600) {
            return (0, _effectjs.Action)(Actions.error, {
                url: url,
                message: 'Failed to perform HTTP request',
                text: response.text
            });
        } else {
            return response.json().then(function (jsonData) {
                return (0, _effectjs.Action)(Actions.response, {
                    url: url,
                    body: jsonData
                });
            });
        }
    }).catch(function (err) {
        return (0, _effectjs.Action)(Actions.error, {
            url: url,
            message: err.message,
            stack: err.stack
        });
    });
});

var HTTPRequest = exports.HTTPRequest = function HTTPRequest(method, url, body, headers) {
    return (0, _effectjs.Effect)(Effects.request, {
        method: method,
        url: url,
        body: body,
        headers: headers
    });
};
