/*
  Handles reverse geocoding from lat lon to asci address
*/

async function geocodeReverse({
  apiKey,
  setterFunc,
  latitude,
  longitude,
}) {
  await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude}%2C%20${latitude}.json?access_token=${apiKey}`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        setterFunc((prevVal) => {
          const value = (parm) => (
            data.features.filter((feature) => feature.id.includes(parm))[0]
          );
          const newVal = {
            ...prevVal,
            fullAddress: data.features[0].place_name,
            address: data.features[0].place_name.split(',')[0],
            zipCode: value('postcode')?.text,
            city: value('place')?.text,
            county: value('district')?.text,
            state: value('region')?.text,
            stateAbbreviation: value('region')?.properties?.short_code.replace(/US-/, ''),
          };
          return newVal;
        });
      }
    });
}

/* Given a query in the form "lng, lat" or "lat, lng"
 * returns the matching geographic coordinate(s)
 * as search results in carmen geojson format,
 * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */
const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i,
  );
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
      // eslint-disable-next-line prefer-template
      place_name: 'Lat: ' + lat + ' Lng: ' + lng,
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
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

export { geocodeReverse, coordinatesGeocoder };
