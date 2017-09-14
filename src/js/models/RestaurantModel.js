define([
    'jquery',
    'underscore',
    'backbone',
    'baseOptions'
], function ($, _, Backbone,baseOptions) {

    var restaurantModel =
            Backbone.Model.extend({
                "urlRoot": baseOptions._main_url,
                validate: function (attrs, options) {
                    var errors = [];
                    if (!attrs.name || $.trim(attrs.name).length == 0) {
                        errors.push("Name cannot be blank!");
                    }
                    if (!attrs.city || $.trim(attrs.city).length == 0) {
                        errors.push("City cannot be blank!");
                    }
                    if (!attrs.state || $.trim(attrs.state).length == 0) {
                        errors.push("State cannot be blank!");
                    }
                    if (!attrs.zipCode || $.trim(attrs.zipCode).length == 0) {
                        errors.push("ZipCode cannot be blank!");
                    } else {
                        var zipInt = parseInt(attrs.zipCode);
                        if (isNaN(zipInt)) {
                            errors.push("ZipCode must be a number");
                        }
                    }
                    if (errors.length == 0)
                        return;
                    else
                        return errors;
                },
                defaults: {
                    name: "",
                    id: null,
                    city: "",
                    state: "",
                    zipCode: "",
                    reviewDTOs: [],
                    version: 1
                }
            });

    var cloneableRestaurantModel = restaurantModel.extend(
            {
                clone: function (source)
                {
                    return new cloneableRestaurantModel(
                            {
                                version: source.get("version"),
                                state: source.get("state"),
                                city: source.get("city"),
                                zipCode: source.get("zipCode"),
                                name: source.get("name")
                            }



                    );
                }
            }

    )        


    return cloneableRestaurantModel;

});
          