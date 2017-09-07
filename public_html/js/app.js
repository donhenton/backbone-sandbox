define([
    'jquery',
    'underscore',
    'backbone',
    'router', // Request router.js
], function ($, _, Backbone, Router) {
    var initialize = function (options) {
        options.vent = _.extend({}, Backbone.Events);
        // Pass in our Router module and call it's initialize function

        var jxObj = $.getJSON(options._main_url, null, function (data, textStatus, jx)

        {
             options.collection = data;
             Router.initialize(options);


        }).fail(function (e) {
            //{"readyState":4,"responseText":"","status":500,"statusText":"Internal Server Error"}
            // console.log("failure "+JSON.stringify(e))
            
            var errorReport = "<h3>Main Load Errors</h3>\n<ul class='main-error'>\n";
            errorReport += "<li> Message: "+e.statusText+"</li>\n";
            errorReport += "<li> Status Value: "+e.status+"</li>\n";
            errorReport += "</ul>\n"
             $('#mainErrorReport').html(errorReport);
        });

        jxObj.complete(function ()
        {
            // console.log("will always be called a the end")
        })




    };

    return {
        initialize: initialize
    };
});
