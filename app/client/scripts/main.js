angular.module('app', ['model.manager', 'ui.router'])
  .controller('mainController', function($scope, $model){
    window.$model = $model;
    $scope.models = $model.get();
  })
  .config(['$modelProvider', function($modelProvider){
    $modelProvider
      .model('user', {

      })
      .model('users', {
        paths: {
          get: 'get_users'
        }
      })
      .model('car', {

      });
  }])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouteProvider){
    $stateProvider
      .state('home', {
        url: '/',
        template: templateHome,
        data: {},
        controller: function($scope, $state){
          $scope.id = 4;
        },
        resolve: {
          malloc: function($state){
            $state.get('home').data.foo = 'foo';
            return {};
          }
        }
      })
      .state('home.id', {
        url: ':id',
        template: '<div>child</div>',
        data: {},
        controller: function($state){
        },
        resolve: {
          alloc: function($state){
            var params;
            if(!$state.current.$next)
              params =  $state.get('home').data;
            else
              params = $state.current.$next.data;

            console.log(params);
          }
        }
      });
    $urlRouteProvider.otherwise('/');
  }])


  .directive('uiDataSref', function($state, $rootScope){
    return{
      restrict: 'A',
      scope: {},
      link: function(scope, elm, attr){
        var stateData = parseState(attr.uiDataSref);
        var name = stateData.name,
          params = scope.$eval(stateData.params),
          data = scope.$eval(stateData.data);
        console.log(params)

        elm.on('click', function(event){
          var nextState = $state.get(name);
          $state.current.$next = nextState;
          for(var key in data){
            if(data.hasOwnProperty(key)){
              nextState.data[key] = data[key];
            }
          }
          $state.transitionTo(name, params);
        });
        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState){
            event.preventDefault();
            delete fromState.$next;
          })
      }
    }
  });

function parseState(ref){
  if(!ref.length) return {};
  var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  var name = parsed[1] || "",
    list = parsed[3].replace(/ /g, ""),
    crossChar = list.indexOf("},{")+1;

  return {
    name: name,
    params: list.substr(0,crossChar),
    data: list.substr(crossChar+1)
  };
}

var templateHome = '<p ui-data-sref="home.id({id: {{ id }} }, {key: \'value\', foo: \'bar\'})">click me</p><div ui-view=""></div>';
