// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/HomeView' 
], function($, _,Backbone, HomeView) {
  
  AppRouter = Backbone.Router.extend({

    initialize: function(options) {
      this.collection = options.collection;
    },

    routes:{
        "":"home" 
         
    },
    home:function(e) {
      var homeView = new HomeView({collection: this.collection}).render();
    } 
  });
  
  var initialize = function(){
     
    var app_router = new AppRouter({collection: null});

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});