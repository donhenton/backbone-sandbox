require.config({
    baseUrl: "/backbone-sandbox/js/",
    paths: {
        jquery: 'libs/jquery/jquery-1.8.2',
        jqueryui: 'libs/jquery/jquery-ui.min',
        underscore: 'libs/underscore/underscore-1.4.4',
        backbone: 'libs/backbone/backbone-0.9.10',
        templates: '../templates',
        baseOptions: 'baseOptions',
        app: 'app'
    },

    shim: {
        jqueryui: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([
    'jquery',
    'app',
    'baseOptions'
], function ($, App, baseOptions) {

    $(function () {
        var options = baseOptions;
        App.initialize(options);
    });
});
