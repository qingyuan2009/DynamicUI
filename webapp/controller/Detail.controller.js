sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/fhir/util/HttpHandler",
	"sap/fhir/model/r4/FHIRFilter",
	"sap/fhir/model/r4/FHIRFilterType",
	"sap/ui/fhir/type/FHIRDate",
	"sap/ui/fhir/type/FHIRDateTime",
	"sap/ui/mdc/Table",
	"sap/ui/mdc/FilterBar",
	"sap/ui/mdc/FilterField",
	"sap/ui/mdc/table/Column",
	"sap/ui/mdc/table/ResponsiveTableType",
	"sap/ui/mdc/Field",
	"sap/ui/mdc/field/FieldValueHelp",
	"sap/ui/mdc/field/ConditionFieldHelp"

], function (Controller, UIComponent, HttpHandler, FHIRFilter, FHIRFiltertype, FHIRDate, FHIRDateTime, MDCTable, FilterBar,
	FilterField, mdcColumn, ResponsiveTableType, mdcField, FieldValueHelp, ConditionFieldHelp) {

	"use strict";

	return Controller.extend("sap.ui.fhir.controller.Detail", {

		onInit: function () {
			UIComponent.getRouterFor(this).getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
			//const fd = new FHIRDate();
			//const i = 0;			
			//const oTable = this.getView();
			//oTable.addEventDelegate({
			//onAfterRendering: function() {
			//sap.m.MessageBox.show("get layout");
			//}			      
			//}, oTable);

			this._initMDCTable();
		},

		onRowPress: function (oEvent) {

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
			const oContext = oEvent.getParameter("bindingContext") || oEvent.getSource().getBindingContext();
			UIComponent.getRouterFor(this).navTo("accountdetails",
				{ layout: oNextUIState.layout, accountId: oContext.getProperty("id") });
		},

		_onRouteMatched: function (oEvent) {
			//const table = this.getView().byId("accountsTable");
			//const rowBinding = table.getRowBinding();
			//if (rowBinding) {
			//	rowBinding.refresh();
			//}
		},

		onColumnPress: function (oEvent) {
			sap.m.MessageBox.show("get layout");

		},

		handleFullScreen: function () {
			//this.bFocusFullScreenButton = true;			
			//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");			
			//this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.oRouter.navTo("detail", {layout: oNextUIState.layout});
		},

		_initMDCTable: function () {

			var oMDCContainer = this.byId("mdcContainer");

			var oFilterField =	new sap.ui.mdc.FilterField('ff3',
				{	
					delegate: {
						name: "sap/ui/fhir/delegate/FHIRFieldBaseDelegate",
						payload: {}
					},
					label: "Department",
					dataType: "sap.ui.model.type.String",
					operators: "EQ,LE,LT,GE,GT,BT",
					fieldHelp: "FHDepartmentName",
					maxConditions:2,
					conditions: "{$filters>/conditions/organizationName}"
				}
			);

			var oFilterBar = new FilterBar("accountsFilterBar", {
				liveMode: false,
				delegate: {
					name: "sap/ui/fhir/delegate/ExceptionAccountFilterBarDelegate",
					payload: { collectionName: 'ExceptionAccount' }
				},
				p13nMode: ["Item", "Value"],
				filterItems: [
					oFilterField
					//new FilterField({
					//	delegate: {
					//		name: "sap/ui/fhir/delegate/FHIRFieldBaseDelegate",
					//		payload: {}
					//	},
					//	label: "Department",
					//	dataType: "String",
					//	operators: "EQ,LE,LT,GE,GT,BT",
					//	conditions: "{$filters>/conditions/name}"
						//fieldHelp: new FieldValueHelp('vh1', {
						//filterFields: "*name*",
						//title: "Department",
						//open: this._onValueHelpOpen.bind(this),
						//noDialog: false,
						//showConditionPanel: true,
						//keyPath: "name",
						//descriptionPath: "name"
						//})
					//})
				]
			});


			var oFieldValueHelp = new sap.ui.mdc.field.FieldValueHelp('vh1',
				{
					filterFields: "*name*",
					title: "Department",
					id: "FHDepartmentName",
					noDialog: false,
					showConditionPanel: true,
					keyPath: "name",
					descriptionPath: "name",
					open: this._onValueHelpOpen.bind(this)
				}
			);

			oFilterBar.addDependent(oFieldValueHelp);
			oFilterField.setFieldHelp(oFieldValueHelp);

			var oMDCTable = new MDCTable("accountsTable", {
				header: "Open Cases",
				//filter:"accountsFilterBar",
				p13nMode: ['Column'],
				delegate: { name: 'sap/ui/fhir/delegate/ExceptionAccountTableDelegate', payload: { collectionName: 'ExceptionAccount' } },
				showRowCount: true,
				threshold: 20,
				autoBindOnInit: true,
				type: new ResponsiveTableType({ growingMode: "Scroll" }),
				filter: "accountsFilterBar",
				columns: [
					new mdcColumn({
						id: "id", header: "Billing Case Id", dataProperty: "ID",
						template: new mdcField({
							delegate: { name: 'sap/ui/mdc/field/FieldBaseDelegate', payload: {} },
							value: "{id}",
							editMode: "Display",
							multipleLines: true
						}), width: "15rem"
					}),
					new mdcColumn({
						id: "identifier", header: "Case Number", dataProperty: "identifier",
						template: new mdcField({
							delegate: { name: 'sap/ui/mdc/field/FieldBaseDelegate', payload: {} },
							value: "{identifier}",
							editMode: "Display",
							multipleLines: true
						})
					}),
					new mdcColumn({
						id: "type", header: "Scenario", dataProperty: "type",
						template: new mdcField({
							delegate: { name: 'sap/ui/mdc/field/FieldBaseDelegate', payload: {} },
							value: "{type}",
							editMode: "Display",
							multipleLines: true
						})
					})
				]

			});

			oFilterBar.addDependent(oFieldValueHelp);
			oMDCContainer.addContent(oFilterBar);
			oMDCContainer.addContent(oMDCTable);



		},

		_onValueHelpOpen: function (oEvent) {

			var oSource = oEvent.getSource();

			if (!oSource.getContent()) {
				var oTable = new sap.m.Table("organizationTable", {
					width: "30rem",
					columns: [
						new sap.m.Column({ header: new sap.m.Text({ text: "ID" }) }),
						new sap.m.Column({ header: new sap.m.Text({ text: "Name" }) })
					],
					items: {
						path: "/Organization",
						length: 10,
						growingScrollToLoad: true,
						growingThreshold: "20",
						template: new sap.m.ColumnListItem({
							type: "Active",
							cells: [
								new sap.m.Text({ text: "{id}" }),
								new sap.m.Text({ text: "{name}" })
							]
						})
					}
				});

				var oContent = new sap.ui.mdc.field.FieldValueHelpMTableWrapper();
				oSource.setContent(oContent);
				oTable.setWidth("100%");
				oContent.setTable(oTable);
				oTable.setModel(this.getView().getModel());
			}

		}

	});
});