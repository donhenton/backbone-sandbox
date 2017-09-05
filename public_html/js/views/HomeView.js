define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/HomeTemplate.html' 
], function($, _, Backbone,HomeTemplate ){

  var HomeView = Backbone.View.extend({        
      el: 'body',

      initialize: function(options) {
          this.collection = options.collection;
      },

      render: function() {
        var el = this.$el;

        el.empty();
        el.append(HomeTemplate);
        return this;
      }
  });

  return HomeView;
  
});