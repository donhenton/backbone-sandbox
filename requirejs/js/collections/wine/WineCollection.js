define([
  'backbone',
  'underscore',
  'models/wine/Model'
], function(Backbone,_,Model){

	var  WineCollection = Backbone.Collection.extend({
    	Model: Model,
    	url: '#'
    });

  return WineCollection;

});