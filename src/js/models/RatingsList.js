define([
    'jquery',
    'underscore',
    'backbone',
    'models/Ratings',
    'baseOptions' 
    
], function ($, _, Backbone,Ratings,baseOptions) {

    var ratingsList = Backbone.Collection.extend({
        "model": Ratings,
        "url": baseOptions._main_url + "review",
        initialize: function (reviewDTOs)
        {
            //this is a copy so add some extra stuff
            for (var i = 0; i < reviewDTOs.length; i++)
            {
                reviewDTOs[i].isEditing = false;
                reviewDTOs[i].idx = i;
            }

        }

    });

    return ratingsList;

});