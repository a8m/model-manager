var app = angular.module('app', ['model.manager', 'ui.router'])
  .controller('mainController', function($scope, $location, $model, $history){
    window.$model = $model;
    window.$location = $location;
    window.$history = $history;
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
               controller: function($scope, $state){
               }
            })
            .state('home.id', {
               url: ':id',
               template: '<div ui-data-sref="home.id({id:2}, {key: \'value\', key2: \'value2\', key3: \'key2\'})"></div>',
               data: {},
               controller: function($stateParams, $state){
                   window.$state = $state;
                   window.state = $stateParams;
               }
            })
            .state('home.id2',{
               url: ':id/:id2',
               template: 'template with 2 params'
            });
        $urlRouteProvider.otherwise('/');
    }])


    .directive('uiDataSref', function($state){
        return{
            restrict: 'A',
            scope: {},
            link: function(scope, elm, attr){
                var stateData = parseState(attr.uiDataSref);
                var name = stateData.name,
                    params = scope.$eval(stateData.params),
                    data = scope.$eval(stateData.data);

                elm.on('click', function(event){
                    var nextState = $state.get(name);
                    for(var key in data){
                        if(data.hasOwnProperty(key)){
                            nextState.data[key] = data[key];
                        }
                    }
                    $state.go(name, params)
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

var templateHome = '<p ui-data-sref="home.id({id:2}, {key: \'value\'})"' +
    '>click me</p><p ui-sref="home.id2({id:2, id2:4})">go route with 2 params</p>'+'' +
    '<p ui-sref="home">go top state</p><div ui-view=""></div>';


/**
 * $historyProvider let you get an access to previous states/mode in your app,
 * when your state not depends on url
 */
app.provider('$history', function(){

    this.$get = function($state, $rootScope){
       var history = [];
       $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
           event.preventDefault();
            if(fromState.abstract) return;
            history.push({state: fromState, params: fromParams});
       });
        function getPreviousState(){
          return history[history.length-1] || null;
        }

        function transitionToPrevious(){
            var prev = history.pop();
            if(!prev) throw new Error('there no previous state');

            if(_.isEmpty(prev.params))
                return $state.go(prev.state.name);
            else
                return $state.go(prev.state.name ,prev.params);
        }

       return {
           getPrevState: getPreviousState,
           goPrevState: transitionToPrevious
       }
    };

});











