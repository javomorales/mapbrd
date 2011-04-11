// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var lat = 40.42238718089105;
var lng = -3.6995601654052734;
var zoomFactor = 15;

$(document).ready(function(){
  
  var centerCoord = new google.maps.LatLng(lat, lng);
  var mapOptions = { zoom: zoomFactor, center: centerCoord, mapTypeId: google.maps.MapTypeId.TERRAIN, disableDoubleClickZoom:true };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
});
