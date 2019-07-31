var app = angular.module('app', ['ngRoute']);

app.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.userdata = {};

    $scope.mockUserdata = function() {
      $scope.userdata = {
        "cpf": "33470616833", 
        "firstname": "Andrew", 
        "lastname": "Scancari", 
        "date_of_birth": new Date("1991-02-09T02:00:00.000Z"), 
        "cep": "03306050", 
        "street": "Rua Francisco Paulo", 
        "street_number": "47", 
        "district": "Cidade Mãe do Céu", 
        "state": "São Paulo", 
        "city": "São Paulo"
      }
    }

    $scope.clearUserdata = function() {
      $scope.userdata = {};
    }
});

app.controller('LoginController', function ($scope, $routeParams) {
  $scope.params = $routeParams;
});

app.controller('RegisterController', function ($scope, $routeParams) {
    $scope.params = $routeParams;

    $(document).ready(function(){
      $('.cpf').mask('000.000.000-00', {reverse: true});
      $('.cep').mask('00000-000');
    });
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