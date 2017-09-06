define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/addReviewModal.html',
], function ($, _, Backbone, dialogTemplate) {
    var addReviewModal =
            Backbone.View.extend({
                events: {
                    
                    "click #savebtn": "save",
                    "click #closebtn": "close",
                },
                render: function () {
                    var formString = this.template({});
                    $(formString).dialog({
                        'autoOpen': false,
                        'resizable': false,
                        'modal': true,
                        'dialogClass': 'addReviewModalClass',
                        'width': 500,
                        'height': 250,
                        'minHeight': 250,
                        'draggable': false,
                    })
                    this.el = $('#addReviewModal').parent();
                    this.delegateEvents(this.events)
                    return this;
                },
                initialize: function (options) {
                    _.bindAll(this, "render","save","close")
                    this.template = _.template(dialogTemplate);
                    this.listViewRef = options.listView;
                    this.render().el;
                },
               
                save: function () {
                    console.log("save pressed")
                },
                close: function () {
                    console.log("close pressed");
                    this.close();
                },
            });

    return addReviewModal;


});


/*
 $('#addReviewModal').dialog(
 {
 'autoOpen':false,
 'title':"Explain",
 'resizable':false,
 'modal':true,
 'dialogClass': 'addReviewModalClass',
 'width':500,
 'height':350,
 'minHeight':250,
 'draggable': false,
 'buttons':
 {
 Close: function(){ $(this).dialog('close'); }
 }
 });
 
 */