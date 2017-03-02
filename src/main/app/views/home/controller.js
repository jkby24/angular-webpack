'use strict';
import './index.html';
import '../../components/service/api-service.js';//基础服务
export default $app.controller('homeController', [
    '$scope',
    function ($scope) {
        $scope.a = 1;
    }
]);
