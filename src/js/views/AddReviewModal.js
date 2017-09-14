define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/addReviewModal.html',
    'baseOptions'
], function ($, _, Backbone, dialogTemplate,baseOptions) {
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
                    $(this.el).append(html);
                    return this;
                },
                initialize: function (options) {
                    _.bindAll(this, "render", "save", "close")
                    this.template = _.template(dialogTemplate);
                    this.listViewRef = options.listView;
                    
                },

                save: function () {
                    this.listViewRef.addReview();
                    console.log("save pressed "+this.listViewRef)
                },
                close: function () {
                    console.log("close pressed");
                  $(baseOptions.reviewDialogSelector).dialog('close')
                },
            });

    return addReviewModal;


});


