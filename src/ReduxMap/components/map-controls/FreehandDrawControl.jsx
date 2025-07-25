import { CustomControl } from "./CustomControl";
import centroid from "@turf/centroid";

const freehandIcon = `<svg
                        id="polygon-tool" class="mapboxgl-ctrl-icon custom-icon"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 
                            0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                          fill="#000"
                          transform="scale(0.8)
                          translate(3, 3)"
                        />
                      </svg>`;

export class FreehandDrawControl extends CustomControl {
  constructor(mapRef, drawerRef, hasDrawing, updateFeatures) {
    super(() => this.toggleDrawingMode(), "Freehand Draw", freehandIcon);

    this.mapRef = mapRef;
    this.drawerRef = drawerRef;
    this.hasDrawing = hasDrawing;
    this.updateFeatures = updateFeatures;

    this.lineData = this.createNewLine();
    this.fpolygon = [[]];

    this._handleDrawModeChange = this._handleDrawModeChange.bind(this);
  }

  isFreeHandDrawingActive() {
    return this.button?.classList?.contains("active");
  }

  createNewLine() {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
          properties: {},
        },
      ],
    };
  }

  /** Toggles freehand drawing mode
   * (onClick function for CustomControl)
   */
  toggleDrawingMode() {
    const polygonButton = document.querySelector(".mapbox-gl-draw_polygon");

    if (!this.isFreeHandDrawingActive()) {
      this.button.classList.add("active");
      if (this.hasDrawing && polygonButton) {
        polygonButton.style.display = "none";
        if (this.drawerRef.current) {
          this.drawerRef.current.changeMode("draw_polygon");
        }
      }
      if (this.mapRef.current) {
        this.mapRef.current.dragPan.disable();
      }
    } else {
      this.button.classList.remove("active");
      if (this.hasDrawing && polygonButton) {
        polygonButton.style.display = "block";
        if (this.drawerRef.current) {
          this.drawerRef.current.changeMode("simple_select");
        }
      }
      if (this.mapRef.current) {
        this.mapRef.current.dragPan.enable();
      }
    }
  }

  _handleDrawModeChange(e) {
    // If this.button is not available (e.g., control removed before event fires), do nothing.
    if (!this.button || !this.mapRef || !this.mapRef.current) return;

    if (e.mode === "draw_polygon") {
      // If MapboxDraw polygon tool is activated, hide the freehand button.
      this.button.style.display = "none";
      if (this.isFreeHandDrawingActive()) {
        this.button.classList.remove("active");
        this.mapRef.current.dragPan.enable();
      }
    } else {
      this.button.style.display = "block";
    }
  }

  onAdd(map) {
    const container = super.onAdd(map);

    if (this.hasDrawing && this.drawerRef.current && this.mapRef.current) {
      this.mapRef.current.on("draw.modechange", this._handleDrawModeChange);
    }

    map.on("style.load", () => {
      this.mapRef.current.addSource("line", {
        type: "geojson",
        data: this.lineData,
      });

      this.mapRef.current.addLayer({
        id: "line-layer",
        type: "line",
        source: "line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#fff",
          "line-width": 3,
        },
      });

      this.mapRef.current.on("mousedown", (e) => {
        if (!this.isFreeHandDrawingActive()) return;

        const lnglat = e.lngLat.wrap();
        this.lineData = this.createNewLine();
        this.lineData.features[0].geometry.coordinates.push([
          lnglat.lng,
          lnglat.lat,
        ]);
        this.fpolygon = [[lnglat.lng, lnglat.lat]];
      });

      this.mapRef.current.on("mousemove", (e) => {
        if (!this.isFreeHandDrawingActive() || this.fpolygon[0].length === 0)
          return;

        const lnglat = e.lngLat.wrap();
        this.lineData.features[0].geometry.coordinates.push([
          lnglat.lng,
          lnglat.lat,
        ]);
        this.mapRef.current.getSource("line").setData(this.lineData);
        this.fpolygon.push([lnglat.lng, lnglat.lat]);
      });

      this.mapRef.current.on("mouseup", () => {
        if (!this.isFreeHandDrawingActive()) return;

        const id = `freehand${+new Date()}`;
        const created = this.fpolygon.length > 1;

        // If polygon created, add it to the map and update lat, lon and reset this.lineData
        if (created) {
          this.mapRef.current.addPolygon(id, [this.fpolygon], {
            "fill-color": "#f00",
            "fill-opacity": 0.1,
            "line-width": 1,
            "line-color": "#ddd",
          });

          const [newLon, newLat] = centroid(this.lineData.features[0]).geometry
            .coordinates;
          this.lineData = this.createNewLine();
          this.mapRef.current.getSource("line").setData(this.lineData);
          this.updateFeatures(newLat, newLon);
        }

        // Deactivate freehand drawing and clean up drawing layers and sources
        this.button.classList.remove("active"); // Change toggle to remove to ensure we know the state
        this.fpolygon = [[]];
        const { layers } = this.mapRef.current.getStyle();
        layers.forEach((lay) => {
          if (lay.source === id) {
            this.mapRef.current.removeLayer(lay.id);
          }
        });

        if (created) {
          this.mapRef.current.removeSource(id);
        }

        this.mapRef.current.dragPan.enable();

        if (this.hasDrawing) {
          document.querySelector(".mapbox-gl-draw_polygon").style.display =
            "block";
          this.drawerRef.current.changeMode("simple_select");
        }
      });
    });

    return container;
  }

  onRemove() {
    // Remove the specific event listener for draw.modechange
    if (
      this.mapRef.current &&
      typeof this._handleDrawModeChange === "function"
    ) {
      this.mapRef.current.off("draw.modechange", this._handleDrawModeChange);
    }

    super.onRemove();
  }
}
