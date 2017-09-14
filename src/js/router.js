// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/HomeView' 
], function($, _,Backbone, HomeView) {
  
  AppRouter = Backbone.Router.extend({

    initialize: function(options) {
       this.options = options;
    //   console.log("router1 "+JSON.stringify(options))
      
    },

    routes:{
        "":"home" 
         
    },
    home:function(e) {
 
      var homeView = new HomeView(this.options).render();
    } 
  });
  
  var initialize = function(options){
     
    var app_router = new AppRouter(options);

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});