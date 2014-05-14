'use strict';
function $ModelProvider(){

  var $model = {}, models = {};

  var modelConfig = {
    register: function(name, config){
      var model = models[name];
      _.extend(model, config);
    }
  };

  function registerModel(name, config){
    if(_.has(models, name)) throw new Error('model is already defined');

    models[name] = {
      name: name
    };

    if(_.isEmpty(config)) return this;

    /*call config and set model properties*/
    modelConfig.register(name, config);
    return this;
  }

  this.model = registerModel;

  this.$get = [function(){

    $model.get = function(name){
      if(_.has(models, name)) return models[name];

      var list = [];
      forEach(models, function(model){
        list.push(model);
      });
      return list;
    };





    return $model;
  }];

}








angular.module('model', [])
  .provider('$model', $ModelProvider);