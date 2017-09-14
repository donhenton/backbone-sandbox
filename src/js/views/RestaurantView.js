define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/rowTemplate.html',
    
], function ($, _, Backbone,rowTemplate) {
    
    
    var restaurantView = Backbone.View.extend({
        tagName: "tr",
        className: 'restaurantRow',

        initialize: function (options) {
             this.vent = options.vent;
            _.bindAll(this, "editModel", "deleteModel");
            this.template = _.template(rowTemplate);
        },
        events: {
            "click .editMarker": "editModel",
            "click .deleteMarker": "deleteModel"

        },
        /**
         * in the table display this is the code called by a click on
         * the edit button
         * 
         * @param {type}
         *            e
         * @returns {undefined}
         */
        editModel: function (e) {
            this.vent.trigger("editModel", this.model);
            $('.highLighted').toggleClass('highLighted');
            $(this.el).toggleClass("highLighted");
        },
        /**
         * clean up the model to handle zombies and prepare for delete
         * 
         * @returns {undefined}
         */
        cleanUp: function () {
            this.remove();
            this.unbind();
            this.model = null;
        },
        /**
         * in the table display this is the code called by a click on
         * the delete button
         * 
         * @param {type}
         *            e
         * @returns {undefined}
         */
        deleteModel: function (e) {
            // mark the item selected
            this.vent.trigger("editModel", this.model);
            $('.selectedRow').removeClass('selectedRow');
            $(this.el).attr("class", "selectedRow");
            var r = window.confirm("Do you wish to delete '"
                    + this.model.get("name") + "'?")
            if (r == true) {
                this.vent.trigger("deleteModel", this.model);
                // prevent zombies
                this.cleanUp();
            }
        },
        render: function () {

            var html = this.template(this.model.toJSON());
            $(this.el).attr({
                "id": this.model.get("id")
            });
            $(this.el).append(html);
        }

    }); // end restaurant view


    return restaurantView;



});