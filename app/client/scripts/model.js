'use strict';

function $ModelProvider(){

  var $model = {}, models = {};

  var modelBuilder = {
    register: function(name, config){
      var model = models[name];
      _.extend(model, config);
    }
  };
  var modelConfig = {};


  function registerModel(name, config){
    if(_.has(models, name)) throw new Error('model is already defined');

    models[name] = {
      name: name
    };

    if(_.isEmpty(config)) return this;

    /*call config and set model properties*/
    modelBuilder.register(name, config);
    return this;
  }

  this.model = registerModel;

  this.$get = $get;
  $get.$inject = ['Restangular'];
  function $get(Resource){
   var one = Resource.one, all = Resource.all;

    modelConfig.default = {
      actions: {
        get: function(id){
          var request = (!id) ? one('users') : one('users', id);
          return request.get();
        }

      }
    };

    //return current model || list
    $model.get = function(name){
      if(_.has(models, name)) return models[name];

      var list = [];
      forEach(models, function(model){
        list.push(model);
      });
      return list;
    };

    $model.rest = Resource;
    $model.$get = modelConfig.default.actions.get;
    return $model;
  };

}

angular.module('model.manager', ['restangular'])
  .provider('$model', $ModelProvider);

