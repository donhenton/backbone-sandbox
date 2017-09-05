/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(
		function() {

			/**
			 * switch to mustache style markings: {{ }}
			 */
			_.templateSettings = {
				interpolate : /\{\{(.+?)\}\}/gim,
				evaluate : /\{\{(.+?)\}\}/gim,
				// this globally turns on html escaping in the template engine
				escape : /\{\{(.+?)\}\}/gim

			};
			window.Restaurant = Backbone.Model.extend({
				"urlRoot" : _main_url,
				validate : function(attrs, options) {
					var errors = [];
					if (!attrs.name || $.trim(attrs.name).length == 0) {
						errors.push("Name cannot be blank!");
					}
					if (!attrs.city || $.trim(attrs.city).length == 0) {
						errors.push("City cannot be blank!");
					}
					if (!attrs.state || $.trim(attrs.state).length == 0) {
						errors.push("State cannot be blank!");
					}
					if (!attrs.zipCode || $.trim(attrs.zipCode).length == 0) {
						errors.push("ZipCode cannot be blank!");
					} else {
						var zipInt = parseInt(attrs.zipCode);
						if (isNaN(zipInt)) {
							errors.push("ZipCode must be a number");
						}
					}
					if (errors.length == 0)
						return;
					else
						return errors;
				},
				defaults : {
					name : "",
					id : null,
					city : "",
					state : "",
					zipCode : "",
					reviewDTOs : [],
					version : 1
				}
			});
			window.RestaurantList = Backbone.Collection.extend({
				"model" : Restaurant,
				"url" : _main_url

			});
			window.RestaurantListView = Backbone.View.extend({
				el : '#listPoint',
				viewCollection : [],
				initialize : function(options) {
					// this.collection = options.collection;
					_.bindAll(this, "editModel", "deleteModel", "saveModel",
							"addModel");
					this.collection.bind("change", this.render, this);
					this.collection.bind("add", this.render, this);
					this.collection.bind("remove", this.render, this);
					this.collection.bind("destroy", this.render, this);
					this.collection.bind("reset", this.render, this);
					this.collection.bind("sync", this.sync, this);
					this.vent = options.vent;
					options.vent.bind("deleteModel", this.deleteModel);
					options.vent.bind("editModel", this.editModel);
					options.vent.bind("saveModel", this.saveModel);
					options.vent.bind("addModel", this.addModel);
				},
				/**
				 * handler for the sync event, used here to see that the key
				 * from the server is brought down to fill in the key with the
				 * server side value
				 * 
				 * @param {type}
				 *            e
				 * @returns {undefined}
				 */
				sync : function(e) {
					// console.log(e);
				},
				/**
				 * add model event handler this is in response to a click on the
				 * add button on the Form. meaning 'take what's in the form and
				 * add it
				 * 
				 * @param model
				 *            the actual model to add
				 * @returns {undefined}
				 */
				addModel : function(model) {
					// these options are for the create method, and the wait
					// says
					// wait for the 200 response from the server before
					// continuing
					// the success call back is called when the process is
					// complete
					// these aren't used right now
					var options = {
						wait : true,
						success : function(model, resp, newopt) {
							var t = model;
						}

					};
					// var modelAttributes = model.toJSON();
					this.collection.add(model);
				},
				/**
				 * event handler for when the edit button is clicked on the
				 * table display. Not used at this time
				 * 
				 * @param {type}
				 *            model
				 * @returns {undefined}
				 */
				editModel : function(model) {

				},
				/**
				 * handler for the save event, at this time, not used
				 * 
				 * @param {type}
				 *            newModel
				 * @returns {undefined}
				 */
				saveModel : function(newModel) {
					// this.render();
					//
				},
				/**
				 * handler for the delete event which is thrown when the delete
				 * button in the row display is clicked.
				 * 
				 * @param {type}
				 *            model
				 * @returns {undefined}
				 */
				deleteModel : function(model) {
					this.collection.remove(model);
					model.destroy();
				},
				/**
				 * clean up the old views, otherwise during rendering they will
				 * be held by references of events to the DOM
				 * 
				 * @returns {undefined}
				 */
				cleanViewCollection : function() {
					for (var i = 0; i < this.viewCollection.length; i++) {
						this.viewCollection[i].cleanUp();
					}
					this.viewCollection = [];
				},
				/**
				 * render the individual restaurant render
				 * 
				 * @param {type}
				 *            invModel
				 * @returns {undefined}
				 */
				renderRestaurant : function(invModel,container) {

					var restaurantView = new RestaurantView({
						"model" : invModel,
						"vent" : vent
					});
					this.viewCollection.push(restaurantView);
					restaurantView.render();
					container.appendChild(restaurantView.el);
				},
				render : function() {
					$(this.el).empty();
					this.cleanViewCollection();
					var container = document.createDocumentFragment();
					for (var i = 0; i < this.collection.length; i++)
						this.renderRestaurant(this.collection.at(i),container);
					$(this.el).append(container);
				}

			}); // end restaurant list view

			window.RestaurantFormView = Backbone.View.extend({
				el : "#editArea",
				initialize : function(options) {
					this.model = new Restaurant();
					this.vent = options.vent;
					_.bindAll(this, "editModel", "saveEdits", "addRestaurant",
							"deleteModel", "validateFail");
					options.vent.bind("editModel", this.editModel);
					options.vent.bind("deleteModel", this.deleteModel);
					options.vent.bind("validateFail", this.validateFail);
					this.bind("invalid", this.validateFail, this);
				},
				/**
				 * the routine to run when saving an object fails--displays
				 * errors
				 * 
				 * @param {type}
				 *            errorSet an array of error strings
				 * @returns {undefined}
				 */
				validateFail : function(errorSet) {
					var info = "";
					for (var i = 0; i < errorSet.length; i++) {
						info = info + '<li><em><span class="text-error">'
								+ errorSet[i] + "</span></em></li>"
					}
					$('#errorItems').html(info);
				},
				/**
				 * responds to the edit event when a user clicks on the edit
				 * button in the list of restaurants and loads the form with the
				 * values from the newly selected Model
				 * 
				 * @param {type}
				 *            newModel the model sent in event trigger, which is
				 *            the action of selecting a row
				 * @returns {undefined}
				 */
				editModel : function(newModel) {
					this.model = newModel;
					// this.model.bind("invalid", this.handleInvalidInput,
					// this);
					$('#saveEdits').show();
					$('#errorItems').empty();
					this.render();
				},
				/**
				 * responds to the event when a user clicks on the delete button
				 * in the list of restaurants and clears the form
				 * 
				 * @returns {undefined}
				 */
				deleteModel : function() {
					this.model = new Restaurant();
					this.clearFields();
				},
				/**
				 * empty out the fields in the form
				 * 
				 * @returns {undefined}
				 */
				clearFields : function() {
					$('#version').val("");
					$('#zipCode').val("");
					$('#state').val("");
					$('#name').val("");
					$('#city').val("");
					$('#errorItems').empty();
					$('#saveEdits').hide();
				},
				/**
				 * called explicitly by the form add button, triggers the
				 * addModel event which is used by the collection to add the
				 * model
				 * 
				 * @returns {undefined}
				 */
				addRestaurant : function() {
					this.model = new Restaurant();
					this.saveRestaurant("addModel");
				},
				/**
				 * called explicitly by the form save button, persists the model
				 * then triggers an event for anyone to listen to
				 * 
				 * @param {type}
				 *            e
				 * @returns {undefined}
				 */
				saveEdits : function() {
					this.saveRestaurant("saveModel");
				},
				/**
				 * main saving routine, with validation
				 * 
				 * @param {type}
				 *            eventName such as add or save
				 * @returns {undefined}
				 */
				saveRestaurant : function(eventName) {
					var sample = {};
					sample.name = $('#name').val();
					sample.city = $('#city').val();
					sample.state = $('#state').val();
					sample.zipCode = $('#zipCode').val();
					var vResult = this.model.validate(sample);
					if (!vResult) {
						this.model.set("name", $('#name').val());
						this.model.set("city", $('#city').val());
						this.model.set("state", $('#state').val());
						this.model.set("zipCode", $('#zipCode').val());
						this.model.set("version", $('#version').val());
						this.model.save();
						this.clearFields();
						if (eventName != null)
							this.vent.trigger(eventName, this.model);
					} else {
						this.validateFail(vResult);
					}

				},
				render : function() {
					var html = _.template($('#formTemplate').html(), this.model
							.toJSON());
					$('#restaurantFormViewItems').html(html);
				}
			});
			window.RestaurantView = Backbone.View.extend({
				tagName : "tr",
                                className: 'restaurantRow',
                                
				initialize : function(options) {
					this.vent = options.vent;
					_.bindAll(this, "editModel", "deleteModel");
				},
				events : {
					"click .editMarker" : "editModel",
					"click .deleteMarker" : "deleteModel"

				},
				/**
				 * in the table display this is the code called by a click on
				 * the edit button
				 * 
				 * @param {type}
				 *            e
				 * @returns {undefined}
				 */
				editModel : function(e) {
					this.vent.trigger("editModel", this.model);
					$('.highLighted').toggleClass('highLighted');
					$(this.el).toggleClass(  "highLighted");
				},
				/**
				 * clean up the model to handle zombies and prepare for delete
				 * 
				 * @returns {undefined}
				 */
				cleanUp : function() {
					this.remove();
					this.unbind();
					this.model = null;
				},
				/**
				 * in the table display this is the code called by a click on
				 * the delete button
				 * 
				 * @param {type}
				 *            e
				 * @returns {undefined}
				 */
				deleteModel : function(e) {
					// mark the item selected
					this.vent.trigger("editModel", this.model);
					$('.selectedRow').removeClass('selectedRow');
					$(this.el).attr("class", "selectedRow");
					var r = window.confirm("Do you wish to delete '"
							+ this.model.get("name") + "'?")
					if (r == true) {
						this.vent.trigger("deleteModel", this.model);
						// prevent zombies
						this.cleanUp();
					}
				},
				render : function() {

					var html = _.template($('#rowTemplate').html(), this.model
							.toJSON());
					$(this.el).attr({
						"id" : this.model.get("id")
					});
					$(this.el).append(html);
				}

			}); // end restaurant view
			// //////////////RATINGS
			// //////////////////////////////////////////////////
			window.Ratings = Backbone.Model.extend({
				defaults : {

					id : null,
					reviewListing : "",
					starRating : 1
				},
				validate : function(attrs, options) {
					var errors = null;

					if (!attrs.reviewListing
							|| $.trim(attrs.reviewListing).length == 0) {
						errors = ("Review cannot be blank!");
					}
					if (errors != null)
						return errors;
					else
						return;
				}

			});// end Ratings model

			window.RatingsList = Backbone.Collection.extend({
				"model" : Ratings,
				"url" : _main_url+"review",
				initialize: function(reviewDTOs)
				{
					//this is a copy so add some extra stuff
					for (var i=0;i<reviewDTOs.length;i++)
					{
						reviewDTOs[i].isEditing = false;
						reviewDTOs[i].idx = i;
					}
					
				}

			});

			window.RatingsListView = Backbone.View.extend({
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

			window.RatingsView = Backbone.View.extend({
				tagName : "li",
		        optRender: {
		            interpolate: /\$\$(.+?)\$\$/gim,
		            evaluate: /\$\$(.+?)\$\$/gim
		        },

				initialize : function(options) {
					_.bindAll(this, "render","deleteRating","editRating","saveRating","cancelRating");
					this.parentRestaurant = options.parentRestaurant;
					this.vent = options.vent;
					
				},
				
				events : {
					"click .editRatingClass"   : "editRating",
					"click .deleteRatingClass" : "deleteRating" ,
					"click .saveRatingClass"   : "saveRating",
					"click .cancelRatingClass" : "cancelRating" ,

				},
		
				deleteRating: function()
				{
					 var r = confirm("Do you wish to remove this review?")
			            if (r == true)
			            {
							var opts = {"url": _main_url +"review/"+this.parentRestaurant.get("id")+"/"+this.model.get("id")};
							this.model.destroy(opts);
							this.vent.trigger("refreshRatings");
			            }
				},
				/**
				 * prep the item for saving, just marks it to display the edit boxes
				 */
				editRating: function()
				{ 
					//console.log("hit edit rating "+this.model.get("reviewListing"));
					this.vent.trigger("reshowEditList",this.model.get("idx"));
				},
				/**
				 * when it edit mode this is the code for the save button
				 */
				saveRating: function()
				{
					//override the url to allow for parent and child ids
					
					var opts = {"url": _main_url +"review/"+this.parentRestaurant.get("id")+"/"+this.model.get("id")};
					var tempListing = $(this.el).find('span #r_reviewListing').val();
					var errorAreaRef = $(this.el).find("#error_message");
					if (!tempListing || $.trim(tempListing).length == 0) {
						 errorAreaRef.html("Review cannot be blank!")
						 errorAreaRef.show();
						 return;
					}
					errorAreaRef.html("");
					errorAreaRef.hide();
					this.model.set("reviewListing",tempListing);
					this.model.set("starRating",$(this.el).find('span #s_starRating').val())
					
					 
					//all three values required in params
					this.model.save(this.model.toJSON(),opts)
					this.model.set("isEditing",false);
					this.vent.trigger("refreshRatings");
					this.render();
				//	this.render();
					
				},
				cancelRating: function()
				{
					console.log("hit cancel rating "+this.model.get("reviewListing"));
					this.model.set("isEditing",false) ;
					this.render();
				},
				
		        /**
		         * calculate the html for the star rating drop down
		         * @param {type} starRating
		         * @returns {String|html}
		         */
		        calculateDropDown: function(starRating)
		        {
		            var html = "";
		            var h = "";
		            var starValue = parseInt(starRating);
		            for (var i = 1; i < 15; i++)
		            {
		                if (starValue == i)
		                {
		                    h = "<option selected>" + i + "</option>";
		                }
		                else
		                {
		                    h = "<option>" + i + "</option>";
		                }
		                html = html + h;
		            }
		            return html;
		        },
				
				render: function() {

	                 var ro_html = _.template($('#reviewTemplate').html(), this.model.toJSON());
	                 var edit_html = _.template($('#reviewEditTemplate').html(), this.model.toJSON());
	                 var dd = {};
	                 dd.star_select_content = this.calculateDropDown(this.model.get("starRating"));
	                 edit_html = _.template(edit_html, dd, this.optRender);
	            	 this.$el.empty();
	            	 var editState = this.model.get("isEditing")
	                 if (editState == false)
	                	 this.$el.html(ro_html);
	                 else
	                	 this.$el.html(edit_html);
					
				}

			});

			// ////////////GLOBAL
			// /////////////////////////////////////////////////////

			var vent = _.extend({}, Backbone.Events);
			// TODO load the data by placing the JSON into a variable via Spring
			// MVC
			window.myRestaurantList = new RestaurantList(restaurantData);
			window.myRestaurantFormView = new RestaurantFormView({
				"vent" : vent
			});
			window.myRestaurantFormView.render();
			window.myRatingsListView = new RatingsListView({"vent": vent});
			window.restaurantListView = new RestaurantListView({
				"vent" : vent,
				collection : window.myRestaurantList
			});
			window.restaurantListView.render();
		}); // end document ready
