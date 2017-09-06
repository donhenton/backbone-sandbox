define([
    'jquery',
    'underscore',
    'backbone',
    'views/RestaurantListView',
    'views/RestaurantFormView',
    'views/RatingsListView',
    'models/RestaurantList'
], function ($, _, Backbone, RestaurantListView,RestaurantFormView,RatingsListView, RestaurantList) {

    var HomeView = Backbone.View.extend({

        initialize: function (options) {
            this.options = options;

            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/gim,
                evaluate: /\{\{(.+?)\}\}/gim,
                // this globally turns on html escaping in the template engine
                escape: /\{\{(.+?)\}\}/gim

            };
 
 
            // restaurant scroll list
            var wrappedCollection = new RestaurantList(this.options.collection);
            this.restaurantListView = new RestaurantListView({
                "vent": this.options.vent,
                collection: wrappedCollection
            });

            this.restaurantListView.render();
            
            //restaurant editing area
            this.myRestaurantFormView = new RestaurantFormView({
				"vent" : this.options.vent
			});
            this.myRestaurantFormView.render();
            
            this.myRatingsListView = new RatingsListView({"vent": this.options.vent});
            
            this.myRatingsListView.render();
            return this;
        }
    });

    return HomeView;

});