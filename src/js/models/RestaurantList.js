define([
  'jquery',
  'underscore',
  'backbone' ,
  'baseOptions',
  'models/RestaurantModel'
], function($, _, Backbone,baseOptions,RestaurantModel ){

 var restaurantList = Backbone.Collection.extend({
				"model" : RestaurantModel,
				"url" : baseOptions._main_url

			});
                        
   return restaurantList;
  
});




 