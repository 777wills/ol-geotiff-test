import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
// import Layer from 'ol/layer/Layer';
import * as proj from 'ol/proj';
import * as extent from 'ol/extent';
// import Source from 'ol/source/Source';
import WMTS from 'ol/source/WMTS';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import Attribution from 'ol/control/Attribution';
import * as control from 'ol/control';
import { olGeoTiff } from '../class/olgeotiff.js'

// import Map form ''

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map;

  constructor() {}

  ionViewDidEnter() {
    this.initializeMap();
  }

  initializeMap() {
    const projection = proj.get('EPSG:4326');
    const projectionExtent = projection.getExtent();
    const size = extent.getWidth(projectionExtent) / 256;
    const resolutions = new Array(18);
    const matrixIds = new Array(18);

    for (let z = 0; z < 18; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      // eslint-disable-next-line no-restricted-properties
      resolutions[z] = size / Math.pow(2, (z + 1));
      matrixIds[z] = z;
    }

    let wmslayer_s2 = new TileLayer({
      source: new WMTS({
        url: '',
        layer: '0',
        matrixSet: 'EPSG:4326',
        style: 'default',
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        requestEncoding: 'REST',
        transition: 0,
      })
    })

    let tile_grid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds
    });
    let s2maps = new TileLayer({
      source: new WMTS({
        layer:'s2cloudless',
        // attributions:[new Attribution({html:'<a xmlns:dct="http://purl.org/dc/terms/" href="https://s2maps.eu" property="dct:title">Sentinel-2 cloudless - https://s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://eox.at" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2016 &amp; 2017)'})],
        matrixSet:'WGS84',
        format:'image/jpeg',
        projection:projection,
        tileGrid:tile_grid,
        style:'default',
        wrapX:!0,
        urls:[
          "//a.s2maps-tiles.eu/wmts/",
          "//b.s2maps-tiles.eu/wmts/",
          "//c.s2maps-tiles.eu/wmts/",
          "//d.s2maps-tiles.eu/wmts/",
          "//e.s2maps-tiles.eu/wmts/"
        ]
      })
    })

    let map_result_s2 = new Map({
      target: 's2map',
      layers: [
        s2maps,
        wmslayer_s2,
      ],
      view: new View({
        projection,
        center: [16.411407470703125, 48.27875518798828],
        zoom: 12,
        maxZoom: 14,
        minZoom: 3
      }),
      controls: control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }),
    });

    // setup datafunctions
    var datafunctions = {};
    datafunctions['NDVI'] = function(b) {
      if(b[1]+b[2]+b[3]+b[4]==0) return 10; // return 10 as nodata value
      return ( b[4] - b[3] ) / ( b[4] + b[3] ); // otherwise return NDVI
    };
    datafunctions['NDI45'] = function(b) {
      if(b[1]+b[2]+b[3]+b[4]==0) return 10; // return 10 as nodata value
      return ( b[4] - b[1] ) / ( b[4] + b[1] ); // otherwise return NDVI
    };

  // olGeoTiff setup
    var olgt_s2map = new olGeoTiff(wmslayer_s2);
    olgt_s2map.plotOptions.domain = [-0.2, 0.2];
    olgt_s2map.plotOptions.noDataValue = 10;
    olgt_s2map.plotOptions.palette = 'blackbody';
    olgt_s2map.plotOptions.dataFunction = datafunctions['NDVI'];
    

  // setup datafunctions
    var datafunctions = {};
    datafunctions['NDVI'] = function(b) {
      if(b[1]+b[2]+b[3]+b[4]==0) return 10; // return 10 as nodata value
      return ( b[4] - b[3] ) / ( b[4] + b[3] ); // otherwise return NDVI
    };
    datafunctions['NDI45'] = function(b) {
      if(b[1]+b[2]+b[3]+b[4]==0) return 10; // return 10 as nodata value
      return ( b[4] - b[1] ) / ( b[4] + b[1] ); // otherwise return NDVI
    };
  
  // olGeoTiff setup
    var olgt_s2map = new olGeoTiff(wmslayer_s2);
    olgt_s2map.plotOptions.domain = [-0.2, 0.2];
    olgt_s2map.plotOptions.noDataValue = 10;
    olgt_s2map.plotOptions.palette = 'blackbody';
    olgt_s2map.plotOptions.dataFunction = datafunctions['NDVI'];

    

  }


  // initializeMap() {
  //   let layer1 = new TileLayer({
  //     source: new OSM()
  //   })

  //   this.map = new Map({
  //     target: 's2map',
  //     layers: [
  //       layer1
  //     ],
  //     view: new View({
  //       center: fromLonLat([37.41, 8.82]),
  //       zoom: 4
  //     })
  //   })
  // }

}
