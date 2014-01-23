/**
 * @see README.md
 */

(function() {
    'use strict';

    // Really slim bind shim
    if (typeof Function.prototype.bind === 'undefined') {
        Function.prototype.bind = function(context) {
            var method = this;
            return function() {
                return method.apply(context, arguments);
            };
        };
    }

})();