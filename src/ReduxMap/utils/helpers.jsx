import area from '@turf/area';
import bbox from '@turf/bbox';
import { featureCollection, polygon } from '@turf/helpers';
import union from '@turf/union';
import wellknown from 'wellknown';
import boundaries from '../data/us_states-ca_ab-ca_on.json';

/**
 * Handles reverse geocoding from latitude and longitude to an address.

 * @param {Object} params - The parameters for reverse geocoding
 * @param {string} params.apiKey - Mapbox API key
 * @param {Function} params.setterFunc - Function to update address state
 * @param {number} params.zoom - Current map zoom level
 * @param {number} params.latitude - Latitude of the location
 * @param {number} params.longitude - Longitude of the location
 */
async function geocodeReverse({ apiKey, setterFunc, zoom, latitude, longitude }) {
  await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude}%2C%20${latitude}.json?access_token=${apiKey}`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        setterFunc((prevVal) => {
          const value = (parm) =>
            data.features.filter((feature) => feature.id.includes(parm))[0]?.text;

          const stateCode = () => {
            const f = data.features.filter((feature) => feature.id.includes('region'))[0];
            return f?.properties?.short_code?.split('-')[1];
          };

          const newVal = {
            ...prevVal,
            fullAddress: data.features[0].place_name,
            address: data.features[0].place_name.split(',')[0],
            zipCode: value('postcode'),
            city: value('place'),
            county: value('district'),
            state: value('region'),
            stateCode: stateCode(),
            zoom,
            latitude,
            longitude,
          };
          return newVal;
        });
      }
    });
}

/**
 * Given a query in the form "lng, lat" or "lat, lng"
 * returns the matching geographic coordinate(s)
 * as search results in carmen geojson format,
 * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 *
 * @param {string} query - A string representing coordinates in the form
 * @returns An array of coordinates
 */
const coordinatesGeocoder = (query) => {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      place_name: `Lat: ${lat} Lng: ${lng}`,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature',
    };
  }

  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];

  if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    // geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

/**
 * Calculates the area of a set of GeoJSON features in acres.
 *
 * @param {Array} features - An array of GeoJSON feature objects (polygons).
 * @returns {number} The total area of the features in acres.
 */
const calcArea = (f) => {
  const ACRE_DIVISION = 4046.856422;

  const newFeatures = JSON.parse(JSON.stringify(f));
  let totalArea = 0;

  if (newFeatures.length === 1) {
    totalArea = area(newFeatures[0]) / ACRE_DIVISION;
  } else {
    const polygons = newFeatures.map((feature) => {
      feature.geometry.coordinates[0].push(feature.geometry.coordinates[0][0]); // may not be self-closing
      return polygon(feature.geometry.coordinates);
    });

    if (polygons.length) {
      const combinedPolygon = union(featureCollection(polygons));
      totalArea = area(combinedPolygon) / ACRE_DIVISION;
    }
  }

  return totalArea;
};

/**
 * Fetches the elevation for a given latitude and longitude.
 *
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 * @param {Object} elevations - Cached elevation data.
 * @param {Function} setElevation - Function to update the elevation state.
 */
const getElevation = async (lat, lon, elevations, setElevation) => {
  const latLon = `${(+lat).toFixed(4)} ${(+lon).toFixed(4)}`;
  if (!elevations[latLon] && elevations[latLon] !== '...') {
    elevations[latLon] = '...';
    elevations[latLon] = (
      await (
        await fetch(`https://weather.covercrop-data.org/elevation?lat=${lat}&lon=${lon}`)
      )?.json()
    )?.elevation;
    elevations[latLon] = (elevations[latLon] * 3.281).toFixed(0) || '...';
  }
  setElevation(elevations[latLon]);
};

/**
 * Adds a polygon to the map with various styling and interaction options.
 *
 * @param {Object} map - The Mapbox map reference
 * @param {number} boundsPadding - Padding for map bounds
 */
const addPolygonToMap = (map, boundsPadding) => {
  return (id, poly, options = {}) => {
    if (typeof poly === 'string') {
      fetch(poly)
        .then((response) => response.json())
        .then((data) => {
          if (data.length) {
            map.current.addPolygon(id, data[0].polygonarray[0], options);
          } else if (data.polygonarray) {
            // doesn't work for all hardiness zones !!!
            map.current.addPolygon(id, data.polygonarray[0], options);
          } else if (data.polygon) {
            const geojson = wellknown(data.polygon);
            console.log(geojson);
            map.current.addPolygon(id, geojson, options);
          }
        });
      return;
    }

    const lineId = `${id}-line`;

    const polygonStyle = {
      'fill-color': options['fill-color'] ?? '#000',
      'fill-opacity': options['fill-opacity'] ?? 1,
    };

    const lineStyle = {
      'line-color': options['line-color'] ?? '#000',
      'line-opacity': options['line-opacity'] ?? 1,
      'line-width': options['line-width'] ?? 1,
    };

    if (map.current.getLayer(id)) {
      map.current.removeLayer(id);
    }
    if (map.current.getLayer(lineId)) {
      map.current.removeLayer(lineId);
    }

    if (map.current.getSource(id)) {
      map.current.removeSource(id);
    }

    map.current.addSource(id, {
      type: 'geojson',
      data: /Polygon/.test(poly.type)
        ? poly
        : {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: poly,
            },
          },
    });

    map.current.addLayer({
      id,
      type: 'fill',
      source: id,
      paint: polygonStyle,
    });

    map.current.addLayer({
      id: lineId,
      type: 'line',
      source: id,
      paint: lineStyle,
    });

    map.current.on('mouseenter', id, () => {
      map.current.setPaintProperty(lineId, 'line-width', 2);
      map.current.setPaintProperty(lineId, 'line-color', '#aaa');

      ['fill-color', 'fill-opacity'].forEach((prop) => {
        if (options.hover?.[prop]) {
          map.current.setPaintProperty(id, prop, options.hover[prop]);
        }
      });

      ['line-width', 'line-color', 'line-opacity'].forEach((prop) => {
        if (options.hover?.[prop]) {
          map.current.setPaintProperty(lineId, prop, options.hover[prop]);
        }
      });
    });

    map.current.on('mouseleave', id, () => {
      Object.entries(polygonStyle).forEach(([property, value]) => {
        map.current.setPaintProperty(id, property, value);
      });

      Object.entries(lineStyle).forEach(([property, value]) => {
        map.current.setPaintProperty(lineId, property, value);
      });
    });

    if (options.fitBounds) {
      const boundingBox = bbox(
        /Polygon/.test(poly.type)
          ? poly
          : {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: poly,
              },
            },
      );

      map.current.fitBounds(boundingBox, {
        padding: boundsPadding,
        duration: 0,
      });

      map.current.on('resize', () => {
        map.current.fitBounds(boundingBox, {
          padding: boundsPadding,
          duration: 0,
        });
      });
    }
  };
};

