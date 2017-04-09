///// WEATHER APP //////////////////////////////////////////////////////
var myModule = angular.module('WeatherApp', ['angular-skycons']);

///// WEATHER CONTROLLER ///////////////////////////////////////////////
myModule.controller('WeatherController', 
                ['$scope', '$http', 'WUWeatherService', 'DSWeatherService',
                 'GoogleGeolocationService', function($scope, $http, WUWeatherService, 
                    DSWeatherService, GoogleGeolocationService){
    
    //refer to the controller via a variable
    var wc = this;

    //App name    
    wc.app_name = "Weather App";

    //cities to populate the drop-down box
    wc.cities = 
    [
        {
            name: "Amarillo",
            url_name: "Amarillo",
            state: "TX",
            lat: 0,
            lon: 0

        },
        {
            name: "Canyon",
            url_name: "Canyon",
            state: "TX",
            lat: 0,
            lon: 0
        },
        {
            name: "Dallas",
            url_name: "Dallas",
            state: "TX",
            lat: 0,
            lon: 0
        },        
        {
            name: "Houston",
            url_name: "Houston",
            state: "TX",
            lat: 0,
            lon: 0
        },
        {
            name: "San Antonio",
            url_name: "San Antonio",
            state: "TX",
            lat: 0,
            lon: 0
        },
        {
            name: "El Paso",
            url_name: "El Paso",
            state: "TX",
            lat: 0,
            lon: 0
        },        
        {
            name: "Austin",
            url_name: "Austin",
            state: "TX",
            lat: 0,
            lon: 0
        }       
    ];
    
    
    ///// GET WEATHER UNDERGROUND //////////////////////////////////////////////
    wc.getWUCurrentConditions = function(){
        WUWeatherService.getCurrentConditions(wc.selected_city)
            .then(function(res){

                //load things from the service
                wc.wu_weather = res.data.current_observation;
                
                //load variables
                wc.wu_temperature_string = wc.wu_weather.temperature_string;
                wc.wu_observation_time = wc.wu_weather.observation_time;
                wc.wu_temperature_string = wc.wu_weather.temperature_string;
                wc.wu_dewpoint_string = wc.wu_weather.dewpoint_string;
                wc.wu_wind_string = wc.wu_weather.wind_string;
                wc.wu_icon_url = wc.wu_weather.icon_url;
                

            }).catch(function(error){
              console.log(error);
            });        
    };
    
    ///// GET DARK SKY /////////////////////////////////////////////////////////    
    wc.getDSCurrentConditions = function(){
        DSWeatherService.getCurrentConditions(wc.selected_city)
            .then(function(res){
                
                //load things from the service
                wc.ds_weather = res.data.currently;
                
                //load variables
                wc.ds_temperature      = wc.ds_weather.temperature;
                wc.ds_dewpoint         = wc.ds_weather.dewPoint;
                wc.ds_windBearing      = wc.ds_weather.windBearing;
                wc.ds_windSpeed        = wc.ds_weather.windSpeed;
                wc.ds_observation_time = new Date(wc.ds_weather.time);
                wc.ds_icon             = wc.ds_weather.icon;
                
                console.log("Dark Sky"); 
                console.log(res); 
            }).catch(function(error){
                console.log(error);
            });        
    };
    
    wc.dropdowncitiesSelected = function(city){
        wc.selected_city = city;
        wc.getLatLonForSelected();

    };

    
    //uses the weatherService to obtain the current conditions
    wc.getCurrentConditions = function(){
        
        var google_static_maps_key = "AIzaSyBiUpBjcnq-OEZs8MLzvdijf8BvXBLeMP8";        
        
        wc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                     wc.selected_city.lat + "," +
                                     wc.selected_city.lon + 
                                     "&zoom=10&size=600x300&key=" +
                                     google_static_maps_key;
                                     
        console.log("Google Static Map API URL");
        console.log(wc.google_static_maps_url);
        
        //weather underground
        wc.getWUCurrentConditions();
            
        //darksky
        wc.getDSCurrentConditions();
        
     

    };
    
    wc.getLatLonForSelected = function(){
        GoogleGeolocationService.geoLocate(wc.selected_city)
            .then(function(res){
                
                //console.log(res);

                //JSON response object documented here: https://developers.google.com/maps/documentation/geocoding/start
                wc.selected_city.lat = res.data.results[0].geometry.location.lat;
                wc.selected_city.lon = res.data.results[0].geometry.location.lng;
                console.log(wc.selected_city.lat);
                console.log(wc.selected_city.lon);
      
                //given asynchronous calling, this must occur WITHIN getLatLonForSelected          
                wc.getCurrentConditions();                
                
                
            }).catch(function(error){
               console.log(error); 
            });
    };
    
    //final calls before loading
    wc.selected_city = wc.cities[0];
    wc.getLatLonForSelected();
    //wsc.getCurrentConditions();

}]);

