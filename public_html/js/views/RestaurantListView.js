

define([
    'jquery',
    'underscore',
    'backbone',
    'views/RestaurantView'
], function ($, _, Backbone,RestaurantView) {



    var restaurantListView = Backbone.View.extend({
        el: '#listPoint',
        viewCollection: [],
        initialize: function (options) {
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
        sync: function (e) {
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
        addModel: function (model) {
            // these options are for the create method, and the wait
            // says
            // wait for the 200 response from the server before
            // continuing
            // the success call back is called when the process is
            // complete
            // these aren't used right now
            var options = {
                wait: true,
                success: function (model, resp, newopt) {
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
        editModel: function (model) {

        },
        /**
         * handler for the save event, at this time, not used
         * 
         * @param {type}
         *            newModel
         * @returns {undefined}
         */
        saveModel: function (newModel) {
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
        deleteModel: function (model) {
            this.collection.remove(model);
            model.destroy();
        },
        /**
         * clean up the old views, otherwise during rendering they will
         * be held by references of events to the DOM
         * 
         * @returns {undefined}
         */
        cleanViewCollection: function () {
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
        renderRestaurant: function (invModel, container) {

            var restaurantView = new RestaurantView({
                "model": invModel,
                "vent": this.vent
            });
            this.viewCollection.push(restaurantView);
            restaurantView.render();
            container.appendChild(restaurantView.el);
        },
        render: function () {
            $(this.el).empty();
            this.cleanViewCollection();
            var container = document.createDocumentFragment();
            for (var i = 0; i < this.collection.length; i++)
                this.renderRestaurant(this.collection.at(i), container);
            $(this.el).append(container);
        }

    }); // end restaurant list view

    return restaurantListView;

});