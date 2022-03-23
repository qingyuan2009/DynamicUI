sap.ui.define([
	"sap/base/util/UriParameters",
	"sap/ui/core/UIComponent",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/ui/mdc/link/FakeFlpConnector",
	"sap/ui/model/json/JSONModel",
	"sap/ui/fhir/util/FHIRMetadataProvider",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UriParameters, UIComponent, FakeLrepConnectorLocalStorage, FakeFlpConnector, JSONModel, FHIRMetadataProvider, library, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	var LayoutType = library.LayoutType;

	return UIComponent.extend("sap.ui.fhir.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = new JSONModel();
			this.setModel(oModel, "layout");

			this.getRouter().initialize();

			//FakeLrepConnectorLocalStorage.enableFakeConnector();
			//this.__initFakeFlpConnector();

			// master view content -> load all BC view definitions
			var oViewDefinitionModel = new JSONModel(sap.ui.require.toUrl("sap/ui/fhir/mockdata/ViewDefinition.json"));
			oViewDefinitionModel.setSizeLimit(1000);
			this.setModel(oViewDefinitionModel, "viewDefinition");
			
			//local FHIR service
			const sServiceUri = this.getMetadata().getManifestEntry("/sap.app/dataSources/fhir/uri");
			//Get view definition
			const oResourceTypes = this.getMetadata().getManifestEntry("/sap.ui.fhir/resourceTypes");
			//Get view defitition 
			const configurationUri = jQuery.sap.getUriParameters().get("configuration-url"); // "/json/resource-types.json"
			
			FHIRMetadataProvider.init(sServiceUri, oResourceTypes, configurationUri);
		},

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		 getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
			oParams = UriParameters.fromQuery(location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: 2,
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
/*		
		__initFakeFlpConnector: function() {
			FakeFlpConnector.enableFakeConnector({
				'FakeFlpSemanticObject': {
					links: [
						{
							action: "action_01",
							intent: self.location.pathname + "#/Books/{ID}",
							text: "Manage book",
							icon: "/testsuite/test-resources/sap/ui/documentation/sdk/images/HT-1031.jpg",
							isMain: true,
							description: "{title}"
						},
						{
							action: "action_02",
							intent: self.location.pathname + "#/Authors/{author_ID}",
							text: "Manage author",
							description: "{author/name}"
						}
					]
				}
			});
		}
*/
	});
});