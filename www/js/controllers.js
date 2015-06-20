var app = angular.module('starter.controllers', ['ngCordova','ionic.service.core'])

app.constant('ApiEndpoint', {
  url: 'http://localhost:8100/api'
});

app.factory('Api', function($http, ApiEndpoint){
  console.log('ApiEndpoint', ApiEndpoint)

  var getApiData = function() {
    return $http.get(ApiEndpoint.url + '/parking')
      .then(function(data) {
        console.log('Got some data: ', data);
        return data;
      });
  };

  return {
    getApiData: getApiData
  };
});

app.controller('MapCtrl', function($scope, $ionicLoading, $cordovaGeolocation,Api, $http) {

$scope.data = null;


  $scope.message = "Now viewing home!";
 
    $scope.parkings = {
        ParkingName: "",
        Rate: ""      
    };
//$scope.data = MyAPIService.data();
  //console.log("  fidico "+$scope.data);

      var myLatlng = new google.maps.LatLng(-17.375201, -66.176922);

      var mapOptions = {
          center: myLatlng,
          zoom: 25,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
     

 $scope.mapCreated = function(map) {
    $scope.map = map;
  Api.getApiData()
  .then(function(result) {
    $scope.data = result.data;
           console.log('Fidel ', $scope.data[0].ParkingName);

for (var i=0; i<$scope.data.length; i++)
      {
           var latitude = $scope.data[i].Local.Latitude;
           var longitude = $scope.data[i].Local.Longitude;
            console.log('Fidel ', $scope.data[i].ParkingName +" "+latitude+" "+longitude );

            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

           var marker2 = new google.maps.Marker({
              position: new google.maps.LatLng(latitude, longitude),
              map: map,
              title: "Mi locacion",
              icon:  iconBase + 'parking_lot_maps.png',
              options: { draggable: true }
        
             });
           marker2['parking'] = $scope.data[i];
           google.maps.event.addListener(marker2, 'click', function() { 
             
             var slide = document.getElementById("slide");
             slide.innerHTML = "<h4>"+this.parking.ParkingName+"</h4><p>Autos:"+this.parking.CarSpacesAvailable+"/"+this.parking.CarSpacesTotal+"</br>"+
             "Motos: "+this.parking.MotorBikeSpacesAvailable+"/"+this.parking.MotorBikeSpacesTotal+ "</br>"+
             "Tarifa: "+this.parking.Rate+
             "</p>";

    }); 
       }

  });

      var marker = new google.maps.Marker({
              position: new google.maps.LatLng(-17.375201, -66.176922),
              map: map,
              title: "Mi locacion",
              options: { draggable: true }
      });



var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
       var lat  = position.coords.latitude
       var long = position.coords.longitude
       $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));       
        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
       console.log(lat + "  joder  "+ long)
    }, function(err) {
      console.log("error1");
    });


  var watchOptions = {
    frequency : 1000,
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      console.log(err);
    },
    function(position) {
       var lat  = position.coords.latitude
       var long = position.coords.longitude
       marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
       console.log(lat + " pepe  "+ long)
  });





  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      var myLatlng = new google.maps.LatLng(-17.375201, -66.176922);
      //$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.map.setCenter(myLatlng);
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});

