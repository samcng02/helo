myApp.config(['$routeProvider', '$locationProvider', '$provide', function ($routeProvider, $locationProvider, $provide) {
    $locationProvider.hashPrefix('');
    $routeProvider
    // route for the home page
    .when('/home', {
        templateUrl: 'view/home.html',
        //controller: 'HomeController',
    })
    // route for the about page
    .when('/checkMachine', {
        templateUrl: 'view/checkMachine.html',
        //controller: 'CheckMachineController',
    })
    // route for the contact page
    .when('/checkMachineAdd', {
        templateUrl: 'view/checkMachineAdd.html',
        //controller: 'CheckMachineAddController'
    })
    .when('/maintain', {
        templateUrl: 'view/maintain.html',
        //controller: 'MaintainController',
        reloadOnSearch: false
    })
    .when('/maintainAdd', {
        templateUrl: 'view/maintainAdd.html',
        //controller: 'MaintainAddController'
    })
    .when('/maintainX', {
        templateUrl: 'view/maintainX.html',
        //controller: 'MaintainXController'
    })
    .when('/maintainXAdd', {
        templateUrl: 'view/maintainXAdd.html',
        //controller: 'MaintainXAddController'
    })
    .when('/materialRequest', {
        templateUrl: 'view/materialRequest.html',
        //controller: 'MaterialRequestController'
    })
    .when('/materialRequestAdd', {
        templateUrl: 'view/materialRequestAdd.html',
        //controller: 'MaterialRequestController'
    })
    .when('/merchandise', {
        templateUrl: 'view/merchandise.html',
        //controller: 'MerchandiseController'
    })
    .when('/merchandiseAdd', {
        templateUrl: 'view/merchandiseAdd.html',
        //controller: 'MerchandiseAddController'
    })
    .when('/rotateDepot', {
        templateUrl: 'view/rotateDepot.html',
        //controller: 'RotateDepotController'
    })
    .when('/rotateDepotAdd', {
        templateUrl: 'view/rotateDepotAdd.html',
        //controller: 'RotateDepotAddController'
    })
    .when('/login', {
        templateUrl: 'view/login.html',
        //controller: 'LoginController'
    })
    .otherwise({
        redirectTo: '/home',
    })
}]);