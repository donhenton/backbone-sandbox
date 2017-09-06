
define([
    'jquery',
    'underscore',
    'backbone',
    'models/Ratings',
    'models/RatingsList',
    'views/RatingsView',
    'baseOptions'

], function ($, _, Backbone, Ratings, RatingsList,RatingsView, baseOptions) {



    var ratingsListView = Backbone.View.extend({
				el: "#ratingsArea ul",
				addButtonRef: $("#addReviewButton"),
				addDialogRef: $('#addReviewModal') ,
				tagName: "ul",
				restaurant: null,
				collection : [],
				initialize : function(options) {
					_.bindAll(this, "loadRatings","renderSingleRating",
							"showAddReviewDialog", "reviewAddCallBack","reshowEditList",
							"deleteModel","addReview","refreshRatings");
					this.vent = options.vent;
					this.vent.bind("editModel", this.loadRatings);
					this.vent.bind("deleteModel", this.deleteModel);
					this.vent.bind("addModel", this.deleteModel);
					this.vent.bind("refreshRatings",this.refreshRatings),
					this.vent.bind("reshowEditList",this.reshowEditList),
					this.addButtonRef.hide();
					
				},
				
				/**
				 * respond to the delete event when the delete button for a row in the
				 * restaurant display is clicked.
				 */
				deleteModel: function()
				{
					this.collection = new RatingsList([]);
					this.addButtonRef.hide();
					this.restaurant = null;
					this.render();
				},

				/**
				 * called by the add review button, preps the dialog
				 */
				showAddReviewDialog: function()
				{
					var errorAreaRef = $("#error_message_for_addReview");
					errorAreaRef.html("");
					this.addDialogRef.find("#a_reviewListing").val("");
					this.addDialogRef.find("#a_starRating").val("1");					
					this.addDialogRef.dialog("open");
					
				},
				/**
				 * add a review called by the save button on the modal
				 */
				addReview: function()
				{
					console.log("hit add review");
					var reviewListingVal = this.addDialogRef.find("#a_reviewListing").val();
					var errorAreaRef = $("#error_message_for_addReview");
					if (!reviewListingVal
							|| $.trim(reviewListingVal).length == 0) {
							 errorAreaRef.html("Review cannot be blank!")
							 errorAreaRef.show();
						return;
					}
					this.addDialogRef.dialog('close');
					errorAreaRef.html("");
					errorAreaRef.hide();
					
					var starRatingVal = this.addDialogRef.find("#a_starRating").val();
					var starRating = parseInt(starRatingVal);
					//console.log("hit add review "+reviewListingVal+" "+starRatingVal);
					var newReview = new window.Ratings();
					newReview.set("starRating",starRating )
					newReview.set("reviewListing",reviewListingVal)
					newReview.set("isEditing",false);
					
					newReview.set("idx",this.collection.length);
					 
					//TODO add validation
						
					var opts = {"url": _main_url +"review/"+this.restaurant.get("id"),parse:"true","wait":true,"success": this.reviewAddCallBack};
					newReview.save(newReview.toJSON(),opts);
					
					
				},
				/**
				 * callback used to load the model after an add see immediately above
				 * this is done to retrieve the review id that is provided as the return
				 * value of the POST
				 */
				reviewAddCallBack: function(resp){
					
					//console.log("XXXX "+resp.get("id")+" "+resp.get("reviewListing"));
					var reviews = this.restaurant.get("reviewDTOs");
					reviews.push(resp.toJSON());
					this.restaurant.set("reviewDTOs",reviews);
					this.collection.add(resp);
					this.render();
					
				},
				
				/**
				 * handler for the reshowEditList event that is thrown when 
				 * the edit button is pressed for an individual item. It will turn off the
				 * edit display for all items, then use the indexValue to turn it on
				 * if indexValue is -1, then a delete occurred or reindexing is needed
				 * and you will have to walk the
				 * model list and reset the index
				 */
				reshowEditList: function(indexValue)
				{
					for (var i=0;i<this.collection.length;i++)
					{
						//console.log("isEditing "+this.collection.at(i).idx+" "+this.collection.at(i).isEditing)
						 
						this.collection.at(i).set("isEditing",false);
						this.collection.at(i).set("idx",i);
					}
					
					if (indexValue > 0 || indexValue == 0)
					{
						this.collection.at(indexValue).set("isEditing",true);
					}
					this.render();
				},
				
				/**
				 * called by add,edit or delete of the individual review as this 
				 * the collection works on a COPY of the array
				 * this is the refreshRatings event handler
				 * effects the entire list for the given restaurant
				 */
				refreshRatings: function()
				{
					var newReviews = [];
					for (var i = 0; i < this.collection.length; i++)
					{
						item = this.collection.at(i).toJSON();
						//console.log("refeshing with "+JSON.stringify(item));
						newReviews.push(item);
						
					}
					// silent to prevent changing the row display which loses row highlighting
					this.restaurant.set("reviewDTOs",newReviews,{"silent": true});
					this.reshowEditList();
				},

				/**
				 * load the ratings, this is the editModel event when a user clicks a 
				 * row, this initializes this collection each time a user clicks on a row
				 * and selects a new restaurant.
				 */
				loadRatings: function(mv){
					
					this.collection = new RatingsList(mv.get("reviewDTOs"));
					this.addButtonRef.show();
					this.restaurant = mv;
					this.render();
					
				},
				renderSingleRating : function(ratingsModel) {
					
					
					var ratingsView = new RatingsView({
						"model" : ratingsModel,
						"vent": this.vent,
						"parentRestaurant": this.restaurant
					});

					ratingsView.render();
					$(this.el).append(ratingsView.el);
				},
				render : function() {
					$(this.el).empty();

					for (var i = 0; i < this.collection.length; i++)
						this.renderSingleRating(this.collection.at(i));
				}

			});

    return ratingsListView;

});