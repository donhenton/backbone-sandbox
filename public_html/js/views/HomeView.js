define([
    'jquery',
    'underscore',
    'backbone',
    'views/RestaurantListView',
    'models/RestaurantList'
], function ($, _, Backbone, RestaurantListView, RestaurantList) {

    var HomeView = Backbone.View.extend({

        initialize: function (options) {
            this.options = options;

            _.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/gim,
                evaluate: /\{\{(.+?)\}\}/gim,
                // this globally turns on html escaping in the template engine
                escape: /\{\{(.+?)\}\}/gim

            };


        },

        render: function () {
            //var el = $('#listPoint');
            //var self = this;
            //el.empty();

            //_.each(self.options.collection,function(row)
            //{
            //    el.append("<h3>"+row.name+"</h3>")
            //})
            var wrappedCollection = new RestaurantList(this.options.collection);
            this.restaurantListView = new RestaurantListView({
                "vent": this.options.vent,
                collection: wrappedCollection
            });

            this.restaurantListView.render();
            return this;
        }
    });

    return HomeView;

});