var ItemView = function(place) {
    var favorites = [];

    this.initialize = function() {
        this.$el = $('<div/>');
        this.$el.on('click', '.mapBtn', this.mapIt);
        this.$el.on('click', '.favoriteBtn', this.favorite);
        this.$el.on('click', '.shareBtn', this.share);
     };

    this.render = function() {
        this.$el.html(this.template(place));
        return this;
    };

    this.mapIt = function() {
        if (navigator.connection && navigator.connection.type == Connection.NONE) {
            alert("Mapping requires a network connection but we have detected you are currently offline. ");
        }
        else {
            var there = new google.maps.LatLng(place.latitude, place.longitude);

            var mapOptions = {
                center: {lat: place.latitude, lng: place.longitude},
                zoom: 16
            };

            // Use existing empty map canvas element to show new map at that position and set a height
            $('#map_canvas').css('height', '400px');
            var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            // When the tiles load, add a marker to denote title and address of location
			
				
			var redIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
            var marker = new google.maps.Marker({
                    position: {lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
                    map: map,
					animation: google.maps.Animation.DROP,
                    title: place.name + " " + place.location,
					icon: redIcon
                });
			
			var contentString = '<h4>'+ place.name +'</h4>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
            marker.setMap(map);
			infowindow.open(map, marker);	
			
                navigator.geolocation.getCurrentPosition(function (position) {
					var arrlocation = [
						[ position.coords.latitude ,  position.coords.longitude, 'My Location'],
					]
					
					setMarkers(map,arrlocation); 
                    var here = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    // Use Google Maps Geometry library to compute distance between two points and produce a message
                    var distance = (google.maps.geometry.spherical.computeDistanceBetween(here, there) / 1000).toFixed(2);
                    var msg = "You are " + distance + "KM away from here";
				
            google.maps.event.addListener(map, 'tilesloaded', function() {

                    if (window.cordova && window.plugins && window.plugins.toast)
                        window.plugins.toast.showShortCenter(msg);
                    else $('#distance').html(msg); //alert(msg);

                },function(error){console.log("Error retrieving location " + error.code + " " + error.message)});
				
                google.maps.event.removeListener(map, 'tilesloaded');

            });
        }

    }
	function setMarkers(map,arrlocation) {		
			var blueIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
			var locationList = [
                    [ arrlocation[0][0], arrlocation[0][1],arrlocation[0][2] ,blueIcon , 1]	
             ];
			 console.log(arrlocation);
			  for (var i = 0; i < locationList.length; i++) {
				var loc = locationList[i];
				if(loc[4] == 1){
					//alert('loaded');
					var myCity = new google.maps.Circle({
					  center: new google.maps.LatLng(parseFloat(loc[0]),parseFloat(loc[1])),
					  radius:20000,
					  strokeColor:"#0000FF",
					  strokeOpacity:0.8,
					  strokeWeight:2,
					  fillColor:"#0000FF",
					  fillOpacity:0.4
					  });
				}
				var contentString = '<h4>'+ loc[2] +'</h4>';
				var infowindow = new google.maps.InfoWindow({
					content: contentString
				});
				var marker = new google.maps.Marker({
				  position: {lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) },
				  map: map,
				  icon: loc[3],
				  title: loc[2],				  
				  zIndex: loc[4]
				});
				marker.addListener('click', function() {
					infowindow.open(map, marker);
				});
			  }
			}
			
    // Use the social sharing plugin to share on the native OS
    this.share = function() {
        // Also sharing the location's picture to show how you can use one within your message as well.
        if (window.cordova && window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share("Hey look where I'm going next: " + place.name + ".",
                'My Amsterdam Trip', "www/pics/"+place.pic, place.website,
                function () {
                    console.log("Success")
                },
                function (error) {
                    console.log("Share fail " + error)
                });
        }
        else alert("Social sharing plugin not found or not supported.");
    }


    // Implemented for future use to show a list of favorites
    this.favorite = function() {
        favorites.push(place);

        if (window.cordova && window.plugins && window.plugins.toast)
            window.plugins.toast.showShortCenter(place.name + " at " + place.location + " has been added to your favorites.");
        else alert(place.name + " at " + place.location + " has been added to your favorites.");
    }

    this.initialize();

}
