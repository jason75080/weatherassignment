///// WEATHER SERVICE APP //////////////////////////////////////////////////////
var myModule = angular.module('WeatherServiceApp', ['angular-skycons']);

///// WEATHER SERVICE CONTROLLER ///////////////////////////////////////////////
myModule.controller('WeatherServiceController', 
                ['$scope', '$http', 'WUWeatherService', 'DSWeatherService',
                 'GoogleGeolocationService', function($scope, $http, WUWeatherService, 
                    DSWeatherService, GoogleGeolocationService){
    
    //refer to the controller via a variable
    var wsc = this;

    //App name    
    wsc.app_name = "Weather App";

    //cities to populate the drop-down box
    wsc.cities = 
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
    wsc.getWUCurrentConditions = function(){
        WUWeatherService.getCurrentConditions(wsc.selected_city)
            .then(function(res){

                //load things from the service
                wsc.wu_weather = res.data.current_observation;
                
                //load variables
                wsc.wu_temperature_string = wsc.wu_weather.temperature_string;
                wsc.wu_observation_time = wsc.wu_weather.observation_time;
                wsc.wu_temperature_string = wsc.wu_weather.temperature_string;
                wsc.wu_dewpoint_string = wsc.wu_weather.dewpoint_string;
                wsc.wu_wind_string = wsc.wu_weather.wind_string;
                wsc.wu_icon_url = wsc.wu_weather.icon_url;
                

            }).catch(function(error){
              console.log(error);
            });        
    }
    
    ///// GET DARK SKY /////////////////////////////////////////////////////////    
    wsc.getDSCurrentConditions = function(){
        DSWeatherService.getCurrentConditions(wsc.selected_city)
            .then(function(res){
                
                //load things from the service
                wsc.ds_weather = res.data.currently;
                
                //load variables
                wsc.ds_temperature      = wsc.ds_weather.temperature;
                wsc.ds_dewpoint         = wsc.ds_weather.dewPoint;
                wsc.ds_windBearing      = wsc.ds_weather.windBearing;
                wsc.ds_windSpeed        = wsc.ds_weather.windSpeed;
                wsc.ds_observation_time = new Date(wsc.ds_weather.time);
                wsc.ds_icon             = wsc.ds_weather.icon;
                
                console.log("Dark Sky"); 
                console.log(res); 
            }).catch(function(error){
                console.log(error);
            });        
    }    
    
    wsc.dropdowncitiesSelected = function(city){
        wsc.selected_city = city;
        wsc.getLatLonForSelected();

    }

    
    //uses the weatherService to obtain the current conditions
    wsc.getCurrentConditions = function(){
        
        var google_static_maps_key = "AIzaSyBiUpBjcnq-OEZs8MLzvdijf8BvXBLeMP8";        
        
        wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                     wsc.selected_city.lat + "," +
                                     wsc.selected_city.lon + 
                                     "&zoom=10&size=600x300&key=" +
                                     google_static_maps_key;
                                     
        console.log("Google Static Map API URL");
        console.log(wsc.google_static_maps_url);
        
        //weather underground
        wsc.getWUCurrentConditions();
            
        //darksky
        wsc.getDSCurrentConditions();
        
     

    };
    
    wsc.getLatLonForSelected = function(){
        GoogleGeolocationService.geoLocate(wsc.selected_city)
            .then(function(res){
                
                //console.log(res);

                //JSON response object documented here: https://developers.google.com/maps/documentation/geocoding/start
                wsc.selected_city.lat = res.data.results[0].geometry.location.lat;
                wsc.selected_city.lon = res.data.results[0].geometry.location.lng;
                console.log(wsc.selected_city.lat);
                console.log(wsc.selected_city.lon);
      
                //given asynchronous calling, this must occur WITHIN getLatLonForSelected          
                wsc.getCurrentConditions();                
                
                
            }).catch(function(error){
               console.log(error); 
            });
    };
    
    //final calls before loading
    wsc.selected_city = wsc.cities[0];
    wsc.getLatLonForSelected();
    //wsc.getCurrentConditions();

}]);

///// WEATHER UNDERGROUND SERVICE DIRECTIVE /////////////////////////////////////
myModule.directive('myConditionsWu', ['$sce', function($sce){

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
        templateUrl: $sce.trustAsResourceUrl('currentConditionsWU.html')
    }
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
        templateUrl: $sce.trustAsResourceUrl('currentConditionsDS.html')
    }
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
                  
    }
    
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