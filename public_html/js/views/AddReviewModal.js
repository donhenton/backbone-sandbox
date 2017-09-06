define([
    'jquery',
    'underscore',
    'backbone' ,
    'text!templates/addReviewModal.html',
], function ($, _, Backbone,dialogTemplate) {
var addReviewModal =
        Backbone.View.extend({
            events: {
                "click #completedbtn": "complete",
                "click #updatebtn": "update",
                "click #savebtn": "save",
                "click #closebtn": "close",
            },
            render: function () {
                var formString = this.template({});
                $(formString).dialog({
                    autoOpen: false,
                    height: 460,
                    width: 350,
                    title: "Tasks",
                    modal: true
                })
                this.el = $('body');
                this.delegateEvents(this.events)
                return this;
            },
            initialize: function (options) {
                _.bindAll(this, "render")
                this.template = _.template(dialogTemplate);
                this.listViewRef = options.listView;
                this.render().el;
            },
            complete: function () {
                console.log("test")
            },
            update: function () {
                console.log("test")
            },
            save: function () {
                console.log("test")
            },
            close: function () {
                console.log("test")
            },
        });
        
        return addReviewModal;
        
        
});