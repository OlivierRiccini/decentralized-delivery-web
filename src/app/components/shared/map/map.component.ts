import { Component, OnInit } from '@angular/core';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import * as mapboxgl from 'mapbox-gl';
// import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map: mapboxgl.Map;
  public isMapLoaded = false;

  constructor() { }

  public ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set('pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw')
    // mapboxgl.accessToken = 'pk.eyJ1IjoicmljY2luaW8yNTAyIiwiYSI6ImNrYjl2cXU2djA5dHIyeXFrc2J0ZDhxd3MifQ.eoEy3upDMQSU7WvQyS-tuw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-96, 37.8],
      zoom: 0,
      attributionControl: false
    });

    this.map.addControl(new mapboxgl.FullscreenControl());

    this.map.on('load', () => {
      this.map.resize();
      // this.map.addSource('earthquakes',
      // {
      //   type: 'geojson',
      //   cluster: true,
      //   clusterMaxZoom: 12, // Max zoom to cluster points on
      //   clusterRadius: 50,
      //   data: {
      //     type: 'FeatureCollection',
      //     features: []
      //   }
      // }
      // );

      navigator.geolocation.getCurrentPosition((position) => {
        const location = [+position.coords.longitude, +position.coords.latitude];
        console.log(location);
        this.map.flyTo({
          center: location as mapboxgl.LngLatLike,
          zoom: 8,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        this.isMapLoaded = true;
      });

      this.map.on('fullscreenchange', function () {
        if (this.map.isFullscreen()) {
            console.log('entered fullscreen');
        } else {
            console.log('exited fullscreen');
            this.map.resize();
        }
      });


    });

    this.map.addControl(
      new MapboxDirections({
      accessToken: mapboxgl.accessToken
      }),
      'top-left'
    );
  }


}
