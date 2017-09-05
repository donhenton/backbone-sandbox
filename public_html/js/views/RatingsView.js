define([
    'jquery',
    'underscore',
    'backbone',
    'models/Ratings',
    'baseOptions'

], function ($, _, Backbone, Ratings, baseOptions) {

    var ratingsView = Backbone.View.extend({
        tagName: "li",
        optRender: {
            interpolate: /\$\$(.+?)\$\$/gim,
            evaluate: /\$\$(.+?)\$\$/gim
        },

        initialize: function (options) {
            _.bindAll(this, "render", "deleteRating", "editRating", "saveRating", "cancelRating");
            this.parentRestaurant = options.parentRestaurant;
            this.vent = options.vent;
            this.options = options;

        },

        events: {
            "click .editRatingClass": "editRating",
            "click .deleteRatingClass": "deleteRating",
            "click .saveRatingClass": "saveRating",
            "click .cancelRatingClass": "cancelRating",

        },

        deleteRating: function ()
        {
            var r = confirm("Do you wish to remove this review?")
            if (r == true)
            {
                var opts = {"url": this.options._main_url + "review/" + this.parentRestaurant.get("id") + "/" + this.model.get("id")};
                this.model.destroy(opts);
                this.vent.trigger("refreshRatings");
            }
        },
        /**
         * prep the item for saving, just marks it to display the edit boxes
         */
        editRating: function ()
        {
            //console.log("hit edit rating "+this.model.get("reviewListing"));
            this.vent.trigger("reshowEditList", this.model.get("idx"));
        },
        /**
         * when it edit mode this is the code for the save button
         */
        saveRating: function ()
        {
            //override the url to allow for parent and child ids

            var opts = {"url": this.options._main_url + "review/" + this.parentRestaurant.get("id") + "/" + this.model.get("id")};
            var tempListing = $(this.el).find('span #r_reviewListing').val();
            var errorAreaRef = $(this.el).find("#error_message");
            if (!tempListing || $.trim(tempListing).length == 0) {
                errorAreaRef.html("Review cannot be blank!")
                errorAreaRef.show();
                return;
            }
            errorAreaRef.html("");
            errorAreaRef.hide();
            this.model.set("reviewListing", tempListing);
            this.model.set("starRating", $(this.el).find('span #s_starRating').val())


            //all three values required in params
            this.model.save(this.model.toJSON(), opts)
            this.model.set("isEditing", false);
            this.vent.trigger("refreshRatings");
            this.render();
            //	this.render();

        },
        cancelRating: function ()
        {
            console.log("hit cancel rating " + this.model.get("reviewListing"));
            this.model.set("isEditing", false);
            this.render();
        },

        /**
         * calculate the html for the star rating drop down
         * @param {type} starRating
         * @returns {String|html}
         */
        calculateDropDown: function (starRating)
        {
            var html = "";
            var h = "";
            var starValue = parseInt(starRating);
            for (var i = 1; i < 15; i++)
            {
                if (starValue == i)
                {
                    h = "<option selected>" + i + "</option>";
                } else
                {
                    h = "<option>" + i + "</option>";
                }
                html = html + h;
            }
            return html;
        },

        render: function () {

            var ro_html = _.template($('#reviewTemplate').html(), this.model.toJSON());
            var edit_html = _.template($('#reviewEditTemplate').html(), this.model.toJSON());
            var dd = {};
            dd.star_select_content = this.calculateDropDown(this.model.get("starRating"));
            edit_html = _.template(edit_html, dd, this.optRender);
            this.$el.empty();
            var editState = this.model.get("isEditing")
            if (editState == false)
                this.$el.html(ro_html);
            else
                this.$el.html(edit_html);

        }

    });


    return ratingsView;


});