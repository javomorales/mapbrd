// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var map;
var lat = 40.42238718089105;
var lng = -3.6995601654052734;
var zoomFactor = 15;

var polygons_in_map=[];


function drawPolygons() {
  
  if (geojson_data.coordinates) {
    $.each(geojson_data.coordinates, function(index, poly) { 
      var _coords=[];
      $.each(poly[0], function(index, c) {
        _coords.push(new GLatLng(c[1], c[0]));
      });
      polygons_in_map.push(polygonConstructor(_coords,false)); 
    });
  }
  
}

function polygonConstructor(coords,enable_drawing) {
  var polygon = new GPolygon(coords);
  map.addOverlay(polygon);
  if(enable_drawing) {
    polygon.enableDrawing();
  }
  polygon.enableEditing({onEvent: 'mouseover'});
  GEvent.addListener(polygon, "cancelline", function() {});
  GEvent.addListener(polygon, "endline", function() {});
  
  return   polygon;
}


function createPolygon() {
  polygons_in_map.push(polygonConstructor([],true));
}


function saveMap() {
  
  $("#saveButton").val(".....");
  
  var polygons_arr=[];
  
  $.each(polygons_in_map, function(index, polygon) { 
     coordinates = [];
     for (var v = 0; v < polygon.getVertexCount(); v++) {
       var lat = polygon.getVertex(v).lat();
       var lng = polygon.getVertex(v).lng();
       coordinates.push([lng + " " + lat]);
     }
     polygons_arr.push(coordinates.join(","));
  });
  
  var wkt = "MULTIPOLYGON((("+polygons_arr.join(")),((")+")))";  
  var data_to_send = {uuid:$("#uuid").val(),wkt:wkt};
  
  
  $.ajax({
    type: "POST",
    url: "/save",
    data: data_to_send,
    success: function(){
      $("#saveButton").val("save map");
    },
    error: function(){
      alert("ha ocurrido un error");
    }
  });
  
  
  
}

$(document).ready(function(){
  
  map = new GMap2(document.getElementById("map"));
  map.setCenter(new GLatLng(lat, lng), zoomFactor);
  map.setUIToDefault();

  drawPolygons();


});
