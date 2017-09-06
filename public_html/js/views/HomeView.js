define([
    'jquery',
    'underscore',
    'backbone',
    'views/RestaurantListView',
    'views/RestaurantFormView',
    'views/RatingsListView',
    'models/RestaurantList',
    'views/AddReviewModal',
    'baseOptions',
    'jqueryui',
    
], function ($, _, Backbone, RestaurantListView,RestaurantFormView,RatingsListView, RestaurantList,AddReviewModal,baseOptions) {

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
            
            this.addReviewModal = new AddReviewModal({"listView": this.myRatingsListView });
            this.addReviewModal.render();
            var modalEl = $(baseOptions.reviewDialogSelector);
            modalEl.html(this.addReviewModal.el);
            modalEl.dialog({
                        'autoOpen': false,
                        'resizable': false,
                        'modal': true,
                        'dialogClass': 'addReviewModalClass',
                        'width': 500,
                        'height': 250,
                        'minHeight': 250,
                        'draggable': false,
                    })
            
            return this;
        }
    });

    return HomeView;

});