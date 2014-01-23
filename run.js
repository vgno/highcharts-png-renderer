/**
 * @see README.md
 */

(function() {
    'use strict';

    // Make sure we have Function.bind
    require('./libs/bind-shim');

    var RenderServer = require('./render-server'),
        config       = require('./config.json'),
        server       = new RenderServer(config);

    console.log('Listening on port ' + config.port);

})();