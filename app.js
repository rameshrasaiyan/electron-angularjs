var electronApp = angular.module('electronApp', ['ui.router'])
    .constant("ENDPOINT_URI", "http://localhost:3000/api/")
    .service("ItemsModel", function($http, ENDPOINT_URI) {
        var service = this,
            path = "items/";

        function getUrl() {
            return ENDPOINT_URI + path;
        }

        function getUrlForId(itemID) {
            return getUrl(path) + itemID;
        }

        service.all = function() {
            return $http.get(getUrl());
        };

        service.fetch = function(itemId) {
            return $http.get(getUrlForId(itemId))
        };

        service.create = function(item) {
            return $http.post(getUrl(), item)
        };

        service.update = function(itemId, item) {
            return $http.put(getUrlForId(itemId), item)
        };

        service.destroy = function(itemId) {
            return $http.delete(getUrlForId(itemId))
        };
    });

electronApp.controller("MainCtrl", function(ItemsModel) {
    var main = this;

    function getItems() {
        ItemsModel.all()
            .then(function(result) {
                main.items = result.data;
            })
    }

    function createItem(item) {
        ItemsModel.create(item)
            .then(function(result) {
                initCreateForm();
                getItems();
            })
    }

    function updateItem(item) {
        ItemsModel.update(item.id, item)
            .then(function(result) {
                cancelEditing();
                getItems();
            })
    }

    function deleteItem(itemId) {
        ItemsModel.destroy(itemId)
            .then(function(result) {
                cancelEditing();
                getItems();
            })
    }

    function initCreateForm() {
        main.newItem = {name: '', description: ''}
    }

    function setEditedItem(item) {
        main.editedItem = angular.copy(item);
        main.isEditing = true;
    }

    function isCurrentItem(itemId) {
        return main.editedItem !== null && main.editedItem.id === itemId;
    }

    function cancelEditing() {
        main.editedItem = null;
        main.isEditing = false;
    }

    main.items = [];
    main.editedItem = null;
    main.isEditing = false;
    main.getItems = getItems;
    main.createItem = createItem;
    main.updateItem = updateItem;
    main.deleteItem = deleteItem;
    main.setEditedItem = setEditedItem;
    main.isCurrentItem = isCurrentItem;
    main.cancelEditing = cancelEditing;

    initCreateForm();
    getItems();
});