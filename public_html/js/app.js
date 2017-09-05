define([
  'jquery',  
  'underscore',
  'backbone',
  'router', // Request router.js
], function($, _, Backbone, Router){
  var initialize = function(options) {
  	
    // Pass in our Router module and call it's initialize function
    
    $.getJSON(options._main_url,null,function(data,textStatus,jx)
            
      {
          options.collection = data;
          options.vent = _.extend({}, Backbone.Events);
          Router.initialize(options);
         
          
      });
    
    
 
    
    
    
  };

  return { 
    initialize: initialize
  };
});
