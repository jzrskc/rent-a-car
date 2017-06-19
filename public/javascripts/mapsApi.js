var loadMap = function() {

  var myOptions = {
    center: new google.maps.LatLng(43.5231699, 16.4505675),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("map"), myOptions);

    // Add -1- marker
    var marker = new google.maps.Marker({
      position:{ lat:43.5231699, lng:16.4505675 },
      map:map
    });

    var infoWindow = new google.maps.InfoWindow({
      content:'<h4>Operating Hours:</h4><p>Monday-Saturday: 8:00 – 16:00</p>'
    });

    marker.addListener('click', function(){
      infoWindow.open(map, marker);
    });

};
window.onload = loadMap;
