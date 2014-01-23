/**
 * @see README.md
 */

(function($, window) {
    'use strict';

    var Charter = function() { this.init(); };

    $.extend(Charter.prototype, {
        init: function() {
            $(document.body).css('margin', '0px');

            this.constr    = 'Chart';
            this.container = $('<div />').attr('id', 'chart-container').appendTo(document.body);

            // Disable animations
            Highcharts.SVGRenderer.prototype.Element.prototype.animate = Highcharts.SVGRenderer.prototype.Element.prototype.attr;
        },

        setId: function(id) {
            this.id = id;
        },

        pingback: function(callback, msg) {
            msg = msg || {};
            msg.callback = callback;
            msg.id = this.id;
            window.callPhantom(msg);
        },

        runScript: function(code) {
            $('<script />')
                .attr('type', 'text/javascript')
                .html(code)
                .appendTo(document.head);
        },

        setOptions: function(options) {
            if (!options.chart) {
                options.chart = {};
            }

            // DOM-target
            options.chart.renderTo = this.container.get(0);

            // Width/height
            options.chart.width  = (options.exporting && options.exporting.sourceWidth)  || options.chart.width  || 600;
            options.chart.height = (options.exporting && options.exporting.sourceHeight) || options.chart.height || 400;

            this.options = options;
        },

        setConstructor: function(constr) {
            this.constr = constr;
        },

        onRenderComplete: function() {
            this.pingback('onRenderComplete');
        },

        render: function() {
            var context = this, svg;
            this.chart = new Highcharts[this.constr](this.options, function() {
                // Remove stroke-opacity paths, used by mouse-trackers,
                // they turn up as as fully opaque in the PDF/PNG
                var node, opacity;
                $('*[stroke-opacity]').each(function() {
                    node = $(this);
                    opacity = node.attr('stroke-opacity');
                    node.removeAttr('stroke-opacity');
                    node.attr('opacity', opacity);
                });

                this.onRenderComplete();
            }.bind(this));

            svg = $('svg');

            return {
                html  : this.container.find('.highcharts-container').html(),
                width : svg.attr('width'),
                height: svg.attr('height')
            };
        }


    });

    window.Charter = Charter;

})(jQuery, window);