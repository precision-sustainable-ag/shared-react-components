import axios from "axios";
import { wktToGeoJSON } from "@terraformer/wkt";
import { fieldIconString } from "../../assets/icons/FieldIcon";
import { CustomControl } from "./CustomControl";

export class CropSequenceBoundary extends CustomControl {
  constructor(mapRef, drawerRef, locationRef, updateFeatures, features) {
    super(
      () => this.findFields(),
      "Search for a Field Boundary",
      fieldIconString
    );

    this.mapRef = mapRef;
    this.drawerRef = drawerRef;
    this.locationRef = locationRef;
    this.updateFeatures = updateFeatures;
    this.features = features;
  }

  showNoFieldModal() {
    const modal = document.getElementById("NoFieldFound");
    if (modal) modal.showModal();
  }

  findFields() {

    if (this.features && this.features.length > 0) {
      const userConfirmed = window.confirm(
        "A boundary is already on the map. Do you want to replace it?"
      );
      
      if (!userConfirmed) {
        return;
      }
    }

    // Clear existing polygons before adding the new one.
    if (this.drawerRef.current) {
      this.drawerRef.current.deleteAll();
    }

    const { lat, lon } = this.locationRef.current;

    axios
      .get("https://polygons.vegspec.org/csb", {
        params: { lat, lon },
      })
      .then((response) => {
        if (response.data && response.data.polygon) {
          // The API response is a WKT string - convert it to a GeoJSON
          const geoJSON = wktToGeoJSON(response.data.polygon);
          const featureCollection =
            geoJSON.type === "MultiPolygon"
              ? {
                  type: "FeatureCollection",
                  features: geoJSON.coordinates.map((coords, i) => ({
                    type: "Feature",
                    id: `api-poly-${i}`,
                    properties: {},
                    geometry: {
                      type: "Polygon",
                      coordinates: coords,
                    },
                  })),
                }
              : {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      id: "api-poly-0",
                      properties: {},
                      geometry: geoJSON,
                    },
                  ],
                };

          const sourceId = "api-field-boundary";

          // Remove existing source if already present
          if (this.mapRef.current.getSource(sourceId)) {
            this.mapRef.current.removeSource(sourceId);
          }

          // Add source to the map
          this.mapRef.current.addSource(sourceId, {
            type: "geojson",
            data: featureCollection,
          });

          // This functions scans all the map sources and adds them into the editable drawing tool
          this.updateFeatures();

          // Delete the source as it is now added to the drawing tool
          this.mapRef.current.removeSource(sourceId);
        } else {
          this.showNoFieldModal();
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        this.showNoFieldModal();
      });
  }
}
