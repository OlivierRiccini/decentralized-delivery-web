// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    access_token: 'pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw',
    geocodingBaseUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    directions: 'https://api.mapbox.com/directions/v5/mapbox/driving/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
