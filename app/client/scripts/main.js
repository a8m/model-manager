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
  }]);
