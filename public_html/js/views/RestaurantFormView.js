
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
                    "deleteModel", "validateFail", "errorCallBack", "successCallBack");
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
        
        state: 'ADD', //  ADD, EDIT, ADD|ERROR, EDIT|ERROR

        /**
         * used by callbacks to signal what event
         * 
         */
        eventName: null,
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
            this.state = "EDIT"
            // this.model.bind("invalid", this.handleInvalidInput,
            // this);
           
            this.render();
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
            this.state = "ADD"
           
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
            sample.version = $('#version').val();
            
            this.eventName = eventName;
            var vResult = this.model.validate(sample);
            if (!vResult) {
               
                //TODO put error handling here
                var opts = {

                    error: this.errorCallBack,
                    success: this.successCallBack   };
                
               //     this.model.set(sample); 
                    this.model.save(sample, opts);
                
               

            } else {
                this.validateFail(vResult);
            }

        },
        render: function () {
            var html = this.template(this.model.toJSON());
            $('#restaurantFormViewItems').html(html);
            if (this.state === 'ADD' )
            {
                $('#saveEdits').hide();
            }
            if (this.state === 'EDIT' )
            {
                 $('#saveEdits').show();
            }
            if (this.state === 'EDIT|ERROR' )
            {
                 $('#saveEdits').show();
            }
            if (this.state === 'ADD|ERROR' )
            {
                 $('#saveEdits').hide();
            }

        },

        errorCallBack: function (a,responseBody,c)
        {
            if (this.state === "EDIT")
                this.model.set(this.model._previousAttributes);
            this.state = this.state+"|ERROR";
            this.render();
            var t = "ERROR on save " +  responseBody.status +" "+responseBody.statusText;
            var errors = [];
            errors.push(t)
            this.validateFail(errors);
        },

        successCallBack: function (model, response, options)
        {
          
            this.render();
            this.clearFields();
            if (this.eventName != null)
            {
                this.vent.trigger(this.eventName, this.model);
                this.eventName = null;
            }
        }



    });


    return restaurantFormView;

});