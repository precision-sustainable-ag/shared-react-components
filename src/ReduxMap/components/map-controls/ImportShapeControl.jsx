import proj4 from "proj4";
import * as shapefile from "shapefile";
import { CustomControl } from "./CustomControl";

const acreDiv = 4046.856422;
import uploadIcon from "../../assets/icons/upload.png";

const isLikelyWGS84 = (coords) => {
  if (!Array.isArray(coords) || coords.length === 0) return false;

  const sample = Array.isArray(coords[0]) ? coords[0][0] : coords; // Handle nested arrays
  const [x, y] = sample;

  return y >= -90 && y <= 90 && x >= -180 && x <= 180;
};

const convertToWGS84 = (coords, fromCRS) => {
  if (!fromCRS || fromCRS === "EPSG:4326") return coords;

  const projStrings = {
    "EPSG:3857": "EPSG:4326", // Web Mercator to WGS84
  };

  if (fromCRS.startsWith("EPSG:269")) {
    const zone = fromCRS.slice(-2);
    projStrings[
      fromCRS
    ] = `+proj=utm +zone=${zone} +datum=NAD83 +units=m +no_defs`;
  }

  return proj4(projStrings[fromCRS], "EPSG:4326", coords);
};

const parsePRJ = (prjText) => {
  console.log("📄 .prj File Contents:\n", prjText);

  // Match UTM zone from PROJCS["NAD_1983_UTM_Zone_XXN"]
  const match = prjText.match(/NAD_1983_UTM_Zone_(\d+)N/);

  if (match) {
    const zone = parseInt(match[1], 10);
    const epsgCode = `EPSG:269${zone}`; // NAD83 UTM Zone

    console.log(`✅ Detected UTM Zone: ${zone} (${epsgCode})`);
    return epsgCode;
  }

  console.warn("⚠️ Could not determine projection from .prj file.");
  return null;
};

/**
 * Loads and processes a shapefile uploaded by the user.
 *
 * This function reads a shapefile from an uploaded file using the File API,
 * processes the shapefile's geometry to calculate the centroid, bounding box,
 * and area. The processed data is then used to update the map's features, bounds,
 * polygon area, and the latitude/longitude of the map's center.
 */
const loadShapeFile = (
  event,
  turf,
  map,
  setFeatures,
  setBounds,
  setPolygonArea,
  setLat,
  setLon
) => {
  const files = event.target.files;
  let shpFile = null,
    prjFile = null;

  for (let file of files) {
    if (file.name.endsWith(".shp")) shpFile = file;
    if (file.name.endsWith(".prj")) prjFile = file;
  }

  if (!shpFile) {
    alert("Please upload a .shp file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const arrayBuffer = reader.result;
    const layers = [];

    let projection = null;

    if (prjFile) {
      try {
        const prjText = await prjFile.text();
        projection = parsePRJ(prjText);
        console.log("📌 Detected Projection:", projection);
      } catch (error) {
        console.warn(
          `⚠️ Could not read .prj file. Defaulting to automatic detection.  Error: ${error.message}`
        );
      }
    }

    shapefile
      .open(arrayBuffer)
      .then((source) => {
        source
          .read()
          .then(function log(result) {
            if (result.done) return;
            const { geometry } = result.value;

            // ✅ Step 1: If coordinates are already WGS84, no transformation is needed
            if (isLikelyWGS84(geometry.coordinates)) {
              console.log("✅ Data is already in WGS84, skipping projection.");
            } else {
              // ⚠️ Step 2: Use `.prj` file if available, otherwise ask user
              if (!projection) {
                const userZone = prompt(
                  "⚠️ No .prj file detected.\n\nPlease enter the correct UTM zone\n(e.g., 10 for Zone 10, 11 for Zone 11):"
                );

                if (userZone && userZone.match(/^\d{1,2}$/)) {
                  projection = `EPSG:269${userZone}`;
                  console.log(
                    `✅ User selected UTM Zone: ${userZone} (EPSG:${projection})`
                  );
                } else {
                  alert("Invalid UTM zone. Unable to determine CRS.");
                  return;
                }
              }

              // Convert coordinates to WGS84
              if (geometry.type === "MultiPolygon") {
                geometry.coordinates = geometry.coordinates.map((polygon) =>
                  polygon.map((ring) =>
                    ring.map((coord) => convertToWGS84(coord, projection))
                  )
                );
              } else if (
                geometry.type === "Polygon" ||
                geometry.type === "MultiLineString"
              ) {
                geometry.coordinates = geometry.coordinates.map((ring) =>
                  ring.map((coord) => convertToWGS84(coord, projection))
                );
              } else if (
                geometry.type === "LineString" ||
                geometry.type === "MultiPoint"
              ) {
                geometry.coordinates = geometry.coordinates.map((coord) =>
                  convertToWGS84(coord, projection)
                );
              } else if (geometry.type === "Point") {
                geometry.coordinates = convertToWGS84(
                  geometry.coordinates,
                  projection
                );
              }
            }

            layers.push(result.value);
            return source.read().then(log);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            map.getContainer().scrollIntoView();

            const fc = {
              type: "FeatureCollection",
              features: layers,
            };
            const [avgLon, avgLat] = turf.centroid(fc).geometry.coordinates;

            setFeatures(layers);
            setBounds(turf.bbox(fc));
            setPolygonArea(turf.area(fc) / acreDiv);
            setLat(avgLat);
            setLon(avgLon);
          });
      })
      .catch((error) => {
        alert(`Could not process file:\n${error}`);
        console.log(error);
      });
  };

  reader.readAsArrayBuffer(shpFile);
};

export class ImportShapeControl extends CustomControl {
  constructor(turf, setFeatures, setBounds, setPolygonArea, setLat, setLon) {
    super(
      () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".shp, .prj"; // Accept only .shp and .prj files
        fileInput.multiple = true;
        fileInput.style.display = "none";

        // Append to the body and trigger click
        document.body.appendChild(fileInput);
        fileInput.click();

        // Handle file selection
        fileInput.addEventListener("change", (event) => {
          loadShapeFile(
            event,
            turf,
            this._map,
            setFeatures,
            setBounds,
            setPolygonArea,
            setLat,
            setLon
          );
          document.body.removeChild(fileInput); // Remove input after use
        });
      },
      "Import a shape file",
      uploadIcon
    );
  }
}
