/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		if(PushbotsPlugin.isiOS()){
			PushbotsPlugin.initializeiOS("55d02e55177959ce728b457d");
		}
		if(PushbotsPlugin.isAndroid()){
			PushbotsPlugin.initializeAndroid("55d02e55177959ce728b457d", "766513874967");
		}
		
		navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);				
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {	
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		
		function myMsgClickHandler(msg){
			console.log("Clicked On notification" + JSON.stringify(msg));
			alert(JSON.stringify(msg));
		}
		PushbotsPlugin.onNotificationClick(myMsgClickHandler);
    },
	
	onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);

        var mapOptions = {
            center: latLong,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
        var marker = new google.maps.Marker({
              position: latLong,
              map: map,
              title: 'my location'
          });
		alert('Sukses maps loaded');
    },
    
    onError: function(error){
        alert("the code is " + error.code + ". \n" + "message: " + error.message);
    }
};
app.initialize();
// notif event
(function($){
$(document)
// Login
.ready(function()
{	
	$('#close').click(function()
	{
		$("#hasil").hide("slow");
		$("#close").hide("slow");
	})
	$('#cek').click(function()
	{
		var rootUrl = 'http://www.sastrahost.com/mutasi-bank/';
		var origin = rootUrl + 'cekApp.php';
		var dataString = 'token=true';
		$.ajax({
		type: "POST",
		url: origin,
		data: dataString,
		cache: false,
		beforeSend: function(){ $("#cek").text('Connecting...');},
		success: function(data){
		if(data != "false"){
			//alert(data);
			$("#cek").text('Cek Lagi');
			$("#hasil").show("slow");
			$("#close").show("slow");
			$("#hasil").html("<h3>"+data+"</h3>");
			//alert('harusnya bisa');
		}else{
			$("#hasil").html("<span style='color:#cc0000'>Error:</span> Invalid email and password. ");
			//alert('API nya gagal');
		}
	  },
	  error: function(XMLHttpRequest, textStatus, errorThrown) {
		alert(textStatus);
	  }
	});
	return false;
 });
})  
})(jQuery);
