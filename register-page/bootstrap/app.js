var app = angular.module('app', ['ngRoute']);

app.factory("CustomUtils", ($q, $http) => {
	var service = {};

	service.custom_get = (url, params, do_not_show_loader) => {
      if(!do_not_show_loader) service.showLoader(true);
      
      let promise = $http({
        method 	     : 'GET',
        url 	       : url,
        params       : params
      }).then(responseSuccess => {
        service.showLoader(false);

        return responseSuccess;
      }).catch(responseError => {
        service.showLoader(false);

        console.error(responseError);

        return $q.reject(responseError);
      });

      return promise;
		}
		
	service.custom_post = (url, data, do_not_show_loeader) => {
    
    if(!do_not_show_loeader) service.showLoading(true);
    
		let promise = $http({
			method 	     : 'POST',
			url 	       : url,
			data         : data
		}).then(responseSuccess => {
      service.showLoader(false);

      return responseSuccess;
    }).catch(responseError => {
      service.showLoader(false);

      console.error(responseError);

      return $q.reject(responseError);
    });

    return promise;
  }
  
  service.getAddressByCPF = cep => {
    if(!cep) {
      alertify.warning('Ops! CEP em branco.');
      return $q.reject();
    }
    
    cep = cep.replace(/\D/g,'');
    if(cep.length < 8) {
      alertify.warning('Ops! CEP incorreto.');
      return $q.reject();
    }
    
    let promise;

    promise = service.custom_get('//viacep.com.br/ws/' + cep + '/json/').then(success => {
      if(!success.data.erro) {
        alertify.success('Endereço carregado com sucesso!');
        return success;
      } else {
        alertify.warning('Ops! Endereço não encontrado.');
        return $q.reject(success);
      }
    }, function myError(success) {
      alertify.error('Erro ao executar requisição');
      return $q.reject(success);
    });

    return promise;
  }

	service.showLoader = show => {
    if(show) {
      $('input').prop('disabled', true);
      $('#screenLoader').fadeIn(200);
    } else {
      $('#screenLoader').fadeOut(200);
      $('input').prop('disabled', false);
    }
	}

	return service;
});

app.controller('MainController', ($scope, $route, $routeParams, $location, CustomUtils) => {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.userdata = {};

    $scope.mockUserdata = () => {
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

    $scope.fillAddressByCep = () => {
      CustomUtils.getAddressByCPF($scope.userdata.cep).then( success => {
          $scope.userdata.street = success.data.logradouro;
          $scope.userdata.district = success.data.bairro;
          $scope.userdata.city = success.data.localidade;
          $scope.userdata.state = success.data.uf;
      }, error => {
        console.error('fillAddressByCep', error);
      });
    }

    $scope.clearUserdata = () => {
      $scope.userdata = {};
    }
});

app.controller('LoginController', function ($rootScope, $scope, $routeParams) {
  $scope.params = $routeParams;

  $rootScope.statechange = true;
});

app.controller('RegisterController', function ($rootScope, $scope, $routeParams) {
    $scope.params = $routeParams;
    
    $(document).ready(function(){
      $('.cpf').mask('000.000.000-00', {reverse: true});
      $('.cep').mask('00000-000');
    });

    $rootScope.statechange = true;
});


app.config(function($routeProvider) {
    $routeProvider

    .when('/login', {
        templateUrl : 'templates/login.html',
        controller  : 'LoginController'
    })

    .when('/register/step1', {
      templateUrl : 'templates/step1.html',
      controller  : 'RegisterController'
    })
  
    .when('/register/step2', {
      templateUrl : 'templates/step2.html',
      controller  : 'RegisterController'
    })
  
    .when('/register/step3', {
      templateUrl : 'templates/step3.html',
      controller  : 'RegisterController'
    })
  
    .otherwise({ redirectTo : function(){
      window.hash = "";
      window.location = 'index.html#!/login';
    }});
});

app.directive('showDuringResolve', function($rootScope) {
  return {
    link: function (scope, element) {
      element.addClass('ng-hide');
      
      $rootScope.statechange = true;

      var unregister = $rootScope.$on('$routeChangeStart', function () {
        element.removeClass('ng-hide');
        $rootScope.statechange = false;
      });

      scope.$on('$destroy', unregister);
    }
  };
});