///// DARKSKY SERVICE DIRECTIVE ////////////////////////////////////////////////
myModule.directive('myConditionsDs', ['$sce', function($sce){

    //a reminder on naming conventions for directives: 
    //https://medium.com/@cironunesdev/angularjs-how-to-name-directives-118ac44b81d4#.idz35zby4

    /* https://docs.angularjs.org/guide/directive
    The restrict option is typically set to:

    'A' - only matches attribute name
    'E' - only matches element name
    'C' - only matches class name
    'M' - only matches comment
    */
    return {
        restrict: 'E',
        scope: true,
        //https://docs.angularjs.org/error/$sce/insecurl
        //https://docs.angularjs.org/api/ng/service/$sce#trustAsResourceUrl
        templateUrl: $sce.trustAsResourceUrl('DSDirective.html')
    };
}]);

///// GOOGLE GEOLOCATION API SERVICE FACTORY ///////////////////////////////////
myModule.factory('GoogleGeolocationService',['$sce', '$http', function($sce, $http){
    
    var geolocationService = {};
    
    //Google Maps Geocoding API key    
    var key = "AIzaSyCPZfMvH3_-dE1imk52RGEVHjnWbNscaf0";
    
    geolocationService.geoLocate = function(location){
        
        //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
        var address = "+" + location.name + ",+" + location.state;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                  address + "&key=" + key;
                  
        var trustedurl = $sce.trustAsResourceUrl(url);
        return $http.get(trustedurl);
                  
    };
    
    return geolocationService;
    
}]);

///// WEATHER UNDERGROUND WEATHER SERVICE FACTORY //////////////////////////////
myModule.factory('WUWeatherService',['$sce','$http', function($sce, $http){

    //factory allows us to specify an object to send back
    var wuweatherService = {};
    
    //weather underground API key
    var key = "e0d2934addfbff88";

    //get current rest conditions
    wuweatherService.getCurrentConditions = function(city){

        //for the API
        var url = "https://api.wunderground.com/api/" +
                  key + 
                  "/conditions/q/" + 
                  city.state + "/" +
                  city.url_name + ".json";
                  
        //console.log(url);                  

        var trustedurl = $sce.trustAsResourceUrl(url);
        return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});

    };
    
    return wuweatherService;
}]);

///// DARKSKY WEATHER SERVICE FACTORY //////////////////////////////////////////
myModule.factory('DSWeatherService',['$sce','$http', function($sce, $http){

    //factory allows us to specify an object to send back
    var dsweatherService = {};
    
    //DarkSky API key
    var key = "5703850e53c12bb91f4e5d4c9eae6097";

    //get current rest conditions
    dsweatherService.getCurrentConditions = function(city){

        //for the API
        var url = "https://api.darksky.net/forecast/" +
                  key + "/" + city.lat + "," + city.lon;
                  
        console.log(url);

        var trustedurl = $sce.trustAsResourceUrl(url);
        return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});

    };
    
    return dsweatherService;
}]);