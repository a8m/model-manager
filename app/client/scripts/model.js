'use strict';

function $ModelProvider(){

  var $model = {}, models = {};

  var modelBuilder = {
    register: function(name, config){
      var model = models[name];
      _.extend(model, config);
    }
  };
  var modelConfig = {
  };

  //bound restangular
  function boundRestangular(Restangular){
    var one = Restangular.one, all = Restangular.all;
    var actions = {
      get: function(id){
        //TODO:make it more generic, build all route in first registration
        var path = (this.paths) ? setPath(this, 'get') : this.name;

        var request = (!id) ? one(path) : one(path, id);
        return request.get();
      },
      post: function(id){
        var request = (!id) ? one('users') : one('users', id);
        return request.post();
      }
    };
    forEach(models, function(model){
      model.get = actions.get;
      model.post = actions.post;
    });
  }
  //end bound anguar

  //setPath
  function setPath(model, actionName){
    return (_.has(model.paths, actionName)) ? model.paths[actionName] : model.name;
  }//end setPath

  //register each model
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
  //end register

  //$get function
  this.$get = $get;
  $get.$inject = ['Restangular'];
  function $get(Restangular){

    boundRestangular(Restangular);

    //return current model || list
    $model.get = function(name){
      if(_.has(models, name)) return models[name];

      var list = [];
      forEach(models, function(model){
        list.push(model);
      });
      return list;
    };


    $model.res = Restangular;
    return $model;
  };
  //end $get function

}

angular.module('model.manager', ['restangular'])
  .provider('$model', $ModelProvider);
