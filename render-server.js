/**
 * @see README.md
 */

(function() {
    'use strict';

    // Init variables
    var webserver    = require('webserver'),
        usage        = 'Please POST to / the JSON-config for the chart you want to render',
        Renderer     = require('./renderer.js'),
        RenderServer = function(config) { this.init(config); };

    RenderServer.prototype.init = function(config) {
        this.config = config;

        this.startServer();
    };

    RenderServer.prototype.onRequest = function(request, response) {
        switch (request.method) {
            case 'POST':
                return this.onPostRequest(request, response);
            default:
                return this.onGetRequest(request, response);
        }
    };

    RenderServer.prototype.onGetRequest = function(request, response) {
        response.statusCode = (request.method == 'GET') ? 200 : 400;
        response.setHeader('Content-Type',  'text/plain');
        response.setHeader('Content-Length', usage.length);
        response.write(usage);
        response.close();
    };

    RenderServer.prototype.onPostRequest = function(request, response) {
        var data;
        try {
            // Try to evaluate options as JSON
            data = JSON.parse(request.post);
        } catch (e) {
            if (!this.config.allowUnsafeEvaluation) {
                // Fall back if we don't allow unsafe (non-JSON data)
                return this.onFail(response, 400, e + '');
            }
        }

        var renderer = new Renderer(data || request.post);
        renderer.allowUnsafeEvaluation(this.config.allowUnsafeEvaluation);
        renderer.setResponse(response);
        renderer.setOnRenderCallback(this.onRenderComplete.bind(this));
        renderer.setConfig(this.config);
        renderer.setResponse(response);
        renderer.render();
    };

    RenderServer.prototype.onRenderComplete = function(res, img) {
        res.statusCode = 200;
        res.setEncoding('binary');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', img.length);
        res.write(img);
        res.close();
    };

    RenderServer.prototype.onFail = function(response, status, msg) {
        response.statusCode = status;
        response.setHeader('Content-Type',  'text/plain');
        response.setHeader('Content-Length', msg.length);
        response.write(msg);
        response.close();
    };

    RenderServer.prototype.startServer = function() {
        this.server  = webserver.create();
        this.service = this.server.listen(
            this.config.port,
            this.onRequest.bind(this)
        );
    };

    module.exports = RenderServer;

})();