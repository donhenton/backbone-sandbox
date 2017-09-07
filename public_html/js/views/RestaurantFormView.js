
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/formTemplate.html',
    'models/RestaurantModel'
], function ($, _, Backbone, formTemplate, Restaurant) {


    var restaurantFormView = Backbone.View.extend({
        el: "#editArea",
        initialize: function (options) {
            this.model = new Restaurant();
            this.vent = options.vent;
            _.bindAll(this, "editModel", "saveEdits", "addRestaurant",
                    "deleteModel", "validateFail");
            options.vent.bind("editModel", this.editModel);
            options.vent.bind("deleteModel", this.deleteModel);
            options.vent.bind("validateFail", this.validateFail);
            this.bind("invalid", this.validateFail, this);
            this.template = _.template(formTemplate);
        },
        events: {
            "click #saveEdits": "saveEdits",
            "click #addRestaurant": "addRestaurant"

        },
        /**
         * the routine to run when saving an object fails--displays
         * errors
         * 
         * @param {type}
         *            errorSet an array of error strings
         * @returns {undefined}
         */
        validateFail: function (errorSet) {
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
        editModel: function (newModel) {
            this.model = newModel;
            // this.model.bind("invalid", this.handleInvalidInput,
            // this);

            this.render();
            $('#saveEdits').show();
            $('#errorItems').empty();
        },
        /**
         * responds to the event when a user clicks on the delete button
         * in the list of restaurants and clears the form
         * 
         * @returns {undefined}
         */
        deleteModel: function () {
            this.model = new Restaurant();
            this.clearFields();
        },
        /**
         * empty out the fields in the form
         * 
         * @returns {undefined}
         */
        clearFields: function () {
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
        addRestaurant: function () {
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
        saveEdits: function () {
            this.saveRestaurant("saveModel");
        },
        /**
         * main saving routine, with validation
         * 
         * @param {type}
         *            eventName such as add or save
         * @returns {undefined}
         */
        saveRestaurant: function (eventName) {
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
                //TODO put error handling here
                this.model.save();
                this.clearFields();
                if (eventName != null)
                    this.vent.trigger(eventName, this.model);
            } else {
                this.validateFail(vResult);
            }

        },
        render: function () {
            var html = this.template(this.model.toJSON());
            $('#restaurantFormViewItems').html(html);





        }
    });


    return restaurantFormView;

});