/**
 * Adjusts the map view to fit the provided features within the visible area.
 * It modifies the map's width and height to maintain an appropriate aspect ratio if `fitMapToPolygons` is enabled.
 *
 * @param {Object} map - The Mapbox map instance.
 * @param {Array} features - An array of GeoJSON features to fit in the map view.
 * @param {boolean} fitMapToPolygons - Whether to adjust the map dimensions based on polygon aspect ratio.
 * @param {boolean} fitBounds - Whether to fit the map view to the feature bounding box.
 * @param {number} boundsPadding - Padding (in pixels) to apply when fitting the bounds.
 * @param {boolean} initWidth - If true, initializes width adjustments.
 * @param {boolean} initHeight - If true, initializes height adjustments.
 */
const fitMapToFeatures = (
  map,
  features,
  fitMapToPolygons,
  fitBounds,
  boundsPadding,
  initWidth,
  initHeight,
) => {
  if (!features?.[0] || (!fitMapToPolygons && !fitBounds)) return;

  const mergedFeatures = {
    type: 'FeatureCollection',
    features: [],
  };

  features.forEach((item) => {
    if (item.type === 'FeatureCollection') {
      mergedFeatures.features.push(...item.features);
    } else if (item.type === 'Feature') {
      mergedFeatures.features.push(item);
    }
  });

  const boundingBox = bbox(mergedFeatures);
  const [minLon, minLat, maxLon, maxLat] = boundingBox;

  // Adjust map container dimensions if `fitMapToPolygons` is enabled.
  if (fitMapToPolygons) {
    const ratio = (maxLon - minLon) / (maxLat - minLat);
    const aspectRatio = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);

    if (initHeight || !initWidth) {
      const height = map.getContainer().clientHeight;
      const width = height * ratio * aspectRatio;
      map.getContainer().style.width = `${width}px`;
      map.getContainer().parentNode.style.width = `${width}px`;
    } else {
      const width = map.getContainer().clientWidth;
      const height = width / (ratio * aspectRatio);
      map.getContainer().style.height = `${height}px`;
      map.getContainer().parentNodestyle.height = `${height}px`;
    }
    map.resize();
  }

  requestAnimationFrame(() => {
    map.fitBounds(boundingBox, { padding: boundsPadding, duration: 0 });
  });
};

/**
 * Determines whether a point is inside a polygon using the ray casting algorithm.
 * Based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
 *
 * @param {Array<number>} point - [lon, lat] coordinates of the point to check.
 * @param {Array<Array<number>>} polygon - An array of [lon, lat] coordinates representing the vertices of the polygon.
 * @returns {boolean} True if the point is inside the polygon, false otherwise.
 */
const pointInPolygon = (point, polygon) => {
  const [x, y] = point;
  let inside = false;

  // Loop through vertices of the polygon
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    // Check if point is within the polygon using ray casting algorithm
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Finds which state/province a given coordinate belongs to based on GeoJSON data.
 *
 * @param {number} lon - The longitude of the coordinate to check.
 * @param {number} lat - The latitude of the coordinate to check.
 * @param {Object} geoJson - A GeoJSON FeatureCollection containing state/province boundaries.
 * @returns {Object|null} The properties object of the matching state/province, or null if no match is found.
 */
const findState = (lon, lat) => {
  const point = [lon, lat];

  for (const feature of boundaries.features) {
    if (feature.geometry.type === 'Polygon') {
      // Check the outer ring of the polygon
      const coordinates = feature.geometry.coordinates[0];
      if (pointInPolygon(point, coordinates)) {
        return feature.properties;
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      // Check each polygon in the MultiPolygon
      for (const polygon of feature.geometry.coordinates) {
        if (pointInPolygon(point, polygon[0])) {
          return feature.properties;
        }
      }
    }
  }
  return null; // Point is not within any state
};

/**
 * Checks if WebGL is supported by the browser.
 *
 * @returns {boolean} True if WebGL is supported, false if not.
 */
const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl && gl instanceof WebGLRenderingContext;
  } catch (e) {
    console.error('WebGL not supported.');
    return false;
  }
};

export {
  geocodeReverse,
  coordinatesGeocoder,
  calcArea,
  getElevation,
  addPolygonToMap,
  fitMapToFeatures,
  findState,
  isWebGLSupported,
};
