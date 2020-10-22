import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() public remoteFormGroup: FormGroup;
  public map: mapboxgl.Map;
  public isMapLoaded = false;
  public mapContainerId: string;

  constructor(private web3Service: Web3Service) {
    this.mapContainerId = 'map-container-' + new Date().getTime().toString();
  }

  public ngAfterViewInit(): void {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.access_token);

    this.map = new mapboxgl.Map({
      container: this.mapContainerId,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-96, 37.8],
      zoom: 0,
      attributionControl: false
    });

    this.map.addControl(new mapboxgl.FullscreenControl());

    this.map.on('load', () => {
      this.map.resize();

      navigator.geolocation.getCurrentPosition((position) => {
        const location = [+position.coords.longitude, +position.coords.latitude];
        console.log(location);
        this.map.flyTo({
          center: location as mapboxgl.LngLatLike,
          zoom: 9,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

        this.map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
          if (error) {
            throw error;
          }

          this.map.addImage('custom-marker', image);

          this.map.addSource('points', {
            type: 'geojson',
            data: {
              'type': 'FeatureCollection',
              'features': [{
                // feature for Mapbox DC
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': location
                },
                'properties': { }
              }]
            }
          });

          this.map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
            'icon-image': 'custom-marker',
            // get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
            }
          });

          const source: mapboxgl.GeoJSONSource = this.map.getSource('points') as mapboxgl.GeoJSONSource;
          this.web3Service.deliveryFeatures$.subscribe((deliveryFeatures: any) => {
            source.setData({type: 'FeatureCollection', features: deliveryFeatures});
          });
        });


        this.isMapLoaded = true;
      });

      this.map.on('fullscreenchange', function () {
        if (this.map.isFullscreen()) {
            console.log('entered fullscreen');
            this.map.resize();
        } else {
            console.log('exited fullscreen');
            this.map.resize();
        }
      });


    });

    if (this.remoteFormGroup) {
      this.initDirections();
    }

  }

  private initDirections(): void {
    const mapDirections = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      routePadding: 100
    });

    this.map.addControl(mapDirections, 'top-left');

    mapDirections.on('origin', o => {
      console.log('A ', o.feature.geometry);
      console.log(this.remoteFormGroup);
      const fromCtl = this.remoteFormGroup.get('fromAddress');
      const fromCoordinates = o.feature.geometry.coordinates[0].toString() + ',' + o.feature.geometry.coordinates[1].toString();
      fromCtl.setValue(fromCoordinates);
      // console.log(this.remoteFormGroup);
    });

    mapDirections.on('destination', des => {
      console.log('B ', des.feature.geometry.coordinates);
      const toCtl = this.remoteFormGroup.get('toAddress');
      const toCoordinates = des.feature.geometry.coordinates[0].toString() + ',' + des.feature.geometry.coordinates[1].toString();
      toCtl.setValue(toCoordinates);
    });

    mapDirections.on('route', rte => {
      console.log('Route ', rte);
    });
  }


}
