sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.fhir.controller.Master", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;

			this.oRouter.getRoute("master").attachPatternMatched(this._onViewDefinitionMatched, this);
			this.oRouter.getRoute("accounts").attachPatternMatched(this._onViewDefinitionMatched, this);
			
			//this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			//this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
		},
		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			//var	productPath = oEvent.getSource().getSelectedItem().getBindingContext("products").getPath(),
			//	product = productPath.split("/").slice(-1).pop();
			//var product = 95;

			this.oRouter.navTo("accounts", {layout: oNextUIState.layout});
		},
		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function (oEvent) {
			MessageBox.show("This functionality is not ready yet.", {
				icon: MessageBox.Icon.INFORMATION,
				title: "Aw, Snap!",
				actions: [MessageBox.Action.OK]
			});
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			//var oView = this.getView(),
				//oTable = oView.byId("productsTable"),
				//oTable = oView.byId("bcTable"),
				//oBinding = oTable.getBinding("items"),
				//oSorter = new Sorter("name", this._bDescendingSort);

			//oBinding.sort(oSorter);
		},

		_onProductMatched: function (oEvent) {
			//var sProduct = oEvent.getParameter("arguments").product || this._product || "0",
			//	oTable = this.byId("productsTable");
			//oTable.getItems()[oTable.getBinding("items").aIndices.indexOf(+sProduct)].setSelected(true);
		},

		_onViewDefinitionMatched: function (oEvent) {
			var oViewDefinition = oEvent.getParameter("arguments");
		}
	});
});
