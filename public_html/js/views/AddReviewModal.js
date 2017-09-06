define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/addReviewModal.html',
], function ($, _, Backbone, dialogTemplate) {
    var addReviewModal =
            Backbone.View.extend({

                tagName: "div",
                className: 'dialogHtml',
                events: {

                    "click #savebtn": "save",
                    "click #closebtn": "close",
                },
                render: function () {
                    var html = this.template({});
                    
                    // this.el = $('#addReviewModal').parent();
                    // this.delegateEvents(this.events);
                    
                    
                    $(this.el).append(html);
                    return this;
                },
                initialize: function (options) {
                    _.bindAll(this, "render", "save", "close")
                    this.template = _.template(dialogTemplate);
                    this.listViewRef = options.listView;
                    
                },

                save: function () {
                    console.log("save pressed ")
                },
                close: function () {
                    console.log("close pressed");
                  
                },
            });

    return addReviewModal;


});


