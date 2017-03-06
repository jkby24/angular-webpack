/**
 * ES6 Module
 */
import './index.html';
import 'app-loading';
import 'common-filter';
import 'common-service';
import 'search-require';
import 'permission-check';
// import '../../../components/service/api-service.js';
export default $app.controller('homeIndexController',
    function ($scope, $stateParams, $timeout,commonService,apiService) {
        // $scope.a = commonService.getMegTest();
        // apiService.getHttpTest().then(function(data){
        //   console.log(data);
        // });
        // console.log('123');
        $scope.reply = function(){
          alert('响应了按钮的事件')
        }

    }
);
