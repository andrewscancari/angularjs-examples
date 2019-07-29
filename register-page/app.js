var app = angular.module('app', ['ngRoute']);

app.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.userdata = {};
});

app.controller('LoginController', function ($scope, $routeParams) {
  $scope.params = $routeParams;
});

app.controller('RegisterController', function ($scope, $routeParams) {
    $scope.params = $routeParams;
});


app.config(function($routeProvider) {
    $routeProvider

    .when('/login', {
        templateUrl : 'login.html',
        controller  : 'LoginController'
    })

    .when('/register/step1', {
      templateUrl : 'step1.html',
      controller  : 'RegisterController'
    })
  
    .when('/register/step2', {
      templateUrl : 'step2.html',
      controller  : 'RegisterController'
    })
  
    .when('/register/step3', {
      templateUrl : 'step3.html',
      controller  : 'RegisterController'
    })
  
    .otherwise({ redirectTo : function(){
      window.hash = "";
      window.location = 'index.html#!/login';
    }});
});