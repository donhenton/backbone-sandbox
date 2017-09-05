define([
    'jquery',
    'underscore',
    'backbone' 
], function ($, _, Backbone ) {




    var ratings = Backbone.Model.extend({
        defaults: {

            id: null,
            reviewListing: "",
            starRating: 1
        },
        validate: function (attrs, options) {
            var errors = null;

            if (!attrs.reviewListing
                    || $.trim(attrs.reviewListing).length == 0) {
                errors = ("Review cannot be blank!");
            }
            if (errors != null)
                return errors;
            else
                return;
        }

    });// end Ratings model

    return ratings;

});