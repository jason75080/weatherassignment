var myModule = angular.module('local_storage_app', []);

myModule.controller("MainController", ['$scope', 'LocalStorageService', 
                function($scope, LocalStorageService) {
    
    var mc = this;
    //run first time, then comment out
    mc.presidents =
    [
        {
            name: "Ronald Reagan",
            year: 1980
        },
        {
            name: "George H.W. Bush",
            year: 1988
        },
        {
            name: "William Clinton",
            year: 1992
        },
        {
            name: "George W. Bush",
            year: 2000
        },
        {
            name:"Barack Obama",
            year: 2008
        }
        
    ];

    
    mc.latestData = function() {
        return LocalStorageService.getData();
    };
    mc.update = function(val) {
        return LocalStorageService.setData(val);
    };
    
    //run first, as above, then comment out, as above
    mc.update(angular.toJson(mc.presidents));
    mc.presidents = LocalStorageService.getData();
    
}]);

myModule.factory("LocalStorageService", function($window, $rootScope) {
    
    angular.element($window).on('storage', function(event) {
        if (event.key === 'my-storage') {
            $rootScope.$apply();
        }
    });    
    
    return {
        setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('my-storage', val);
            return this;
        },
        getData: function() {
            
            var val = $window.localStorage && $window.localStorage.getItem('my-storage');
            
            var data = angular.fromJson(val);
            
            return data; 
        }
    };
});