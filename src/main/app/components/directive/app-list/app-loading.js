import './app-loading.html';
export default $app.directive('appLoading',
  function(){
    return {
      restrict: 'EA',
      template: require('./app-loading.html')
    };
  }
);
